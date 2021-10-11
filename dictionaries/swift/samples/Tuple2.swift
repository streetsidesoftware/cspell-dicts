/// A simple tuple of two values that conforms to protocols automatically based
/// on the conformances of each base type.
struct Tuple2<T1, T2> {
    var t1: T1
    var t2: T2

    @_transparent
    init(t1: T1, t2: T2) {
        self.t1 = t1
        self.t2 = t2
    }

    /// Returns a tuple with the order of t1 and t2 flipped around.
    @_transparent
    func inverse() -> Tuple2<T2, T1> {
        .init(t1: t2, t2: t1)
    }
}

extension Tuple2: Equatable where T1: Equatable, T2: Equatable {}
extension Tuple2: Hashable  where T1: Hashable,  T2: Hashable  {}
extension Tuple2: Encodable where T1: Encodable, T2: Encodable {}
extension Tuple2: Decodable where T1: Decodable, T2: Decodable {}
extension Tuple2: Sendable  where T1: Sendable,  T2: Sendable  {}

extension Tuple2: CustomReflectable where T1: CustomReflectable, T2: CustomReflectable {
    var customMirror: Mirror {
        Mirror(self, children: [("t1", t1 as Any), ("t2", t2 as Any)])
    }
}

extension Tuple2: Comparable where T1: Comparable, T2: Comparable {
    static func < (lhs: Self, rhs: Self) -> Bool {
        return lhs.t1 < rhs.t1 && lhs.t2 < rhs.t2
    }
}

extension Tuple2: Strideable where T1: Strideable, T2: Strideable, T1.Stride == T2.Stride {
    typealias Stride = T1.Stride

    func advanced(by n: Stride) -> Tuple2<T1, T2> {
        .init(t1: t1.advanced(by: n), t2: t2.advanced(by: n))
    }

    func distance(to other: Tuple2<T1, T2>) -> T1.Stride {
        Swift.max(t1.distance(to: other.t1), t2.distance(to: other.t2))
    }
}

extension Tuple2: AdditiveArithmetic where T1: AdditiveArithmetic, T2: AdditiveArithmetic {
    static var zero: Tuple2<T1, T2> { .init(t1: .zero, t2: .zero) }

    static func + (lhs: Self, rhs: Self) -> Self {
        .init(t1: lhs.t1 + rhs.t1, t2: lhs.t2 + rhs.t2)
    }

    static func - (lhs: Self, rhs: Self) -> Self {
        .init(t1: lhs.t1 + rhs.t1, t2: lhs.t2 + rhs.t2)
    }
}

extension Tuple2: ExpressibleByFloatLiteral where T1: ExpressibleByFloatLiteral, T2: ExpressibleByFloatLiteral, T1.FloatLiteralType == T2.FloatLiteralType {
    typealias FloatLiteralType = T1.FloatLiteralType

    @inlinable
    init(floatLiteral value: FloatLiteralType) {
        self.init(
            t1: .init(floatLiteral: value),
            t2: .init(floatLiteral: value)
        )
    }
}

extension Tuple2: ExpressibleByIntegerLiteral where T1: ExpressibleByIntegerLiteral, T2: ExpressibleByIntegerLiteral, T1.IntegerLiteralType == T2.IntegerLiteralType {
    typealias IntegerLiteralType = T1.IntegerLiteralType

    @inlinable
    init(integerLiteral value: IntegerLiteralType) {
        self.init(
            t1: .init(integerLiteral: value),
            t2: .init(integerLiteral: value)
        )
    }
}

extension Tuple2: ExpressibleByUnicodeScalarLiteral where T1: ExpressibleByUnicodeScalarLiteral, T2: ExpressibleByUnicodeScalarLiteral, T1.UnicodeScalarLiteralType == T2.UnicodeScalarLiteralType {
    typealias UnicodeScalarLiteralType = T1.UnicodeScalarLiteralType

    @inlinable
    init(unicodeScalarLiteral value: UnicodeScalarLiteralType) {
        self.init(
            t1: .init(unicodeScalarLiteral: value), 
            t2: .init(unicodeScalarLiteral: value)
        )
    }
}

extension Tuple2: ExpressibleByExtendedGraphemeClusterLiteral where T1: ExpressibleByExtendedGraphemeClusterLiteral, T2: ExpressibleByExtendedGraphemeClusterLiteral, T1.ExtendedGraphemeClusterLiteralType == T2.ExtendedGraphemeClusterLiteralType, T1.UnicodeScalarLiteralType == T2.UnicodeScalarLiteralType {
    typealias ExtendedGraphemeClusterLiteralType = T1.ExtendedGraphemeClusterLiteralType

    @inlinable
    init(extendedGraphemeClusterLiteral value: T1.ExtendedGraphemeClusterLiteralType) {
        self.init(
            t1: .init(extendedGraphemeClusterLiteral: value),
            t2: .init(extendedGraphemeClusterLiteral: value)
        )
    }
}

// MARK: Extension methods

extension Tuple2 where T1 == Bool, T2 == Bool {
    @inlinable
    mutating func toggle() {
        t1.toggle()
        t2.toggle()
    }

    @_transparent
    func and() -> Bool {
        t1 && t2
    }

    @_transparent
    func or() -> Bool {
        t1 || t2
    }

    @_transparent
    func xor() -> Bool {
        t1 != t2
    }
}
