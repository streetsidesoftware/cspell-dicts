// cspell:words zoir noalloc repr trunc foobarbaz

// <https://github.com/ziglang/zig/blob/master/lib/std/zon/parse.zig>

const std = @import("std");
const builtin = @import("builtin");
const Allocator = std.mem.Allocator;
const Ast = std.zig.Ast;
const Zoir = std.zig.Zoir;
const ZonGen = std.zig.ZonGen;
const TokenIndex = std.zig.Ast.TokenIndex;
const Base = std.zig.number_literal.Base;
const StrLitErr = std.zig.string_literal.Error;
const NumberLiteralError = std.zig.number_literal.Error;
const assert = std.debug.assert;
const ArrayListUnmanaged = std.ArrayListUnmanaged;

const valid_types = {};

pub const Options = struct {
    ignore_unknown_fields: bool = false,
    free_on_error: bool = true,
};

pub const Error = union(enum) {
    zoir: Zoir.CompileError,
    type_check: Error.TypeCheckFailure,

    pub const Note = union(enum) {
        zoir: Zoir.CompileError.Note,
        type_check: TypeCheckFailure.Note,

        pub const Iterator = struct {
            index: usize = 0,
            err: Error,
            diag: *const Diagnostics,

            pub fn next(self: *@This()) ?Note {
                switch (self.err) {
                    .zoir => |err| {
                        if (self.index >= err.note_count) return null;
                        const note = err.getNotes(self.diag.zoir)[self.index];
                        self.index += 1;
                        return .{ .zoir = note };
                    },
                    .type_check => |err| {
                        if (self.index >= err.getNoteCount()) return null;
                        const note = err.getNote(self.index);
                        self.index += 1;
                        return .{ .type_check = note };
                    },
                }
            }
        };

        fn formatMessage(self: []const u8, w: *std.Io.Writer) std.Io.Writer.Error!void {
            try w.writeAll(self);
        }

        pub fn fmtMessage(self: Note, diag: *const Diagnostics) std.fmt.Alt([]const u8, Note.formatMessage) {
            return .{ .data = switch (self) {
                .zoir => |note| note.msg.get(diag.zoir),
                .type_check => |note| note.msg,
            } };
        }

        pub fn getLocation(self: Note, diag: *const Diagnostics) Ast.Location {
            switch (self) {
                .zoir => |note| return zoirErrorLocation(diag.ast, note.token, note.node_or_offset),
                .type_check => |note| return diag.ast.tokenLocation(note.offset, note.token),
            }
        }
    };

    pub const Iterator = struct {
        index: usize = 0,
        diag: *const Diagnostics,

        pub fn next(self: *@This()) ?Error {
            if (self.index < self.diag.zoir.compile_errors.len) {
                const result: Error = .{ .zoir = self.diag.zoir.compile_errors[self.index] };
                self.index += 1;
                return result;
            }

            if (self.diag.type_check) |err| {
                if (self.index == self.diag.zoir.compile_errors.len) {
                    const result: Error = .{ .type_check = err };
                    self.index += 1;
                    return result;
                }
            }

            return null;
        }
    };

    const TypeCheckFailure = struct {
        const Note = struct {
            token: Ast.TokenIndex,
            offset: u32,
            msg: []const u8,
            owned: bool,

            fn deinit(self: @This(), gpa: Allocator) void {
                if (self.owned) gpa.free(self.msg);
            }
        };

        message: []const u8,
        owned: bool,
        token: Ast.TokenIndex,
        offset: u32,
        note: ?@This().Note,

        fn deinit(self: @This(), gpa: Allocator) void {
            if (self.note) |note| note.deinit(gpa);
            if (self.owned) gpa.free(self.message);
        }

        fn getNoteCount(self: @This()) usize {
            return @intFromBool(self.note != null);
        }

        fn getNote(self: @This(), index: usize) @This().Note {
            assert(index == 0);
            return self.note.?;
        }
    };

    const FormatMessage = struct {
        err: Error,
        diag: *const Diagnostics,
    };

    fn formatMessage(self: FormatMessage, w: *std.Io.Writer) std.Io.Writer.Error!void {
        switch (self.err) {
            .zoir => |err| try w.writeAll(err.msg.get(self.diag.zoir)),
            .type_check => |tc| try w.writeAll(tc.message),
        }
    }

    pub fn fmtMessage(self: @This(), diag: *const Diagnostics) std.fmt.Alt(FormatMessage, formatMessage) {
        return .{ .data = .{
            .err = self,
            .diag = diag,
        } };
    }

    pub fn getLocation(self: @This(), diag: *const Diagnostics) Ast.Location {
        return switch (self) {
            .zoir => |err| return zoirErrorLocation(
                diag.ast,
                err.token,
                err.node_or_offset,
            ),
            .type_check => |err| return diag.ast.tokenLocation(err.offset, err.token),
        };
    }

    pub fn iterateNotes(self: @This(), diag: *const Diagnostics) Note.Iterator {
        return .{ .err = self, .diag = diag };
    }

    fn zoirErrorLocation(ast: Ast, maybe_token: Ast.OptionalTokenIndex, node_or_offset: u32) Ast.Location {
        if (maybe_token.unwrap()) |token| {
            var location = ast.tokenLocation(0, token);
            location.column += node_or_offset;
            return location;
        } else {
            const ast_node: Ast.Node.Index = @enumFromInt(node_or_offset);
            const token = ast.nodeMainToken(ast_node);
            return ast.tokenLocation(0, token);
        }
    }
};

pub const Diagnostics = struct {
    ast: Ast = .{
        .source = "",
        .tokens = .empty,
        .nodes = .empty,
        .extra_data = &.{},
        .mode = .zon,
        .errors = &.{},
    },
    zoir: Zoir = .{
        .nodes = .empty,
        .extra = &.{},
        .limbs = &.{},
        .string_bytes = &.{},
        .compile_errors = &.{},
        .error_notes = &.{},
    },
    type_check: ?Error.TypeCheckFailure = null,

    fn assertEmpty(self: Diagnostics) void {
        assert(self.ast.tokens.len == 0);
        assert(self.zoir.nodes.len == 0);
        assert(self.type_check == null);
    }

    pub fn deinit(self: *Diagnostics, gpa: Allocator) void {
        self.ast.deinit(gpa);
        self.zoir.deinit(gpa);
        if (self.type_check) |tc| tc.deinit(gpa);
        self.* = undefined;
    }

    pub fn iterateErrors(self: *const Diagnostics) Error.Iterator {
        return .{ .diag = self };
    }

    pub fn format(self: *const @This(), w: *std.Io.Writer) std.Io.Writer.Error!void {
        var errors = self.iterateErrors();
        while (errors.next()) |err| {
            const loc = err.getLocation(self);
            const msg = err.fmtMessage(self);
            try w.print("{d}:{d}: error: {f}\n", .{ loc.line + 1, loc.column + 1, msg });

            var notes = err.iterateNotes(self);
            while (notes.next()) |note| {
                const note_loc = note.getLocation(self);
                const note_msg = note.fmtMessage(self);
                try w.print("{d}:{d}: note: {f}\n", .{
                    note_loc.line + 1,
                    note_loc.column + 1,
                    note_msg,
                });
            }
        }
    }
};

pub fn fromSlice(
    T: type,
    gpa: Allocator,
    source: [:0]const u8,
    diag: ?*Diagnostics,
    options: Options,
) error{ OutOfMemory, ParseZon }!T {
    comptime assert(!requiresAllocator(T));
    return fromSliceAlloc(T, gpa, source, diag, options);
}

pub fn fromSliceAlloc(
    T: type,
    gpa: Allocator,
    source: [:0]const u8,
    diag: ?*Diagnostics,
    options: Options,
) error{ OutOfMemory, ParseZon }!T {
    if (diag) |s| s.assertEmpty();

    var ast = try std.zig.Ast.parse(gpa, source, .zon);
    defer if (diag == null) ast.deinit(gpa);
    if (diag) |s| s.ast = ast;

    var zoir = try ZonGen.generate(gpa, ast, .{ .parse_str_lits = false });
    defer if (diag == null) zoir.deinit(gpa);

    if (diag) |s| s.* = .{};
    return fromZoirAlloc(T, gpa, ast, zoir, diag, options);
}

pub fn fromZoir(
    T: type,
    ast: Ast,
    zoir: Zoir,
    diag: ?*Diagnostics,
    options: Options,
) error{ParseZon}!T {
    comptime assert(!requiresAllocator(T));
    var buf: [0]u8 = .{};
    var failing_allocator = std.heap.FixedBufferAllocator.init(&buf);
    return fromZoirAlloc(
        T,
        failing_allocator.allocator(),
        ast,
        zoir,
        diag,
        options,
    ) catch |err| switch (err) {
        error.OutOfMemory => unreachable,
        else => |e| return e,
    };
}

pub fn fromZoirAlloc(
    T: type,
    gpa: Allocator,
    ast: Ast,
    zoir: Zoir,
    diag: ?*Diagnostics,
    options: Options,
) error{ OutOfMemory, ParseZon }!T {
    return fromZoirNodeAlloc(T, gpa, ast, zoir, .root, diag, options);
}

pub fn fromZoirNode(
    T: type,
    ast: Ast,
    zoir: Zoir,
    node: Zoir.Node.Index,
    diag: ?*Diagnostics,
    options: Options,
) error{ParseZon}!T {
    comptime assert(!requiresAllocator(T));
    var buf: [0]u8 = .{};
    var failing_allocator = std.heap.FixedBufferAllocator.init(&buf);
    return fromZoirNodeAlloc(
        T,
        failing_allocator.allocator(),
        ast,
        zoir,
        node,
        diag,
        options,
    ) catch |err| switch (err) {
        error.OutOfMemory => unreachable,
        else => |e| return e,
    };
}

pub fn fromZoirNodeAlloc(
    T: type,
    gpa: Allocator,
    ast: Ast,
    zoir: Zoir,
    node: Zoir.Node.Index,
    diag: ?*Diagnostics,
    options: Options,
) error{ OutOfMemory, ParseZon }!T {
    comptime assert(canParseType(T));

    if (diag) |s| {
        s.assertEmpty();
        s.ast = ast;
        s.zoir = zoir;
    }

    if (zoir.hasCompileErrors()) {
        return error.ParseZon;
    }

    var parser: Parser = .{
        .gpa = gpa,
        .ast = ast,
        .zoir = zoir,
        .options = options,
        .diag = diag,
    };

    return parser.parseExpr(T, node);
}

pub fn free(gpa: Allocator, value: anytype) void {
    const Value = @TypeOf(value);

    _ = valid_types;
    switch (@typeInfo(Value)) {
        .bool, .int, .float, .@"enum" => {},
        .pointer => |pointer| {
            switch (pointer.size) {
                .one => {
                    free(gpa, value.*);
                    gpa.destroy(value);
                },
                .slice => {
                    for (value) |item| {
                        free(gpa, item);
                    }
                    gpa.free(value);
                },
                .many, .c => comptime unreachable,
            }
        },
        .array => {
            freeArray(gpa, @TypeOf(value), &value);
        },
        .vector => |vector| {
            const array: [vector.len]vector.child = value;
            freeArray(gpa, @TypeOf(array), &array);
        },
        .@"struct" => |@"struct"| inline for (@"struct".fields) |field| {
            free(gpa, @field(value, field.name));
        },
        .@"union" => |@"union"| if (@"union".tag_type == null) {
            if (comptime requiresAllocator(Value)) unreachable;
        } else switch (value) {
            inline else => |_, tag| {
                free(gpa, @field(value, @tagName(tag)));
            },
        },
        .optional => if (value) |some| {
            free(gpa, some);
        },
        .void => {},
        else => comptime unreachable,
    }
}

fn freeArray(gpa: Allocator, comptime A: type, array: *const A) void {
    for (array) |elem| free(gpa, elem);
}

fn requiresAllocator(T: type) bool {
    _ = valid_types;
    return switch (@typeInfo(T)) {
        .pointer => true,
        .array => |array| return array.len > 0 and requiresAllocator(array.child),
        .@"struct" => |@"struct"| inline for (@"struct".fields) |field| {
            if (requiresAllocator(field.type)) {
                break true;
            }
        } else false,
        .@"union" => |@"union"| inline for (@"union".fields) |field| {
            if (requiresAllocator(field.type)) {
                break true;
            }
        } else false,
        .optional => |optional| requiresAllocator(optional.child),
        .vector => |vector| return vector.len > 0 and requiresAllocator(vector.child),
        else => false,
    };
}

const Parser = struct {
    gpa: Allocator,
    ast: Ast,
    zoir: Zoir,
    diag: ?*Diagnostics,
    options: Options,

    const ParseExprError = error{ ParseZon, OutOfMemory };

    fn parseExpr(self: *@This(), T: type, node: Zoir.Node.Index) ParseExprError!T {
        return self.parseExprInner(T, node) catch |err| switch (err) {
            error.WrongType => return self.failExpectedType(T, node),
            else => |e| return e,
        };
    }

    const ParseExprInnerError = error{ ParseZon, OutOfMemory, WrongType };

    fn parseExprInner(
        self: *@This(),
        T: type,
        node: Zoir.Node.Index,
    ) ParseExprInnerError!T {
        if (T == Zoir.Node.Index) {
            return node;
        }

        switch (@typeInfo(T)) {
            .optional => |optional| if (node.get(self.zoir) == .null) {
                return null;
            } else {
                return try self.parseExprInner(optional.child, node);
            },
            .bool => return self.parseBool(node),
            .int => return self.parseInt(T, node),
            .float => return self.parseFloat(T, node),
            .@"enum" => return self.parseEnumLiteral(T, node),
            .pointer => |pointer| switch (pointer.size) {
                .one => {
                    const result = try self.gpa.create(pointer.child);
                    errdefer self.gpa.destroy(result);
                    result.* = try self.parseExprInner(pointer.child, node);
                    return result;
                },
                .slice => return self.parseSlicePointer(T, node),
                else => comptime unreachable,
            },
            .array => return self.parseArray(T, node),
            .vector => |vector| {
                const A = [vector.len]vector.child;
                return try self.parseArray(A, node);
            },
            .@"struct" => |@"struct"| if (@"struct".is_tuple)
                return self.parseTuple(T, node)
            else
                return self.parseStruct(T, node),
            .@"union" => return self.parseUnion(T, node),

            else => comptime unreachable,
        }
    }

    fn failExpectedType(
        self: @This(),
        T: type,
        node: Zoir.Node.Index,
    ) error{ ParseZon, OutOfMemory } {
        @branchHint(.cold);
        return self.failExpectedTypeInner(T, false, node);
    }

    fn failExpectedTypeInner(
        self: @This(),
        T: type,
        opt: bool,
        node: Zoir.Node.Index,
    ) error{ ParseZon, OutOfMemory } {
        _ = valid_types;
        switch (@typeInfo(T)) {
            .@"struct" => |@"struct"| if (@"struct".is_tuple) {
                if (opt) {
                    return self.failNode(node, "expected optional tuple");
                } else {
                    return self.failNode(node, "expected tuple");
                }
            } else {
                if (opt) {
                    return self.failNode(node, "expected optional struct");
                } else {
                    return self.failNode(node, "expected struct");
                }
            },
            .@"union" => if (opt) {
                return self.failNode(node, "expected optional union");
            } else {
                return self.failNode(node, "expected union");
            },
            .array => if (opt) {
                return self.failNode(node, "expected optional array");
            } else {
                return self.failNode(node, "expected array");
            },
            .pointer => |pointer| switch (pointer.size) {
                .one => return self.failExpectedTypeInner(pointer.child, opt, node),
                .slice => {
                    if (pointer.child == u8 and
                        pointer.is_const and
                        (pointer.sentinel() == null or pointer.sentinel() == 0) and
                        pointer.alignment == 1)
                    {
                        if (opt) {
                            return self.failNode(node, "expected optional string");
                        } else {
                            return self.failNode(node, "expected string");
                        }
                    } else {
                        if (opt) {
                            return self.failNode(node, "expected optional array");
                        } else {
                            return self.failNode(node, "expected array");
                        }
                    }
                },
                else => comptime unreachable,
            },
            .vector, .bool, .int, .float => if (opt) {
                return self.failNodeFmt(node, "expected type '{s}'", .{@typeName(?T)});
            } else {
                return self.failNodeFmt(node, "expected type '{s}'", .{@typeName(T)});
            },
            .@"enum" => if (opt) {
                return self.failNode(node, "expected optional enum literal");
            } else {
                return self.failNode(node, "expected enum literal");
            },
            .optional => |optional| {
                return self.failExpectedTypeInner(optional.child, true, node);
            },
            else => comptime unreachable,
        }
    }

    fn parseBool(self: @This(), node: Zoir.Node.Index) !bool {
        switch (node.get(self.zoir)) {
            .true => return true,
            .false => return false,
            else => return error.WrongType,
        }
    }

    fn parseInt(self: @This(), T: type, node: Zoir.Node.Index) !T {
        switch (node.get(self.zoir)) {
            .int_literal => |int| switch (int) {
                .small => |val| return std.math.cast(T, val) orelse
                    self.failCannotRepresent(T, node),
                .big => |val| return val.toInt(T) catch
                    self.failCannotRepresent(T, node),
            },
            .float_literal => |val| return intFromFloatExact(T, val) orelse
                self.failCannotRepresent(T, node),

            .char_literal => |val| return std.math.cast(T, val) orelse
                self.failCannotRepresent(T, node),
            else => return error.WrongType,
        }
    }

    fn parseFloat(self: @This(), T: type, node: Zoir.Node.Index) !T {
        switch (node.get(self.zoir)) {
            .int_literal => |int| switch (int) {
                .small => |val| return @floatFromInt(val),
                .big => |val| return val.toFloat(T, .nearest_even)[0],
            },
            .float_literal => |val| return @floatCast(val),
            .pos_inf => return std.math.inf(T),
            .neg_inf => return -std.math.inf(T),
            .nan => return std.math.nan(T),
            .char_literal => |val| return @floatFromInt(val),
            else => return error.WrongType,
        }
    }

    fn parseEnumLiteral(self: @This(), T: type, node: Zoir.Node.Index) !T {
        switch (node.get(self.zoir)) {
            .enum_literal => |field_name| {
                const enum_fields = @typeInfo(T).@"enum".fields;
                comptime var kvs_list: [enum_fields.len]struct { []const u8, T } = undefined;
                inline for (enum_fields, 0..) |field, i| {
                    kvs_list[i] = .{ field.name, @enumFromInt(field.value) };
                }
                const enum_tags = std.StaticStringMap(T).initComptime(kvs_list);

                const field_name_str = field_name.get(self.zoir);
                return enum_tags.get(field_name_str) orelse
                    self.failUnexpected(T, "enum literal", node, null, field_name_str);
            },
            else => return error.WrongType,
        }
    }

    fn parseSlicePointer(self: *@This(), T: type, node: Zoir.Node.Index) ParseExprInnerError!T {
        switch (node.get(self.zoir)) {
            .string_literal => return self.parseString(T, node),
            .array_literal => |nodes| return self.parseSlice(T, nodes),
            .empty_literal => return self.parseSlice(T, .{ .start = node, .len = 0 }),
            else => return error.WrongType,
        }
    }

    fn parseString(self: *@This(), T: type, node: Zoir.Node.Index) ParseExprInnerError!T {
        const ast_node = node.getAstNode(self.zoir);
        const pointer = @typeInfo(T).pointer;
        var size_hint = ZonGen.strLitSizeHint(self.ast, ast_node);
        if (pointer.sentinel() != null) size_hint += 1;

        var aw: std.Io.Writer.Allocating = .init(self.gpa);
        try aw.ensureUnusedCapacity(size_hint);
        defer aw.deinit();
        const result = ZonGen.parseStrLit(self.ast, ast_node, &aw.writer) catch return error.OutOfMemory;
        switch (result) {
            .success => {},
            .failure => |err| {
                const token = self.ast.nodeMainToken(ast_node);
                const raw_string = self.ast.tokenSlice(token);
                return self.failTokenFmt(token, @intCast(err.offset()), "{f}", .{err.fmt(raw_string)});
            },
        }

        if (pointer.child != u8 or
            pointer.size != .slice or
            !pointer.is_const or
            (pointer.sentinel() != null and pointer.sentinel() != 0) or
            pointer.alignment != 1)
        {
            return error.WrongType;
        }

        if (pointer.sentinel() != null) {
            return aw.toOwnedSliceSentinel(0);
        } else {
            return aw.toOwnedSlice();
        }
    }

    fn parseSlice(self: *@This(), T: type, nodes: Zoir.Node.Index.Range) !T {
        const pointer = @typeInfo(T).pointer;

        switch (pointer.size) {
            .slice => {},
            .one, .many, .c => comptime unreachable,
        }

        const slice = try self.gpa.allocWithOptions(
            pointer.child,
            nodes.len,
            .fromByteUnits(pointer.alignment),
            pointer.sentinel(),
        );
        errdefer self.gpa.free(slice);

        for (slice, 0..) |*elem, i| {
            errdefer if (self.options.free_on_error) {
                for (slice[0..i]) |item| {
                    free(self.gpa, item);
                }
            };
            elem.* = try self.parseExpr(pointer.child, nodes.at(@intCast(i)));
        }

        return slice;
    }

    fn parseArray(self: *@This(), T: type, node: Zoir.Node.Index) !T {
        const nodes: Zoir.Node.Index.Range = switch (node.get(self.zoir)) {
            .array_literal => |nodes| nodes,
            .empty_literal => .{ .start = node, .len = 0 },
            else => return error.WrongType,
        };

        const array_info = @typeInfo(T).array;

        if (nodes.len < array_info.len) {
            return self.failNodeFmt(
                node,
                "expected {} array elements; found {}",
                .{ array_info.len, nodes.len },
            );
        } else if (nodes.len > array_info.len) {
            return self.failNodeFmt(
                nodes.at(array_info.len),
                "index {} outside of array of length {}",
                .{ array_info.len, array_info.len },
            );
        }

        var result: T = undefined;
        for (&result, 0..) |*elem, i| {
            errdefer if (self.options.free_on_error) {
                for (result[0..i]) |item| {
                    free(self.gpa, item);
                }
            };

            elem.* = try self.parseExpr(array_info.child, nodes.at(@intCast(i)));
        }
        if (array_info.sentinel()) |s| result[result.len] = s;
        return result;
    }

    fn parseStruct(self: *@This(), T: type, node: Zoir.Node.Index) !T {
        const repr = node.get(self.zoir);
        const fields: @FieldType(Zoir.Node, "struct_literal") = switch (repr) {
            .struct_literal => |nodes| nodes,
            .empty_literal => .{ .names = &.{}, .vals = .{ .start = node, .len = 0 } },
            else => return error.WrongType,
        };

        const field_infos = @typeInfo(T).@"struct".fields;

        const comptime_field = std.math.maxInt(usize);
        const field_indices: std.StaticStringMap(usize) = comptime b: {
            var kvs_list: [field_infos.len]struct { []const u8, usize } = undefined;
            for (&kvs_list, field_infos, 0..) |*kv, field, i| {
                kv.* = .{ field.name, if (field.is_comptime) comptime_field else i };
            }
            break :b .initComptime(kvs_list);
        };

        var result: T = undefined;
        var field_found: [field_infos.len]bool = @splat(false);

        var initialized: usize = 0;
        errdefer if (self.options.free_on_error and field_infos.len > 0) {
            for (fields.names[0..initialized]) |name_runtime| {
                switch (field_indices.get(name_runtime.get(self.zoir)) orelse continue) {
                    inline 0...(field_infos.len - 1) => |name_index| {
                        const name = field_infos[name_index].name;
                        free(self.gpa, @field(result, name));
                    },
                    else => unreachable,
                }
            }
        };

        for (0..fields.names.len) |i| {
            const name = fields.names[i].get(self.zoir);
            const field_index = field_indices.get(name) orelse {
                if (self.options.ignore_unknown_fields) continue;
                return self.failUnexpected(T, "field", node, i, name);
            };
            if (field_index == comptime_field) {
                return self.failComptimeField(node, i);
            }

            if (field_found.len == 0) unreachable;
            field_found[field_index] = true;

            switch (field_index) {
                inline 0...(field_infos.len - 1) => |j| {
                    if (field_infos[j].is_comptime) unreachable;

                    @field(result, field_infos[j].name) = try self.parseExpr(
                        field_infos[j].type,
                        fields.vals.at(@intCast(i)),
                    );
                },
                else => unreachable,
            }

            initialized += 1;
        }

        inline for (field_found, 0..) |found, i| {
            if (!found) {
                const field_info = field_infos[i];
                if (field_info.default_value_ptr) |default| {
                    const typed: *const field_info.type = @ptrCast(@alignCast(default));
                    @field(result, field_info.name) = typed.*;
                } else {
                    return self.failNodeFmt(
                        node,
                        "missing required field {s}",
                        .{field_infos[i].name},
                    );
                }
            }
        }

        return result;
    }

    fn parseTuple(self: *@This(), T: type, node: Zoir.Node.Index) !T {
        const nodes: Zoir.Node.Index.Range = switch (node.get(self.zoir)) {
            .array_literal => |nodes| nodes,
            .empty_literal => .{ .start = node, .len = 0 },
            else => return error.WrongType,
        };

        var result: T = undefined;
        const field_infos = @typeInfo(T).@"struct".fields;

        if (nodes.len > field_infos.len) {
            return self.failNodeFmt(
                nodes.at(field_infos.len),
                "index {} outside of tuple length {}",
                .{ field_infos.len, field_infos.len },
            );
        }

        inline for (0..field_infos.len) |i| {
            if (i >= nodes.len) {
                if (field_infos[i].default_value_ptr) |default| {
                    const typed: *const field_infos[i].type = @ptrCast(@alignCast(default));
                    @field(result, field_infos[i].name) = typed.*;
                } else {
                    return self.failNodeFmt(node, "missing tuple field with index {}", .{i});
                }
            } else {
                errdefer if (self.options.free_on_error) {
                    inline for (0..i) |j| {
                        if (j >= i) break;
                        free(self.gpa, result[j]);
                    }
                };

                if (field_infos[i].is_comptime) {
                    return self.failComptimeField(node, i);
                } else {
                    result[i] = try self.parseExpr(field_infos[i].type, nodes.at(i));
                }
            }
        }

        return result;
    }

    fn parseUnion(self: *@This(), T: type, node: Zoir.Node.Index) !T {
        const @"union" = @typeInfo(T).@"union";
        const field_infos = @"union".fields;

        if (field_infos.len == 0) comptime unreachable;

        const field_indices = b: {
            comptime var kvs_list: [field_infos.len]struct { []const u8, usize } = undefined;
            inline for (field_infos, 0..) |field, i| {
                kvs_list[i] = .{ field.name, i };
            }
            break :b std.StaticStringMap(usize).initComptime(kvs_list);
        };

        switch (node.get(self.zoir)) {
            .enum_literal => |field_name| {
                if (@"union".tag_type == null) {
                    return error.WrongType;
                }

                const field_index = b: {
                    const field_name_str = field_name.get(self.zoir);
                    break :b field_indices.get(field_name_str) orelse
                        return self.failUnexpected(T, "field", node, null, field_name_str);
                };

                switch (field_index) {
                    inline 0...field_infos.len - 1 => |i| {
                        if (field_infos[i].type != void)
                            return self.failNode(node, "expected union");

                        return @unionInit(T, field_infos[i].name, {});
                    },
                    else => unreachable,
                }
            },
            .struct_literal => |struct_fields| {
                if (struct_fields.names.len != 1) {
                    return error.WrongType;
                }

                const field_name = struct_fields.names[0];
                const field_name_str = field_name.get(self.zoir);
                const field_val = struct_fields.vals.at(0);
                const field_index = field_indices.get(field_name_str) orelse
                    return self.failUnexpected(T, "field", node, 0, field_name_str);

                switch (field_index) {
                    inline 0...field_infos.len - 1 => |i| {
                        if (field_infos[i].type == void) {
                            return self.failNode(field_val, "expected type 'void'");
                        } else {
                            const value = try self.parseExpr(field_infos[i].type, field_val);
                            return @unionInit(T, field_infos[i].name, value);
                        }
                    },
                    else => unreachable,
                }
            },
            else => return error.WrongType,
        }
    }

    fn failTokenFmt(
        self: @This(),
        token: Ast.TokenIndex,
        offset: u32,
        comptime fmt: []const u8,
        args: anytype,
    ) error{ OutOfMemory, ParseZon } {
        @branchHint(.cold);
        return self.failTokenFmtNote(token, offset, fmt, args, null);
    }

    fn failTokenFmtNote(
        self: @This(),
        token: Ast.TokenIndex,
        offset: u32,
        comptime fmt: []const u8,
        args: anytype,
        note: ?Error.TypeCheckFailure.Note,
    ) error{ OutOfMemory, ParseZon } {
        @branchHint(.cold);
        comptime assert(args.len > 0);
        if (self.diag) |s| s.type_check = .{
            .token = token,
            .offset = offset,
            .message = std.fmt.allocPrint(self.gpa, fmt, args) catch |err| {
                if (note) |n| n.deinit(self.gpa);
                return err;
            },
            .owned = true,
            .note = note,
        };
        return error.ParseZon;
    }

    fn failNodeFmt(
        self: @This(),
        node: Zoir.Node.Index,
        comptime fmt: []const u8,
        args: anytype,
    ) error{ OutOfMemory, ParseZon } {
        @branchHint(.cold);
        const token = self.ast.nodeMainToken(node.getAstNode(self.zoir));
        return self.failTokenFmt(token, 0, fmt, args);
    }

    fn failToken(
        self: @This(),
        failure: Error.TypeCheckFailure,
    ) error{ParseZon} {
        @branchHint(.cold);
        if (self.diag) |s| s.type_check = failure;
        return error.ParseZon;
    }

    fn failNode(
        self: @This(),
        node: Zoir.Node.Index,
        message: []const u8,
    ) error{ParseZon} {
        @branchHint(.cold);
        const token = self.ast.nodeMainToken(node.getAstNode(self.zoir));
        return self.failToken(.{
            .token = token,
            .offset = 0,
            .message = message,
            .owned = false,
            .note = null,
        });
    }

    fn failCannotRepresent(
        self: @This(),
        T: type,
        node: Zoir.Node.Index,
    ) error{ OutOfMemory, ParseZon } {
        @branchHint(.cold);
        return self.failNodeFmt(node, "type '{s}' cannot represent value", .{@typeName(T)});
    }

    fn failUnexpected(
        self: @This(),
        T: type,
        item_kind: []const u8,
        node: Zoir.Node.Index,
        field: ?usize,
        name: []const u8,
    ) error{ OutOfMemory, ParseZon } {
        @branchHint(.cold);
        const gpa = self.gpa;
        const token = if (field) |f| b: {
            var buf: [2]Ast.Node.Index = undefined;
            const struct_init = self.ast.fullStructInit(&buf, node.getAstNode(self.zoir)).?;
            const field_node = struct_init.ast.fields[f];
            break :b self.ast.firstToken(field_node) - 2;
        } else self.ast.nodeMainToken(node.getAstNode(self.zoir));
        switch (@typeInfo(T)) {
            inline .@"struct", .@"union", .@"enum" => |info| {
                const note: Error.TypeCheckFailure.Note = if (info.fields.len == 0) b: {
                    break :b .{
                        .token = token,
                        .offset = 0,
                        .msg = "none expected",
                        .owned = false,
                    };
                } else b: {
                    const msg = "supported: ";
                    var buf: std.ArrayListUnmanaged(u8) = try .initCapacity(gpa, 64);
                    defer buf.deinit(gpa);
                    try buf.appendSlice(gpa, msg);
                    inline for (info.fields, 0..) |field_info, i| {
                        if (i != 0) try buf.appendSlice(gpa, ", ");
                        try buf.print(gpa, "'{f}'", .{std.zig.fmtIdFlags(field_info.name, .{
                            .allow_primitive = true,
                            .allow_underscore = true,
                        })});
                    }
                    break :b .{
                        .token = token,
                        .offset = 0,
                        .msg = try buf.toOwnedSlice(gpa),
                        .owned = true,
                    };
                };
                return self.failTokenFmtNote(
                    token,
                    0,
                    "unexpected {s} '{s}'",
                    .{ item_kind, name },
                    note,
                );
            },
            else => comptime unreachable,
        }
    }

    fn failComptimeField(
        self: @This(),
        node: Zoir.Node.Index,
        field: usize,
    ) error{ OutOfMemory, ParseZon } {
        @branchHint(.cold);
        const ast_node = node.getAstNode(self.zoir);
        var buf: [2]Ast.Node.Index = undefined;
        const token = if (self.ast.fullStructInit(&buf, ast_node)) |struct_init| b: {
            const field_node = struct_init.ast.fields[field];
            break :b self.ast.firstToken(field_node);
        } else b: {
            const array_init = self.ast.fullArrayInit(&buf, ast_node).?;
            const value_node = array_init.ast.elements[field];
            break :b self.ast.firstToken(value_node);
        };
        return self.failToken(.{
            .token = token,
            .offset = 0,
            .message = "cannot initialize comptime field",
            .owned = false,
            .note = null,
        });
    }
};

fn intFromFloatExact(T: type, value: anytype) ?T {
    if (value > std.math.maxInt(T) or value < std.math.minInt(T)) {
        return null;
    }

    if (std.math.isNan(value) or std.math.trunc(value) != value) {
        return null;
    }

    return @intFromFloat(value);
}

fn canParseType(T: type) bool {
    comptime return canParseTypeInner(T, &.{}, false);
}

fn canParseTypeInner(
    T: type,
    visited: []const type,
    parent_is_optional: bool,
) bool {
    return switch (@typeInfo(T)) {
        .bool,
        .int,
        .float,
        .null,
        .@"enum",
        => true,

        .noreturn,
        .void,
        .type,
        .undefined,
        .error_union,
        .error_set,
        .@"fn",
        .frame,
        .@"anyframe",
        .@"opaque",
        .comptime_int,
        .comptime_float,
        .enum_literal,
        => false,

        .pointer => |pointer| switch (pointer.size) {
            .one => canParseTypeInner(pointer.child, visited, parent_is_optional),
            .slice => canParseTypeInner(pointer.child, visited, false),
            .many, .c => false,
        },

        .optional => |optional| if (parent_is_optional)
            false
        else
            canParseTypeInner(optional.child, visited, true),

        .array => |array| canParseTypeInner(array.child, visited, false),
        .vector => |vector| canParseTypeInner(vector.child, visited, false),

        .@"struct" => |@"struct"| {
            for (visited) |V| if (T == V) return true;
            const new_visited = visited ++ .{T};
            for (@"struct".fields) |field| {
                if (!field.is_comptime and !canParseTypeInner(field.type, new_visited, false)) {
                    return false;
                }
            }
            return true;
        },
        .@"union" => |@"union"| {
            for (visited) |V| if (T == V) return true;
            const new_visited = visited ++ .{T};
            for (@"union".fields) |field| {
                if (field.type != void and !canParseTypeInner(field.type, new_visited, false)) {
                    return false;
                }
            }
            return true;
        },
    };
}

test "std.zon parse canParseType" {
    try std.testing.expect(!comptime canParseType(void));
    try std.testing.expect(!comptime canParseType(struct { f: [*]u8 }));
    try std.testing.expect(!comptime canParseType(struct { error{foo} }));
    try std.testing.expect(!comptime canParseType(union(enum) { a: void, b: [*c]u8 }));
    try std.testing.expect(!comptime canParseType(@Vector(0, [*c]u8)));
    try std.testing.expect(!comptime canParseType(*?[*c]u8));
    try std.testing.expect(comptime canParseType(enum(u8) { _ }));
    try std.testing.expect(comptime canParseType(union { foo: void }));
    try std.testing.expect(comptime canParseType(union(enum) { foo: void }));
    try std.testing.expect(!comptime canParseType(comptime_float));
    try std.testing.expect(!comptime canParseType(comptime_int));
    try std.testing.expect(comptime canParseType(struct { comptime foo: ??u8 = null }));
    try std.testing.expect(!comptime canParseType(@TypeOf(.foo)));
    try std.testing.expect(comptime canParseType(?u8));
    try std.testing.expect(comptime canParseType(*?*u8));
    try std.testing.expect(comptime canParseType(?struct {
        foo: ?struct {
            ?union(enum) {
                a: ?@Vector(0, ?*u8),
            },
            ?struct {
                f: ?[]?u8,
            },
        },
    }));
    try std.testing.expect(!comptime canParseType(??u8));
    try std.testing.expect(!comptime canParseType(?*?u8));
    try std.testing.expect(!comptime canParseType(*?*?*u8));
    try std.testing.expect(!comptime canParseType(struct { x: comptime_int = 2 }));
    try std.testing.expect(!comptime canParseType(struct { x: comptime_float = 2 }));
    try std.testing.expect(comptime canParseType(struct { comptime x: @TypeOf(.foo) = .foo }));
    try std.testing.expect(!comptime canParseType(struct { comptime_int }));
    const Recursive = struct { foo: ?*@This() };
    try std.testing.expect(comptime canParseType(Recursive));

    try std.testing.expect(!comptime canParseType(struct {
        add_to_visited: ?u8,
        retrieve_from_visited: ??u8,
    }));
}

test "std.zon requiresAllocator" {
    try std.testing.expect(!requiresAllocator(u8));
    try std.testing.expect(!requiresAllocator(f32));
    try std.testing.expect(!requiresAllocator(enum { foo }));
    try std.testing.expect(!requiresAllocator(struct { f32 }));
    try std.testing.expect(!requiresAllocator(struct { x: f32 }));
    try std.testing.expect(!requiresAllocator([0][]const u8));
    try std.testing.expect(!requiresAllocator([2]u8));
    try std.testing.expect(!requiresAllocator(union { x: f32, y: f32 }));
    try std.testing.expect(!requiresAllocator(union(enum) { x: f32, y: f32 }));
    try std.testing.expect(!requiresAllocator(?f32));
    try std.testing.expect(!requiresAllocator(void));
    try std.testing.expect(!requiresAllocator(@TypeOf(null)));
    try std.testing.expect(!requiresAllocator(@Vector(3, u8)));
    try std.testing.expect(!requiresAllocator(@Vector(0, *const u8)));

    try std.testing.expect(requiresAllocator([]u8));
    try std.testing.expect(requiresAllocator(*struct { u8, u8 }));
    try std.testing.expect(requiresAllocator([1][]const u8));
    try std.testing.expect(requiresAllocator(struct { x: i32, y: []u8 }));
    try std.testing.expect(requiresAllocator(union { x: i32, y: []u8 }));
    try std.testing.expect(requiresAllocator(union(enum) { x: i32, y: []u8 }));
    try std.testing.expect(requiresAllocator(?[]u8));
    try std.testing.expect(requiresAllocator(@Vector(3, *const u8)));
}

test "std.zon ast errors" {
    const gpa = std.testing.allocator;
    var diag: Diagnostics = .{};
    defer diag.deinit(gpa);
    try std.testing.expectError(
        error.ParseZon,
        fromSlice(struct {}, gpa, ".{.x = 1 .y = 2}", &diag, .{}),
    );
    try std.testing.expectFmt("1:13: error: expected ',' after initializer\n", "{f}", .{diag});
}

test "std.zon comments" {
    const gpa = std.testing.allocator;

    try std.testing.expectEqual(@as(u8, 10), fromSlice(u8, gpa,
        \\// comment
        \\10 // comment
        \\// comment
    , null, .{}));

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(error.ParseZon, fromSlice(u8, gpa,
            \\//! comment
            \\10 // comment
            \\// comment
        , &diag, .{}));
        try std.testing.expectFmt(
            "1:1: error: expected expression, found 'a document comment'\n",
            "{f}",
            .{diag},
        );
    }
}

test "std.zon failure/oom formatting" {
    const gpa = std.testing.allocator;
    var failing_allocator = std.testing.FailingAllocator.init(gpa, .{
        .fail_index = 0,
        .resize_fail_index = 0,
    });
    var diag: Diagnostics = .{};
    defer diag.deinit(gpa);
    try std.testing.expectError(error.OutOfMemory, fromSliceAlloc(
        []const u8,
        failing_allocator.allocator(),
        "\"foo\"",
        &diag,
        .{},
    ));
    try std.testing.expectFmt("", "{f}", .{diag});
}

test "std.zon fromSliceAlloc syntax error" {
    try std.testing.expectError(
        error.ParseZon,
        fromSlice(u8, std.testing.allocator, ".{", null, .{}),
    );
}

test "std.zon optional" {
    const gpa = std.testing.allocator;

    {
        const none = try fromSlice(?u32, gpa, "null", null, .{});
        try std.testing.expect(none == null);
        const some = try fromSlice(?u32, gpa, "1", null, .{});
        try std.testing.expect(some.? == 1);
    }

    {
        const none = try fromSliceAlloc(?[]const u8, gpa, "null", null, .{});
        try std.testing.expect(none == null);
        const some = try fromSliceAlloc(?[]const u8, gpa, "\"foo\"", null, .{});
        defer free(gpa, some);
        try std.testing.expectEqualStrings("foo", some.?);
    }
}

test "std.zon unions" {
    const gpa = std.testing.allocator;

    {
        const Tagged = union(enum) { x: f32, @"y y": bool, z, @"z z" };
        const Untagged = union { x: f32, @"y y": bool, z: void, @"z z": void };

        const tagged_x = try fromSlice(Tagged, gpa, ".{.x = 1.5}", null, .{});
        try std.testing.expectEqual(Tagged{ .x = 1.5 }, tagged_x);
        const tagged_y = try fromSlice(Tagged, gpa, ".{.@\"y y\" = true}", null, .{});
        try std.testing.expectEqual(Tagged{ .@"y y" = true }, tagged_y);
        const tagged_z_shorthand = try fromSlice(Tagged, gpa, ".z", null, .{});
        try std.testing.expectEqual(@as(Tagged, .z), tagged_z_shorthand);
        const tagged_zz_shorthand = try fromSlice(Tagged, gpa, ".@\"z z\"", null, .{});
        try std.testing.expectEqual(@as(Tagged, .@"z z"), tagged_zz_shorthand);

        const untagged_x = try fromSlice(Untagged, gpa, ".{.x = 1.5}", null, .{});
        try std.testing.expect(untagged_x.x == 1.5);
        const untagged_y = try fromSlice(Untagged, gpa, ".{.@\"y y\" = true}", null, .{});
        try std.testing.expect(untagged_y.@"y y");
    }

    {
        const Union = union(enum) { bar: []const u8, baz: bool };

        const noalloc = try fromSliceAlloc(Union, gpa, ".{.baz = false}", null, .{});
        try std.testing.expectEqual(Union{ .baz = false }, noalloc);

        const alloc = try fromSliceAlloc(Union, gpa, ".{.bar = \"qux\"}", null, .{});
        defer free(gpa, alloc);
        try std.testing.expectEqualDeep(Union{ .bar = "qux" }, alloc);
    }

    {
        const Union = union { x: f32, y: f32 };
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(
            error.ParseZon,
            fromSliceAlloc(Union, gpa, ".{.z=2.5}", &diag, .{}),
        );
        try std.testing.expectFmt(
            \\1:4: error: unexpected field 'z'
            \\1:4: note: supported: 'x', 'y'
            \\
        ,
            "{f}",
            .{diag},
        );
    }

    {
        const Union = union(enum) { x: void };
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(
            error.ParseZon,
            fromSliceAlloc(Union, gpa, ".{.x=1}", &diag, .{}),
        );
        try std.testing.expectFmt("1:6: error: expected type 'void'\n", "{f}", .{diag});
    }

    {
        const Union = union { x: f32, y: bool };
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(
            error.ParseZon,
            fromSliceAlloc(Union, gpa, ".{.x = 1.5, .y = true}", &diag, .{}),
        );
        try std.testing.expectFmt("1:2: error: expected union\n", "{f}", .{diag});
    }

    {
        const Union = union { x: f32, y: bool };
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(
            error.ParseZon,
            fromSliceAlloc(Union, gpa, ".{}", &diag, .{}),
        );
        try std.testing.expectFmt("1:2: error: expected union\n", "{f}", .{diag});
    }

    {
        const Union = union { x: void };
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(error.ParseZon, fromSliceAlloc(Union, gpa, ".x", &diag, .{}));
        try std.testing.expectFmt("1:2: error: expected union\n", "{f}", .{diag});
    }

    {
        const Union = union(enum) { x: void };
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(error.ParseZon, fromSliceAlloc(Union, gpa, ".y", &diag, .{}));
        try std.testing.expectFmt(
            \\1:2: error: unexpected field 'y'
            \\1:2: note: supported: 'x'
            \\
        ,
            "{f}",
            .{diag},
        );
    }

    {
        const Union = union(enum) { x: f32 };
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(error.ParseZon, fromSliceAlloc(Union, gpa, ".x", &diag, .{}));
        try std.testing.expectFmt("1:2: error: expected union\n", "{f}", .{diag});
    }
}

test "std.zon structs" {
    const gpa = std.testing.allocator;

    {
        const Vec0 = struct {};
        const Vec1 = struct { x: f32 };
        const Vec2 = struct { x: f32, y: f32 };
        const Vec3 = struct { x: f32, y: f32, z: f32 };

        const zero = try fromSlice(Vec0, gpa, ".{}", null, .{});
        try std.testing.expectEqual(Vec0{}, zero);

        const one = try fromSlice(Vec1, gpa, ".{.x = 1.2}", null, .{});
        try std.testing.expectEqual(Vec1{ .x = 1.2 }, one);

        const two = try fromSlice(Vec2, gpa, ".{.x = 1.2, .y = 3.4}", null, .{});
        try std.testing.expectEqual(Vec2{ .x = 1.2, .y = 3.4 }, two);

        const three = try fromSlice(Vec3, gpa, ".{.x = 1.2, .y = 3.4, .z = 5.6}", null, .{});
        try std.testing.expectEqual(Vec3{ .x = 1.2, .y = 3.4, .z = 5.6 }, three);
    }

    {
        const Foo = struct { bar: []const u8, baz: []const []const u8 };

        const parsed = try fromSliceAlloc(
            Foo,
            gpa,
            ".{.bar = \"qux\", .baz = .{\"a\", \"b\"}}",
            null,
            .{},
        );
        defer free(gpa, parsed);
        try std.testing.expectEqualDeep(Foo{ .bar = "qux", .baz = &.{ "a", "b" } }, parsed);
    }

    {
        const Vec2 = struct { x: f32, y: f32 };
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(
            error.ParseZon,
            fromSlice(Vec2, gpa, ".{.x=1.5, .z=2.5}", &diag, .{}),
        );
        try std.testing.expectFmt(
            \\1:12: error: unexpected field 'z'
            \\1:12: note: supported: 'x', 'y'
            \\
        ,
            "{f}",
            .{diag},
        );
    }

    {
        const Vec2 = struct { x: f32, y: f32 };
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(
            error.ParseZon,
            fromSlice(Vec2, gpa, ".{.x=1.5, .x=2.5, .x=3.5}", &diag, .{}),
        );
        try std.testing.expectFmt(
            \\1:4: error: duplicate struct field name
            \\1:12: note: duplicate name here
            \\
        , "{f}", .{diag});
    }

    {
        const Vec2 = struct { x: f32, y: f32 = 2.0 };
        const parsed = try fromSlice(Vec2, gpa, ".{ .x = 1.0, .z = 3.0 }", null, .{
            .ignore_unknown_fields = true,
        });
        try std.testing.expectEqual(Vec2{ .x = 1.0, .y = 2.0 }, parsed);
    }

    {
        const Vec2 = struct {};
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(
            error.ParseZon,
            fromSlice(Vec2, gpa, ".{.x=1.5, .z=2.5}", &diag, .{}),
        );
        try std.testing.expectFmt(
            \\1:4: error: unexpected field 'x'
            \\1:4: note: none expected
            \\
        , "{f}", .{diag});
    }

    {
        const Vec2 = struct { x: f32, y: f32 };
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(
            error.ParseZon,
            fromSlice(Vec2, gpa, ".{.x=1.5}", &diag, .{}),
        );
        try std.testing.expectFmt("1:2: error: missing required field y\n", "{f}", .{diag});
    }

    {
        const Vec2 = struct { x: f32, y: f32 = 1.5 };
        const parsed = try fromSlice(Vec2, gpa, ".{.x = 1.2}", null, .{});
        try std.testing.expectEqual(Vec2{ .x = 1.2, .y = 1.5 }, parsed);
    }

    {
        const Vec2 = struct { x: f32, comptime y: f32 = 1.5 };
        const parsed = try fromSlice(Vec2, gpa, ".{.x = 1.2}", null, .{});
        try std.testing.expectEqual(Vec2{ .x = 1.2, .y = 1.5 }, parsed);
    }

    {
        const Vec2 = struct { x: f32, comptime y: f32 = 1.5 };
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        const parsed = fromSlice(Vec2, gpa, ".{.x = 1.2, .y = 1.5}", &diag, .{});
        try std.testing.expectError(error.ParseZon, parsed);
        try std.testing.expectFmt(
            \\1:18: error: cannot initialize comptime field
            \\
        , "{f}", .{diag});
    }

    {
        const Vec0 = struct { x: enum { x } };
        const parsed = try fromSlice(Vec0, gpa, ".{ .x = .x }", null, .{});
        try std.testing.expectEqual(Vec0{ .x = .x }, parsed);
    }

    {
        const Vec0 = struct { @"x x": enum { @"x x" } };
        const parsed = try fromSlice(Vec0, gpa, ".{ .@\"x x\" = .@\"x x\" }", null, .{});
        try std.testing.expectEqual(Vec0{ .@"x x" = .@"x x" }, parsed);
    }

    {
        {
            var diag: Diagnostics = .{};
            defer diag.deinit(gpa);
            const parsed = fromSlice(struct {}, gpa, "Empty{}", &diag, .{});
            try std.testing.expectError(error.ParseZon, parsed);
            try std.testing.expectFmt(
                \\1:1: error: types are not available in ZON
                \\1:1: note: replace the type with '.'
                \\
            , "{f}", .{diag});
        }

        {
            var diag: Diagnostics = .{};
            defer diag.deinit(gpa);
            const parsed = fromSlice([3]u8, gpa, "[3]u8{1, 2, 3}", &diag, .{});
            try std.testing.expectError(error.ParseZon, parsed);
            try std.testing.expectFmt(
                \\1:1: error: types are not available in ZON
                \\1:1: note: replace the type with '.'
                \\
            , "{f}", .{diag});
        }

        {
            var diag: Diagnostics = .{};
            defer diag.deinit(gpa);
            const parsed = fromSliceAlloc([]u8, gpa, "[]u8{1, 2, 3}", &diag, .{});
            try std.testing.expectError(error.ParseZon, parsed);
            try std.testing.expectFmt(
                \\1:1: error: types are not available in ZON
                \\1:1: note: replace the type with '.'
                \\
            , "{f}", .{diag});
        }

        {
            var diag: Diagnostics = .{};
            defer diag.deinit(gpa);
            const parsed = fromSlice(
                struct { u8, u8, u8 },
                gpa,
                "Tuple{1, 2, 3}",
                &diag,
                .{},
            );
            try std.testing.expectError(error.ParseZon, parsed);
            try std.testing.expectFmt(
                \\1:1: error: types are not available in ZON
                \\1:1: note: replace the type with '.'
                \\
            , "{f}", .{diag});
        }

        {
            var diag: Diagnostics = .{};
            defer diag.deinit(gpa);
            const parsed = fromSlice(struct {}, gpa, ".{ .x = Tuple{1, 2, 3} }", &diag, .{});
            try std.testing.expectError(error.ParseZon, parsed);
            try std.testing.expectFmt(
                \\1:9: error: types are not available in ZON
                \\1:9: note: replace the type with '.'
                \\
            , "{f}", .{diag});
        }
    }
}

test "std.zon tuples" {
    const gpa = std.testing.allocator;

    {
        const Tuple0 = struct {};
        const Tuple1 = struct { f32 };
        const Tuple2 = struct { f32, bool };
        const Tuple3 = struct { f32, bool, u8 };

        const zero = try fromSlice(Tuple0, gpa, ".{}", null, .{});
        try std.testing.expectEqual(Tuple0{}, zero);

        const one = try fromSlice(Tuple1, gpa, ".{1.2}", null, .{});
        try std.testing.expectEqual(Tuple1{1.2}, one);

        const two = try fromSlice(Tuple2, gpa, ".{1.2, true}", null, .{});
        try std.testing.expectEqual(Tuple2{ 1.2, true }, two);

        const three = try fromSlice(Tuple3, gpa, ".{1.2, false, 3}", null, .{});
        try std.testing.expectEqual(Tuple3{ 1.2, false, 3 }, three);
    }

    {
        const Tuple = struct { []const u8, []const u8 };
        const parsed = try fromSliceAlloc(Tuple, gpa, ".{\"hello\", \"world\"}", null, .{});
        defer free(gpa, parsed);
        try std.testing.expectEqualDeep(Tuple{ "hello", "world" }, parsed);
    }

    {
        const Tuple = struct { f32, bool };
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(
            error.ParseZon,
            fromSlice(Tuple, gpa, ".{0.5, true, 123}", &diag, .{}),
        );
        try std.testing.expectFmt("1:14: error: index 2 outside of tuple length 2\n", "{f}", .{diag});
    }

    {
        const Tuple = struct { f32, bool };
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(
            error.ParseZon,
            fromSlice(Tuple, gpa, ".{0.5}", &diag, .{}),
        );
        try std.testing.expectFmt(
            "1:2: error: missing tuple field with index 1\n",
            "{f}",
            .{diag},
        );
    }

    {
        const Tuple = struct { f32 };
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(
            error.ParseZon,
            fromSlice(Tuple, gpa, ".{.foo = 10.0}", &diag, .{}),
        );
        try std.testing.expectFmt("1:2: error: expected tuple\n", "{f}", .{diag});
    }

    {
        const Struct = struct { foo: f32 };
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(
            error.ParseZon,
            fromSlice(Struct, gpa, ".{10.0}", &diag, .{}),
        );
        try std.testing.expectFmt("1:2: error: expected struct\n", "{f}", .{diag});
    }

    {
        const Vec2 = struct { f32, comptime f32 = 1.5 };
        const parsed = try fromSlice(Vec2, gpa, ".{ 1.2 }", null, .{});
        try std.testing.expectEqual(Vec2{ 1.2, 1.5 }, parsed);
    }

    {
        const Vec2 = struct { f32, comptime f32 = 1.5 };
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        const parsed = fromSlice(Vec2, gpa, ".{ 1.2, 1.5}", &diag, .{});
        try std.testing.expectError(error.ParseZon, parsed);
        try std.testing.expectFmt(
            \\1:9: error: cannot initialize comptime field
            \\
        , "{f}", .{diag});
    }
}

test "std.zon arrays and slices" {
    if (builtin.zig_backend == .stage2_c) return error.SkipZigTest;

    const gpa = std.testing.allocator;

    {
        {
            const zero = try fromSlice([0]u8, gpa, ".{}", null, .{});
            try std.testing.expectEqualSlices(u8, &@as([0]u8, .{}), &zero);

            const one = try fromSlice([1]u8, gpa, ".{'a'}", null, .{});
            try std.testing.expectEqualSlices(u8, &@as([1]u8, .{'a'}), &one);

            const two = try fromSlice([2]u8, gpa, ".{'a', 'b'}", null, .{});
            try std.testing.expectEqualSlices(u8, &@as([2]u8, .{ 'a', 'b' }), &two);

            const two_comma = try fromSlice([2]u8, gpa, ".{'a', 'b',}", null, .{});
            try std.testing.expectEqualSlices(u8, &@as([2]u8, .{ 'a', 'b' }), &two_comma);

            const three = try fromSlice([3]u8, gpa, ".{'a', 'b', 'c'}", null, .{});
            try std.testing.expectEqualSlices(u8, &.{ 'a', 'b', 'c' }, &three);

            const sentinel = try fromSlice([3:'z']u8, gpa, ".{'a', 'b', 'c'}", null, .{});
            const expected_sentinel: [3:'z']u8 = .{ 'a', 'b', 'c' };
            try std.testing.expectEqualSlices(u8, &expected_sentinel, &sentinel);
        }

        {
            const zero = try fromSliceAlloc([]const u8, gpa, ".{}", null, .{});
            defer free(gpa, zero);
            try std.testing.expectEqualSlices(u8, @as([]const u8, &.{}), zero);

            const one = try fromSliceAlloc([]u8, gpa, ".{'a'}", null, .{});
            defer free(gpa, one);
            try std.testing.expectEqualSlices(u8, &.{'a'}, one);

            const two = try fromSliceAlloc([]const u8, gpa, ".{'a', 'b'}", null, .{});
            defer free(gpa, two);
            try std.testing.expectEqualSlices(u8, &.{ 'a', 'b' }, two);

            const two_comma = try fromSliceAlloc([]const u8, gpa, ".{'a', 'b',}", null, .{});
            defer free(gpa, two_comma);
            try std.testing.expectEqualSlices(u8, &.{ 'a', 'b' }, two_comma);

            const three = try fromSliceAlloc([]u8, gpa, ".{'a', 'b', 'c'}", null, .{});
            defer free(gpa, three);
            try std.testing.expectEqualSlices(u8, &.{ 'a', 'b', 'c' }, three);

            const sentinel = try fromSliceAlloc([:'z']const u8, gpa, ".{'a', 'b', 'c'}", null, .{});
            defer free(gpa, sentinel);
            const expected_sentinel: [:'z']const u8 = &.{ 'a', 'b', 'c' };
            try std.testing.expectEqualSlices(u8, expected_sentinel, sentinel);
        }
    }

    {
        {
            const parsed = try fromSliceAlloc([1][]const u8, gpa, ".{\"abc\"}", null, .{});
            defer free(gpa, parsed);
            const expected: [1][]const u8 = .{"abc"};
            try std.testing.expectEqualDeep(expected, parsed);
        }

        {
            const parsed = try fromSliceAlloc([]const []const u8, gpa, ".{\"abc\"}", null, .{});
            defer free(gpa, parsed);
            const expected: []const []const u8 = &.{"abc"};
            try std.testing.expectEqualDeep(expected, parsed);
        }
    }

    {
        {
            const sentinel = try fromSlice([1:2]u8, gpa, ".{1}", null, .{});
            try std.testing.expectEqual(@as(usize, 1), sentinel.len);
            try std.testing.expectEqual(@as(u8, 1), sentinel[0]);
            try std.testing.expectEqual(@as(u8, 2), sentinel[1]);
        }

        {
            const sentinel = try fromSliceAlloc([:2]align(4) u8, gpa, ".{1}", null, .{});
            defer free(gpa, sentinel);
            try std.testing.expectEqual(@as(usize, 1), sentinel.len);
            try std.testing.expectEqual(@as(u8, 1), sentinel[0]);
            try std.testing.expectEqual(@as(u8, 2), sentinel[1]);
        }
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(
            error.ParseZon,
            fromSlice([0]u8, gpa, ".{'a', 'b', 'c'}", &diag, .{}),
        );
        try std.testing.expectFmt(
            "1:3: error: index 0 outside of array of length 0\n",
            "{f}",
            .{diag},
        );
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(
            error.ParseZon,
            fromSlice([1]u8, gpa, ".{'a', 'b'}", &diag, .{}),
        );
        try std.testing.expectFmt(
            "1:8: error: index 1 outside of array of length 1\n",
            "{f}",
            .{diag},
        );
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(
            error.ParseZon,
            fromSlice([2]u8, gpa, ".{'a'}", &diag, .{}),
        );
        try std.testing.expectFmt(
            "1:2: error: expected 2 array elements; found 1\n",
            "{f}",
            .{diag},
        );
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(
            error.ParseZon,
            fromSlice([3]u8, gpa, ".{}", &diag, .{}),
        );
        try std.testing.expectFmt(
            "1:2: error: expected 3 array elements; found 0\n",
            "{f}",
            .{diag},
        );
    }

    {
        {
            var diag: Diagnostics = .{};
            defer diag.deinit(gpa);
            try std.testing.expectError(
                error.ParseZon,
                fromSlice([3]bool, gpa, ".{'a', 'b', 'c'}", &diag, .{}),
            );
            try std.testing.expectFmt("1:3: error: expected type 'bool'\n", "{f}", .{diag});
        }

        {
            var diag: Diagnostics = .{};
            defer diag.deinit(gpa);
            try std.testing.expectError(
                error.ParseZon,
                fromSliceAlloc([]bool, gpa, ".{'a', 'b', 'c'}", &diag, .{}),
            );
            try std.testing.expectFmt("1:3: error: expected type 'bool'\n", "{f}", .{diag});
        }
    }

    {
        {
            var diag: Diagnostics = .{};
            defer diag.deinit(gpa);
            try std.testing.expectError(
                error.ParseZon,
                fromSlice([3]u8, gpa, "'a'", &diag, .{}),
            );
            try std.testing.expectFmt("1:1: error: expected array\n", "{f}", .{diag});
        }

        {
            var diag: Diagnostics = .{};
            defer diag.deinit(gpa);
            try std.testing.expectError(
                error.ParseZon,
                fromSliceAlloc([]u8, gpa, "'a'", &diag, .{}),
            );
            try std.testing.expectFmt("1:1: error: expected array\n", "{f}", .{diag});
        }
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(
            error.ParseZon,
            fromSliceAlloc([]u8, gpa, "  &.{'a', 'b', 'c'}", &diag, .{}),
        );
        try std.testing.expectFmt(
            "1:3: error: pointers are not available in ZON\n",
            "{f}",
            .{diag},
        );
    }
}

test "std.zon string literal" {
    const gpa = std.testing.allocator;

    {
        const parsed = try fromSliceAlloc([]const u8, gpa, "\"abc\"", null, .{});
        defer free(gpa, parsed);
        try std.testing.expectEqualStrings(@as([]const u8, "abc"), parsed);
    }

    {
        const parsed = try fromSliceAlloc([]const u8, gpa, "\"ab\\nc\"", null, .{});
        defer free(gpa, parsed);
        try std.testing.expectEqualStrings(@as([]const u8, "ab\nc"), parsed);
    }

    {
        const parsed = try fromSliceAlloc([]const u8, gpa, "\"ab\\x00c\"", null, .{});
        defer free(gpa, parsed);
        try std.testing.expectEqualStrings(@as([]const u8, "ab\x00c"), parsed);
    }

    {
        {
            var diag: Diagnostics = .{};
            defer diag.deinit(gpa);
            try std.testing.expectError(
                error.ParseZon,
                fromSliceAlloc([]u8, gpa, "\"abcd\"", &diag, .{}),
            );
            try std.testing.expectFmt("1:1: error: expected array\n", "{f}", .{diag});
        }

        {
            var diag: Diagnostics = .{};
            defer diag.deinit(gpa);
            try std.testing.expectError(
                error.ParseZon,
                fromSliceAlloc([]u8, gpa, "\\\\abcd", &diag, .{}),
            );
            try std.testing.expectFmt("1:1: error: expected array\n", "{f}", .{diag});
        }
    }

    {
        {
            var ast = try std.zig.Ast.parse(gpa, "\"abcd\"", .zon);
            defer ast.deinit(gpa);
            var zoir = try ZonGen.generate(gpa, ast, .{ .parse_str_lits = false });
            defer zoir.deinit(gpa);
            var diag: Diagnostics = .{};
            defer diag.deinit(gpa);
            try std.testing.expectError(
                error.ParseZon,
                fromSlice([4:0]u8, gpa, "\"abcd\"", &diag, .{}),
            );
            try std.testing.expectFmt("1:1: error: expected array\n", "{f}", .{diag});
        }

        {
            var diag: Diagnostics = .{};
            defer diag.deinit(gpa);
            try std.testing.expectError(
                error.ParseZon,
                fromSlice([4:0]u8, gpa, "\\\\abcd", &diag, .{}),
            );
            try std.testing.expectFmt("1:1: error: expected array\n", "{f}", .{diag});
        }
    }

    {
        {
            const parsed: [:0]const u8 = try fromSliceAlloc(
                [:0]const u8,
                gpa,
                "\"abc\"",
                null,
                .{},
            );
            defer free(gpa, parsed);
            try std.testing.expectEqualStrings("abc", parsed);
            try std.testing.expectEqual(@as(u8, 0), parsed[3]);
        }

        {
            const parsed: [:0]const u8 = try fromSliceAlloc(
                [:0]const u8,
                gpa,
                "\\\\abc",
                null,
                .{},
            );
            defer free(gpa, parsed);
            try std.testing.expectEqualStrings("abc", parsed);
            try std.testing.expectEqual(@as(u8, 0), parsed[3]);
        }
    }

    {
        {
            var diag: Diagnostics = .{};
            defer diag.deinit(gpa);
            try std.testing.expectError(
                error.ParseZon,
                fromSliceAlloc([:1]const u8, gpa, "\"foo\"", &diag, .{}),
            );
            try std.testing.expectFmt("1:1: error: expected array\n", "{f}", .{diag});
        }

        {
            var diag: Diagnostics = .{};
            defer diag.deinit(gpa);
            try std.testing.expectError(
                error.ParseZon,
                fromSliceAlloc([:1]const u8, gpa, "\\\\foo", &diag, .{}),
            );
            try std.testing.expectFmt("1:1: error: expected array\n", "{f}", .{diag});
        }
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(
            error.ParseZon,
            fromSliceAlloc([]const u8, gpa, "true", &diag, .{}),
        );
        try std.testing.expectFmt("1:1: error: expected string\n", "{f}", .{diag});
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(
            error.ParseZon,
            fromSliceAlloc([]const u8, gpa, ".{false}", &diag, .{}),
        );
        try std.testing.expectFmt("1:3: error: expected type 'u8'\n", "{f}", .{diag});
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(
            error.ParseZon,
            fromSliceAlloc([]const i8, gpa, "\"\\a\"", &diag, .{}),
        );
        try std.testing.expectFmt("1:3: error: invalid escape character: 'a'\n", "{f}", .{diag});
    }

    {
        {
            var diag: Diagnostics = .{};
            defer diag.deinit(gpa);
            try std.testing.expectError(
                error.ParseZon,
                fromSliceAlloc([]const i8, gpa, "\"a\"", &diag, .{}),
            );
            try std.testing.expectFmt("1:1: error: expected array\n", "{f}", .{diag});
        }

        {
            var diag: Diagnostics = .{};
            defer diag.deinit(gpa);
            try std.testing.expectError(
                error.ParseZon,
                fromSliceAlloc([]const i8, gpa, "\\\\a", &diag, .{}),
            );
            try std.testing.expectFmt("1:1: error: expected array\n", "{f}", .{diag});
        }
    }

    {
        {
            var diag: Diagnostics = .{};
            defer diag.deinit(gpa);
            try std.testing.expectError(
                error.ParseZon,
                fromSliceAlloc([]align(2) const u8, gpa, "\"abc\"", &diag, .{}),
            );
            try std.testing.expectFmt("1:1: error: expected array\n", "{f}", .{diag});
        }

        {
            var diag: Diagnostics = .{};
            defer diag.deinit(gpa);
            try std.testing.expectError(
                error.ParseZon,
                fromSliceAlloc([]align(2) const u8, gpa, "\\\\abc", &diag, .{}),
            );
            try std.testing.expectFmt("1:1: error: expected array\n", "{f}", .{diag});
        }
    }

    inline for (.{ []const u8, [:0]const u8 }) |String| {
        {
            const S = struct {
                message: String,
                message2: String,
                message3: String,
            };
            const parsed = try fromSliceAlloc(S, gpa,
                \\.{
                \\    .message =
                \\        \\hello, world!
                \\
                \\        \\this is a multiline string!
                \\        \\
                \\        \\...
                \\
                \\    ,
                \\    .message2 =
                \\        \\this too...sort of.
                \\    ,
                \\    .message3 =
                \\        \\
                \\        \\and this.
                \\}
            , null, .{});
            defer free(gpa, parsed);
            try std.testing.expectEqualStrings(
                "hello, world!\nthis is a multiline string!\n\n...",
                parsed.message,
            );
            try std.testing.expectEqualStrings("this too...sort of.", parsed.message2);
            try std.testing.expectEqualStrings("\nand this.", parsed.message3);
        }
    }
}

test "std.zon enum literals" {
    const gpa = std.testing.allocator;

    const Enum = enum {
        foo,
        bar,
        baz,
        @"ab\nc",
    };

    try std.testing.expectEqual(Enum.foo, try fromSlice(Enum, gpa, ".foo", null, .{}));
    try std.testing.expectEqual(Enum.bar, try fromSlice(Enum, gpa, ".bar", null, .{}));
    try std.testing.expectEqual(Enum.baz, try fromSlice(Enum, gpa, ".baz", null, .{}));
    try std.testing.expectEqual(
        Enum.@"ab\nc",
        try fromSlice(Enum, gpa, ".@\"ab\\nc\"", null, .{}),
    );

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(
            error.ParseZon,
            fromSlice(Enum, gpa, ".qux", &diag, .{}),
        );
        try std.testing.expectFmt(
            \\1:2: error: unexpected enum literal 'qux'
            \\1:2: note: supported: 'foo', 'bar', 'baz', '@"ab\nc"'
            \\
        ,
            "{f}",
            .{diag},
        );
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(
            error.ParseZon,
            fromSlice(Enum, gpa, ".@\"foobarbaz\"", &diag, .{}),
        );
        try std.testing.expectFmt(
            \\1:2: error: unexpected enum literal 'foobarbaz'
            \\1:2: note: supported: 'foo', 'bar', 'baz', '@"ab\nc"'
            \\
        ,
            "{f}",
            .{diag},
        );
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(
            error.ParseZon,
            fromSlice(Enum, gpa, "true", &diag, .{}),
        );
        try std.testing.expectFmt("1:1: error: expected enum literal\n", "{f}", .{diag});
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(
            error.ParseZon,
            fromSlice(Enum, gpa, ".@\"\\x00\"", &diag, .{}),
        );
        try std.testing.expectFmt(
            "1:2: error: identifier cannot contain null bytes\n",
            "{f}",
            .{diag},
        );
    }
}

test "std.zon parse bool" {
    const gpa = std.testing.allocator;

    try std.testing.expectEqual(true, try fromSlice(bool, gpa, "true", null, .{}));
    try std.testing.expectEqual(false, try fromSlice(bool, gpa, "false", null, .{}));

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(
            error.ParseZon,
            fromSlice(bool, gpa, " foo", &diag, .{}),
        );
        try std.testing.expectFmt(
            \\1:2: error: invalid expression
            \\1:2: note: ZON allows identifiers 'true', 'false', 'null', 'inf', and 'nan'
            \\1:2: note: precede identifier with '.' for an enum literal
            \\
        , "{f}", .{diag});
    }
    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(error.ParseZon, fromSlice(bool, gpa, "123", &diag, .{}));
        try std.testing.expectFmt("1:1: error: expected type 'bool'\n", "{f}", .{diag});
    }
}

test "std.zon intFromFloatExact" {
    try std.testing.expectEqual(@as(u8, 10), intFromFloatExact(u8, @as(f32, 10.0)).?);
    try std.testing.expectEqual(@as(i8, -123), intFromFloatExact(i8, @as(f64, @as(f64, -123.0))).?);
    try std.testing.expectEqual(@as(i16, 45), intFromFloatExact(i16, @as(f128, @as(f128, 45.0))).?);

    try std.testing.expectEqual(@as(?u4, null), intFromFloatExact(u4, @as(f32, 16.0)));
    try std.testing.expectEqual(@as(?i4, null), intFromFloatExact(i4, @as(f64, -17.0)));
    try std.testing.expectEqual(@as(?u8, null), intFromFloatExact(u8, @as(f128, -2.0)));

    try std.testing.expectEqual(@as(?u8, null), intFromFloatExact(u8, @as(f32, 0.5)));
    try std.testing.expectEqual(@as(?i8, null), intFromFloatExact(i8, @as(f64, 0.01)));

    try std.testing.expectEqual(@as(?u8, null), intFromFloatExact(u8, std.math.inf(f32)));
    try std.testing.expectEqual(@as(?u8, null), intFromFloatExact(u8, -std.math.inf(f32)));
    try std.testing.expectEqual(@as(?u8, null), intFromFloatExact(u8, std.math.nan(f32)));
}

test "std.zon parse int" {
    const gpa = std.testing.allocator;

    try std.testing.expectEqual(@as(u8, 10), try fromSlice(u8, gpa, "10", null, .{}));
    try std.testing.expectEqual(@as(i16, 24), try fromSlice(i16, gpa, "24", null, .{}));
    try std.testing.expectEqual(@as(i14, -4), try fromSlice(i14, gpa, "-4", null, .{}));
    try std.testing.expectEqual(@as(i32, -123), try fromSlice(i32, gpa, "-123", null, .{}));

    try std.testing.expectEqual(@as(i8, 127), try fromSlice(i8, gpa, "127", null, .{}));
    try std.testing.expectEqual(@as(i8, -128), try fromSlice(i8, gpa, "-128", null, .{}));

    try std.testing.expectEqual(@as(u8, 'a'), try fromSlice(u8, gpa, "'a'", null, .{}));
    try std.testing.expectEqual(@as(u8, 'z'), try fromSlice(u8, gpa, "'z'", null, .{}));

    try std.testing.expectEqual(
        @as(u65, 36893488147419103231),
        try fromSlice(u65, gpa, "36893488147419103231", null, .{}),
    );
    try std.testing.expectEqual(
        @as(u65, 36893488147419103231),
        try fromSlice(u65, gpa, "368934_881_474191032_31", null, .{}),
    );

    try std.testing.expectEqual(
        @as(i66, 36893488147419103231),
        try fromSlice(i66, gpa, "36893488147419103231", null, .{}),
    );
    try std.testing.expectEqual(
        @as(i66, -36893488147419103232),
        try fromSlice(i66, gpa, "-36893488147419103232", null, .{}),
    );
    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(error.ParseZon, fromSlice(
            i66,
            gpa,
            "36893488147419103232",
            &diag,
            .{},
        ));
        try std.testing.expectFmt(
            "1:1: error: type 'i66' cannot represent value\n",
            "{f}",
            .{diag},
        );
    }
    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(error.ParseZon, fromSlice(
            i66,
            gpa,
            "-36893488147419103233",
            &diag,
            .{},
        ));
        try std.testing.expectFmt(
            "1:1: error: type 'i66' cannot represent value\n",
            "{f}",
            .{diag},
        );
    }

    try std.testing.expectEqual(@as(i8, -1), try fromSlice(i8, gpa, "-1.0", null, .{}));
    try std.testing.expectEqual(@as(i8, 123), try fromSlice(i8, gpa, "123.0", null, .{}));

    try std.testing.expectEqual(@as(i16, 0xff), try fromSlice(i16, gpa, "0xff", null, .{}));
    try std.testing.expectEqual(@as(i16, -0xff), try fromSlice(i16, gpa, "-0xff", null, .{}));
    try std.testing.expectEqual(@as(i16, 0o77), try fromSlice(i16, gpa, "0o77", null, .{}));
    try std.testing.expectEqual(@as(i16, -0o77), try fromSlice(i16, gpa, "-0o77", null, .{}));
    try std.testing.expectEqual(@as(i16, 0b11), try fromSlice(i16, gpa, "0b11", null, .{}));
    try std.testing.expectEqual(@as(i16, -0b11), try fromSlice(i16, gpa, "-0b11", null, .{}));

    try std.testing.expectEqual(@as(u65, 0x1ffffffffffffffff), try fromSlice(
        u65,
        gpa,
        "0x1ffffffffffffffff",
        null,
        .{},
    ));
    try std.testing.expectEqual(@as(i66, 0x1ffffffffffffffff), try fromSlice(
        i66,
        gpa,
        "0x1ffffffffffffffff",
        null,
        .{},
    ));
    try std.testing.expectEqual(@as(i66, -0x1ffffffffffffffff), try fromSlice(
        i66,
        gpa,
        "-0x1ffffffffffffffff",
        null,
        .{},
    ));
    try std.testing.expectEqual(@as(u65, 0x1ffffffffffffffff), try fromSlice(
        u65,
        gpa,
        "0o3777777777777777777777",
        null,
        .{},
    ));
    try std.testing.expectEqual(@as(i66, 0x1ffffffffffffffff), try fromSlice(
        i66,
        gpa,
        "0o3777777777777777777777",
        null,
        .{},
    ));
    try std.testing.expectEqual(@as(i66, -0x1ffffffffffffffff), try fromSlice(
        i66,
        gpa,
        "-0o3777777777777777777777",
        null,
        .{},
    ));
    try std.testing.expectEqual(@as(u65, 0x1ffffffffffffffff), try fromSlice(
        u65,
        gpa,
        "0b11111111111111111111111111111111111111111111111111111111111111111",
        null,
        .{},
    ));
    try std.testing.expectEqual(@as(i66, 0x1ffffffffffffffff), try fromSlice(
        i66,
        gpa,
        "0b11111111111111111111111111111111111111111111111111111111111111111",
        null,
        .{},
    ));
    try std.testing.expectEqual(@as(i66, -0x1ffffffffffffffff), try fromSlice(
        i66,
        gpa,
        "-0b11111111111111111111111111111111111111111111111111111111111111111",
        null,
        .{},
    ));

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(error.ParseZon, fromSlice(u8, gpa, "32a32", &diag, .{}));
        try std.testing.expectFmt(
            "1:3: error: invalid digit 'a' for decimal base\n",
            "{f}",
            .{diag},
        );
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(error.ParseZon, fromSlice(u8, gpa, "true", &diag, .{}));
        try std.testing.expectFmt("1:1: error: expected type 'u8'\n", "{f}", .{diag});
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(error.ParseZon, fromSlice(u8, gpa, "256", &diag, .{}));
        try std.testing.expectFmt(
            "1:1: error: type 'u8' cannot represent value\n",
            "{f}",
            .{diag},
        );
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(error.ParseZon, fromSlice(i8, gpa, "-129", &diag, .{}));
        try std.testing.expectFmt(
            "1:1: error: type 'i8' cannot represent value\n",
            "{f}",
            .{diag},
        );
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(error.ParseZon, fromSlice(u8, gpa, "-1", &diag, .{}));
        try std.testing.expectFmt(
            "1:1: error: type 'u8' cannot represent value\n",
            "{f}",
            .{diag},
        );
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(error.ParseZon, fromSlice(u8, gpa, "1.5", &diag, .{}));
        try std.testing.expectFmt(
            "1:1: error: type 'u8' cannot represent value\n",
            "{f}",
            .{diag},
        );
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(error.ParseZon, fromSlice(u8, gpa, "-1.0", &diag, .{}));
        try std.testing.expectFmt(
            "1:1: error: type 'u8' cannot represent value\n",
            "{f}",
            .{diag},
        );
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(error.ParseZon, fromSlice(i8, gpa, "-0", &diag, .{}));
        try std.testing.expectFmt(
            \\1:2: error: integer literal '-0' is ambiguous
            \\1:2: note: use '0' for an integer zero
            \\1:2: note: use '-0.0' for a floating-point signed zero
            \\
        , "{f}", .{diag});
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(error.ParseZon, fromSlice(f32, gpa, "-0", &diag, .{}));
        try std.testing.expectFmt(
            \\1:2: error: integer literal '-0' is ambiguous
            \\1:2: note: use '0' for an integer zero
            \\1:2: note: use '-0.0' for a floating-point signed zero
            \\
        , "{f}", .{diag});
    }

    try std.testing.expect(
        std.math.isNegativeZero(try fromSlice(f32, gpa, "-0.0", null, .{})),
    );
    try std.testing.expect(std.math.isPositiveZero(try fromSlice(f32, gpa, "0.0", null, .{})));

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(error.ParseZon, fromSlice(i8, gpa, "--2", &diag, .{}));
        try std.testing.expectFmt(
            "1:1: error: expected number or 'inf' after '-'\n",
            "{f}",
            .{diag},
        );
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(
            error.ParseZon,
            fromSlice(f32, gpa, "--2.0", &diag, .{}),
        );
        try std.testing.expectFmt(
            "1:1: error: expected number or 'inf' after '-'\n",
            "{f}",
            .{diag},
        );
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(error.ParseZon, fromSlice(u8, gpa, "0xg", &diag, .{}));
        try std.testing.expectFmt("1:3: error: invalid digit 'g' for hex base\n", "{f}", .{diag});
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(error.ParseZon, fromSlice(u8, gpa, "0123", &diag, .{}));
        try std.testing.expectFmt(
            \\1:1: error: number '0123' has leading zero
            \\1:1: note: use '0o' prefix for octal literals
            \\
        , "{f}", .{diag});
    }
}

test "std.zon negative char" {
    const gpa = std.testing.allocator;

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(error.ParseZon, fromSlice(f32, gpa, "-'a'", &diag, .{}));
        try std.testing.expectFmt(
            "1:1: error: expected number or 'inf' after '-'\n",
            "{f}",
            .{diag},
        );
    }
    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(error.ParseZon, fromSlice(i16, gpa, "-'a'", &diag, .{}));
        try std.testing.expectFmt(
            "1:1: error: expected number or 'inf' after '-'\n",
            "{f}",
            .{diag},
        );
    }
}

test "std.zon parse float" {
    if (builtin.cpu.arch == .x86 and builtin.abi == .musl and builtin.link_mode == .dynamic) return error.SkipZigTest;

    const gpa = std.testing.allocator;

    try std.testing.expectEqual(@as(f16, 0.5), try fromSlice(f16, gpa, "0.5", null, .{}));
    try std.testing.expectEqual(
        @as(f32, 123.456),
        try fromSlice(f32, gpa, "123.456", null, .{}),
    );
    try std.testing.expectEqual(
        @as(f64, -123.456),
        try fromSlice(f64, gpa, "-123.456", null, .{}),
    );
    try std.testing.expectEqual(@as(f128, 42.5), try fromSlice(f128, gpa, "42.5", null, .{}));

    try std.testing.expectEqual(@as(f16, 5.0), try fromSlice(f16, gpa, "5.0", null, .{}));
    try std.testing.expectEqual(@as(f16, 5.0), try fromSlice(f16, gpa, "5", null, .{}));
    try std.testing.expectEqual(@as(f32, -102), try fromSlice(f32, gpa, "-102.0", null, .{}));
    try std.testing.expectEqual(@as(f32, -102), try fromSlice(f32, gpa, "-102", null, .{}));

    try std.testing.expectEqual(@as(f32, 'a'), try fromSlice(f32, gpa, "'a'", null, .{}));
    try std.testing.expectEqual(@as(f32, 'z'), try fromSlice(f32, gpa, "'z'", null, .{}));

    try std.testing.expectEqual(
        @as(f32, 36893488147419103231.0),
        try fromSlice(f32, gpa, "36893488147419103231", null, .{}),
    );
    try std.testing.expectEqual(
        @as(f32, -36893488147419103231.0),
        try fromSlice(f32, gpa, "-36893488147419103231", null, .{}),
    );
    try std.testing.expectEqual(@as(f128, 0x1ffffffffffffffff), try fromSlice(
        f128,
        gpa,
        "0x1ffffffffffffffff",
        null,
        .{},
    ));
    try std.testing.expectEqual(@as(f32, @floatFromInt(0x1ffffffffffffffff)), try fromSlice(
        f32,
        gpa,
        "0x1ffffffffffffffff",
        null,
        .{},
    ));

    try std.testing.expectEqual(
        @as(f32, 123.0E+77),
        try fromSlice(f32, gpa, "12_3.0E+77", null, .{}),
    );

    try std.testing.expectEqual(
        @as(f32, 0x103.70p-5),
        try fromSlice(f32, gpa, "0x103.70p-5", null, .{}),
    );
    try std.testing.expectEqual(
        @as(f32, -0x103.70),
        try fromSlice(f32, gpa, "-0x103.70", null, .{}),
    );
    try std.testing.expectEqual(
        @as(f32, 0x1234_5678.9ABC_CDEFp-10),
        try fromSlice(f32, gpa, "0x1234_5678.9ABC_CDEFp-10", null, .{}),
    );

    try std.testing.expect(std.math.isPositiveInf(try fromSlice(f32, gpa, "inf", null, .{})));
    try std.testing.expect(std.math.isNegativeInf(try fromSlice(f32, gpa, "-inf", null, .{})));
    try std.testing.expect(std.math.isNan(try fromSlice(f32, gpa, "nan", null, .{})));

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(error.ParseZon, fromSlice(f32, gpa, "-nan", &diag, .{}));
        try std.testing.expectFmt(
            "1:1: error: expected number or 'inf' after '-'\n",
            "{f}",
            .{diag},
        );
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(error.ParseZon, fromSlice(i8, gpa, "nan", &diag, .{}));
        try std.testing.expectFmt("1:1: error: expected type 'i8'\n", "{f}", .{diag});
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(error.ParseZon, fromSlice(i8, gpa, "nan", &diag, .{}));
        try std.testing.expectFmt("1:1: error: expected type 'i8'\n", "{f}", .{diag});
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(error.ParseZon, fromSlice(i8, gpa, "inf", &diag, .{}));
        try std.testing.expectFmt("1:1: error: expected type 'i8'\n", "{f}", .{diag});
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(error.ParseZon, fromSlice(i8, gpa, "-inf", &diag, .{}));
        try std.testing.expectFmt("1:1: error: expected type 'i8'\n", "{f}", .{diag});
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(error.ParseZon, fromSlice(f32, gpa, "foo", &diag, .{}));
        try std.testing.expectFmt(
            \\1:1: error: invalid expression
            \\1:1: note: ZON allows identifiers 'true', 'false', 'null', 'inf', and 'nan'
            \\1:1: note: precede identifier with '.' for an enum literal
            \\
        , "{f}", .{diag});
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(error.ParseZon, fromSlice(f32, gpa, "-foo", &diag, .{}));
        try std.testing.expectFmt(
            "1:1: error: expected number or 'inf' after '-'\n",
            "{f}",
            .{diag},
        );
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(
            error.ParseZon,
            fromSlice(f32, gpa, "\"foo\"", &diag, .{}),
        );
        try std.testing.expectFmt("1:1: error: expected type 'f32'\n", "{f}", .{diag});
    }
}

test "std.zon free on error" {
    {
        const Struct = struct {
            x: []const u8,
            y: []const u8,
            z: bool,
        };
        try std.testing.expectError(error.ParseZon, fromSliceAlloc(Struct, std.testing.allocator,
            \\.{
            \\    .x = "hello",
            \\    .y = "world",
            \\    .z = "fail",
            \\}
        , null, .{}));
    }

    {
        const Struct = struct {
            []const u8,
            []const u8,
            bool,
        };
        try std.testing.expectError(error.ParseZon, fromSliceAlloc(Struct, std.testing.allocator,
            \\.{
            \\    "hello",
            \\    "world",
            \\    "fail",
            \\}
        , null, .{}));
    }

    {
        const Struct = struct {
            x: []const u8,
            y: bool,
        };
        try std.testing.expectError(error.ParseZon, fromSliceAlloc(Struct, std.testing.allocator,
            \\.{
            \\    .x = "hello",
            \\}
        , null, .{}));
    }

    {
        try std.testing.expectError(error.ParseZon, fromSliceAlloc(
            [3][]const u8,
            std.testing.allocator,
            \\.{
            \\    "hello",
            \\    false,
            \\    false,
            \\}
        ,
            null,
            .{},
        ));
    }

    {
        try std.testing.expectError(error.ParseZon, fromSliceAlloc(
            [][]const u8,
            std.testing.allocator,
            \\.{
            \\    "hello",
            \\    "world",
            \\    false,
            \\}
        ,
            null,
            .{},
        ));
    }

    try std.testing.expectEqual(
        @as(f32, 1.5),
        (try fromSlice(union { x: f32 }, std.testing.allocator, ".{ .x = 1.5 }", null, .{})).x,
    );

    {
        const result = try fromSliceAlloc(
            union { x: []const u8 },
            std.testing.allocator,
            ".{ .x = \"foo\" }",
            null,
            .{},
        );
        defer free(std.testing.allocator, result.x);
        try std.testing.expectEqualStrings("foo", result.x);
    }

    {
        const S = struct {
            union { x: []const u8 },
            bool,
        };
        const result = try fromSliceAlloc(
            S,
            std.testing.allocator,
            ".{ .{ .x = \"foo\" }, true }",
            null,
            .{ .free_on_error = false },
        );
        defer free(std.testing.allocator, result[0].x);
        try std.testing.expectEqualStrings("foo", result[0].x);
        try std.testing.expect(result[1]);
    }

    {
        const S = struct {
            a: union { x: []const u8 },
            b: bool,
        };
        const result = try fromSliceAlloc(
            S,
            std.testing.allocator,
            ".{ .a = .{ .x = \"foo\" }, .b = true }",
            null,
            .{
                .free_on_error = false,
            },
        );
        defer free(std.testing.allocator, result.a.x);
        try std.testing.expectEqualStrings("foo", result.a.x);
        try std.testing.expect(result.b);
    }

    {
        const S = [2]union { x: []const u8 };
        const result = try fromSliceAlloc(
            S,
            std.testing.allocator,
            ".{ .{ .x = \"foo\" }, .{ .x = \"bar\" } }",
            null,
            .{
                .free_on_error = false,
            },
        );
        defer free(std.testing.allocator, result[0].x);
        defer free(std.testing.allocator, result[1].x);
        try std.testing.expectEqualStrings("foo", result[0].x);
        try std.testing.expectEqualStrings("bar", result[1].x);
    }

    {
        const S = []union { x: []const u8 };
        const result = try fromSliceAlloc(
            S,
            std.testing.allocator,
            ".{ .{ .x = \"foo\" }, .{ .x = \"bar\" } }",
            null,
            .{
                .free_on_error = false,
            },
        );
        defer std.testing.allocator.free(result);
        defer free(std.testing.allocator, result[0].x);
        defer free(std.testing.allocator, result[1].x);
        try std.testing.expectEqualStrings("foo", result[0].x);
        try std.testing.expectEqualStrings("bar", result[1].x);
    }
}

test "std.zon vector" {
    if (builtin.zig_backend == .stage2_c) return error.SkipZigTest;

    const gpa = std.testing.allocator;

    try std.testing.expectEqual(
        @Vector(0, bool){},
        try fromSlice(@Vector(0, bool), gpa, ".{}", null, .{}),
    );
    try std.testing.expectEqual(
        @Vector(3, bool){ true, false, true },
        try fromSlice(@Vector(3, bool), gpa, ".{true, false, true}", null, .{}),
    );

    try std.testing.expectEqual(
        @Vector(0, f32){},
        try fromSlice(@Vector(0, f32), gpa, ".{}", null, .{}),
    );
    try std.testing.expectEqual(
        @Vector(3, f32){ 1.5, 2.5, 3.5 },
        try fromSlice(@Vector(3, f32), gpa, ".{1.5, 2.5, 3.5}", null, .{}),
    );

    try std.testing.expectEqual(
        @Vector(0, u8){},
        try fromSlice(@Vector(0, u8), gpa, ".{}", null, .{}),
    );
    try std.testing.expectEqual(
        @Vector(3, u8){ 2, 4, 6 },
        try fromSlice(@Vector(3, u8), gpa, ".{2, 4, 6}", null, .{}),
    );

    {
        try std.testing.expectEqual(
            @Vector(0, *const u8){},
            try fromSliceAlloc(@Vector(0, *const u8), gpa, ".{}", null, .{}),
        );
        const pointers = try fromSliceAlloc(@Vector(3, *const u8), gpa, ".{2, 4, 6}", null, .{});
        defer free(gpa, pointers);
        try std.testing.expectEqualDeep(@Vector(3, *const u8){ &2, &4, &6 }, pointers);
    }

    {
        try std.testing.expectEqual(
            @Vector(0, ?*const u8){},
            try fromSliceAlloc(@Vector(0, ?*const u8), gpa, ".{}", null, .{}),
        );
        const pointers = try fromSliceAlloc(@Vector(3, ?*const u8), gpa, ".{2, null, 6}", null, .{});
        defer free(gpa, pointers);
        try std.testing.expectEqualDeep(@Vector(3, ?*const u8){ &2, null, &6 }, pointers);
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(
            error.ParseZon,
            fromSlice(@Vector(2, f32), gpa, ".{0.5}", &diag, .{}),
        );
        try std.testing.expectFmt(
            "1:2: error: expected 2 array elements; found 1\n",
            "{f}",
            .{diag},
        );
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(
            error.ParseZon,
            fromSlice(@Vector(2, f32), gpa, ".{0.5, 1.5, 2.5}", &diag, .{}),
        );
        try std.testing.expectFmt(
            "1:13: error: index 2 outside of array of length 2\n",
            "{f}",
            .{diag},
        );
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(
            error.ParseZon,
            fromSlice(@Vector(3, f32), gpa, ".{0.5, true, 2.5}", &diag, .{}),
        );
        try std.testing.expectFmt(
            "1:8: error: expected type 'f32'\n",
            "{f}",
            .{diag},
        );
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(
            error.ParseZon,
            fromSlice(@Vector(3, u8), gpa, "true", &diag, .{}),
        );
        try std.testing.expectFmt("1:1: error: expected type '@Vector(3, u8)'\n", "{f}", .{diag});
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(
            error.ParseZon,
            fromSliceAlloc(@Vector(3, *u8), gpa, ".{1, true, 3}", &diag, .{}),
        );
        try std.testing.expectFmt("1:6: error: expected type 'u8'\n", "{f}", .{diag});
    }
}

test "std.zon add pointers" {
    const gpa = std.testing.allocator;

    {
        const result = try fromSliceAlloc(*u32, gpa, "10", null, .{});
        defer free(gpa, result);
        try std.testing.expectEqual(@as(u32, 10), result.*);
    }

    {
        const result = try fromSliceAlloc(**u32, gpa, "10", null, .{});
        defer free(gpa, result);
        try std.testing.expectEqual(@as(u32, 10), result.*.*);
    }

    {
        const result = try fromSliceAlloc(***u32, gpa, "10", null, .{});
        defer free(gpa, result);
        try std.testing.expectEqual(@as(u32, 10), result.*.*.*);
    }

    {
        const some = try fromSliceAlloc(?*u32, gpa, "10", null, .{});
        defer free(gpa, some);
        try std.testing.expectEqual(@as(u32, 10), some.?.*);

        const none = try fromSliceAlloc(?*u32, gpa, "null", null, .{});
        defer free(gpa, none);
        try std.testing.expectEqual(null, none);
    }

    {
        const some = try fromSliceAlloc(*?u32, gpa, "10", null, .{});
        defer free(gpa, some);
        try std.testing.expectEqual(@as(u32, 10), some.*.?);

        const none = try fromSliceAlloc(*?u32, gpa, "null", null, .{});
        defer free(gpa, none);
        try std.testing.expectEqual(null, none.*);
    }

    {
        const some = try fromSliceAlloc(?**u32, gpa, "10", null, .{});
        defer free(gpa, some);
        try std.testing.expectEqual(@as(u32, 10), some.?.*.*);

        const none = try fromSliceAlloc(?**u32, gpa, "null", null, .{});
        defer free(gpa, none);
        try std.testing.expectEqual(null, none);
    }

    {
        const some = try fromSliceAlloc(*?*u32, gpa, "10", null, .{});
        defer free(gpa, some);
        try std.testing.expectEqual(@as(u32, 10), some.*.?.*);

        const none = try fromSliceAlloc(*?*u32, gpa, "null", null, .{});
        defer free(gpa, none);
        try std.testing.expectEqual(null, none.*);
    }

    {
        const some = try fromSliceAlloc(**?u32, gpa, "10", null, .{});
        defer free(gpa, some);
        try std.testing.expectEqual(@as(u32, 10), some.*.*.?);

        const none = try fromSliceAlloc(**?u32, gpa, "null", null, .{});
        defer free(gpa, none);
        try std.testing.expectEqual(null, none.*.*);
    }

    {
        const result = try fromSliceAlloc(*[3]u8, gpa, ".{ 1, 2, 3 }", null, .{});
        defer free(gpa, result);
        try std.testing.expectEqual([3]u8{ 1, 2, 3 }, result.*);
    }

    {
        const Inner = struct {
            f1: *const ?*const []const u8,
            f2: *const ?*const []const u8,
        };
        const Outer = struct {
            f1: *const ?*const Inner,
            f2: *const ?*const Inner,
        };
        const expected: Outer = .{
            .f1 = &&.{
                .f1 = &null,
                .f2 = &&"foo",
            },
            .f2 = &null,
        };

        const found = try fromSliceAlloc(?*Outer, gpa,
            \\.{
            \\    .f1 = .{
            \\        .f1 = null,
            \\        .f2 = "foo",
            \\    },
            \\    .f2 = null,
            \\}
        , null, .{});
        defer free(gpa, found);

        try std.testing.expectEqualDeep(expected, found.?.*);
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(
            error.ParseZon,
            fromSliceAlloc(*const ?*const u8, gpa, "true", &diag, .{}),
        );
        try std.testing.expectFmt("1:1: error: expected type '?u8'\n", "{f}", .{diag});
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(
            error.ParseZon,
            fromSliceAlloc(*const ?*const f32, gpa, "true", &diag, .{}),
        );
        try std.testing.expectFmt("1:1: error: expected type '?f32'\n", "{f}", .{diag});
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(
            error.ParseZon,
            fromSliceAlloc(*const ?*const @Vector(3, u8), gpa, "true", &diag, .{}),
        );
        try std.testing.expectFmt("1:1: error: expected type '?@Vector(3, u8)'\n", "{f}", .{diag});
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(
            error.ParseZon,
            fromSliceAlloc(*const ?*const bool, gpa, "10", &diag, .{}),
        );
        try std.testing.expectFmt("1:1: error: expected type '?bool'\n", "{f}", .{diag});
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(
            error.ParseZon,
            fromSliceAlloc(*const ?*const struct { a: i32 }, gpa, "true", &diag, .{}),
        );
        try std.testing.expectFmt("1:1: error: expected optional struct\n", "{f}", .{diag});
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(
            error.ParseZon,
            fromSliceAlloc(*const ?*const struct { i32 }, gpa, "true", &diag, .{}),
        );
        try std.testing.expectFmt("1:1: error: expected optional tuple\n", "{f}", .{diag});
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(
            error.ParseZon,
            fromSliceAlloc(*const ?*const union { x: void }, gpa, "true", &diag, .{}),
        );
        try std.testing.expectFmt("1:1: error: expected optional union\n", "{f}", .{diag});
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(
            error.ParseZon,
            fromSliceAlloc(*const ?*const [3]u8, gpa, "true", &diag, .{}),
        );
        try std.testing.expectFmt("1:1: error: expected optional array\n", "{f}", .{diag});
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(
            error.ParseZon,
            fromSliceAlloc(?[3]u8, gpa, "true", &diag, .{}),
        );
        try std.testing.expectFmt("1:1: error: expected optional array\n", "{f}", .{diag});
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(
            error.ParseZon,
            fromSliceAlloc(*const ?*const []u8, gpa, "true", &diag, .{}),
        );
        try std.testing.expectFmt("1:1: error: expected optional array\n", "{f}", .{diag});
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(
            error.ParseZon,
            fromSliceAlloc(?[]u8, gpa, "true", &diag, .{}),
        );
        try std.testing.expectFmt("1:1: error: expected optional array\n", "{f}", .{diag});
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(
            error.ParseZon,
            fromSliceAlloc(*const ?*const []const u8, gpa, "true", &diag, .{}),
        );
        try std.testing.expectFmt("1:1: error: expected optional string\n", "{f}", .{diag});
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        try std.testing.expectError(
            error.ParseZon,
            fromSliceAlloc(*const ?*const enum { foo }, gpa, "true", &diag, .{}),
        );
        try std.testing.expectFmt("1:1: error: expected optional enum literal\n", "{f}", .{diag});
    }
}

test "std.zon stop on node" {
    const gpa = std.testing.allocator;

    {
        const Vec2 = struct {
            x: Zoir.Node.Index,
            y: f32,
        };

        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        const result = try fromSlice(Vec2, gpa, ".{ .x = 1.5, .y = 2.5 }", &diag, .{});
        try std.testing.expectEqual(result.y, 2.5);
        try std.testing.expectEqual(Zoir.Node{ .float_literal = 1.5 }, result.x.get(diag.zoir));
    }

    {
        var diag: Diagnostics = .{};
        defer diag.deinit(gpa);
        const result = try fromSlice(Zoir.Node.Index, gpa, "1.23", &diag, .{});
        try std.testing.expectEqual(Zoir.Node{ .float_literal = 1.23 }, result.get(diag.zoir));
    }
}

test "std.zon no alloc" {
    const gpa = std.testing.allocator;

    try std.testing.expectEqual(
        [3]u8{ 1, 2, 3 },
        try fromSlice([3]u8, gpa, ".{ 1, 2, 3 }", null, .{}),
    );

    const Nested = struct { u8, u8, struct { u8, u8 } };

    var ast = try std.zig.Ast.parse(gpa, ".{ 1, 2, .{ 3, 4 } }", .zon);
    defer ast.deinit(gpa);

    var zoir = try ZonGen.generate(gpa, ast, .{ .parse_str_lits = false });
    defer zoir.deinit(gpa);

    try std.testing.expectEqual(
        Nested{ 1, 2, .{ 3, 4 } },
        try fromZoir(Nested, ast, zoir, null, .{}),
    );

    try std.testing.expectEqual(
        Nested{ 1, 2, .{ 3, 4 } },
        try fromZoirNode(Nested, ast, zoir, .root, null, .{}),
    );
}
