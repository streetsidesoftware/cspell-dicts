------------------------------------------------------------------------------
--                             G N A T C O L L                              --
--                                                                          --
--                     Copyright (C) 2009-2018, AdaCore                     --
--                                                                          --
-- This library is free software;  you can redistribute it and/or modify it --
-- under terms of the  GNU General Public License  as published by the Free --
-- Software  Foundation;  either version 3,  or (at your  option) any later --
-- version. This library is distributed in the hope that it will be useful, --
-- but WITHOUT ANY WARRANTY;  without even the implied warranty of          --
-- MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.                     --
--                                                                          --
-- As a special exception under Section 7 of GPL version 3, you are granted --
-- additional permissions described in the GCC Runtime Library Exception,   --
-- version 3.1, as published by the Free Software Foundation.               --
--                                                                          --
-- You should have received a copy of the GNU General Public License and    --
-- a copy of the GCC Runtime Library Exception along with this program;     --
-- see the files COPYING3 and COPYING.RUNTIME respectively.  If not, see    --
-- <http://www.gnu.org/licenses/>.                                          --
--                                                                          --
------------------------------------------------------------------------------

-- cspell:words symlink symlinks GNATCOLL Mmap Unref

with GNAT.Directory_Operations;
with GNAT.Strings;                  use GNAT.Strings;

with GNATCOLL.IO.Native;
with GNATCOLL.IO.Remote.Unix;
with GNATCOLL.IO.Remote.Windows;
with GNATCOLL.Mmap;
with GNATCOLL.Path;                 use GNATCOLL.Path;
with GNATCOLL.Remote;               use GNATCOLL.Remote;
with GNATCOLL.Remote.Db;            use GNATCOLL.Remote.Db;

package body GNATCOLL.IO.Remote is

   procedure Internal_Initialize
     (File : not null access Remote_File_Record'Class;
      Host : String;
      Path : FS_String);
   --  Initialize internal fields according to the file's host

   -------------------------
   -- Internal_Initialize --
   -------------------------

   procedure Internal_Initialize
     (File : not null access Remote_File_Record'Class;
      Host : String;
      Path : FS_String)
   is
      Server : constant Server_Access := Get_Server (Host);
      Last   : Natural := Path'Last;
   begin
      --  Regexps might return file strings with a trailing CR or LF. Let's
      --  remove those before creating the File record.
      while Path (Last) = ASCII.CR or Path (Last) = ASCII.LF loop
         Last := Last - 1;
      end loop;

      File.Server     := Server;
      if File.Tmp_Norm then
         File.Full       := new FS_String'
           (GNATCOLL.Path.Normalize
              (Server.Shell_FS,
               From_Unix (Server.Shell_FS, Path (Path'First .. Last))));
      else
         File.Full       := new FS_String'
           (From_Unix (Server.Shell_FS, Path (Path'First .. Last)));
      end if;

      File.Normalized_And_Resolved := null;
   end Internal_Initialize;

   ------------------------
   -- Ensure_Initialized --
   ------------------------

   procedure Ensure_Initialized
     (File : not null access Remote_File_Record'Class)
   is
   begin
      if File.Server /= null then
         return;

      elsif not Is_Configured (File.Tmp_Host.all) then
         raise Remote_Config_Error with
           "File needs server " & File.Tmp_Host.all &
           " which is not configured";
      end if;

      Internal_Initialize (File, File.Tmp_Host.all, File.Tmp_Path.all);
      Free (File.Tmp_Host);
      Free (File.Tmp_Path);
   end Ensure_Initialized;

   ------------
   -- Create --
   ------------

   function Create
     (Host      : String;
      Path      : FS_String;
      Normalize : Boolean) return File_Access
   is
      Ret  : Remote_File_Access;

   begin
      Ret := new Remote_File_Record'
        (Ref_Count  => 1,
         Tmp_Host   => null,
         Tmp_Path   => null,
         Tmp_Norm   => Normalize,
         Tmp_Name   => (others => ' '),
         Server     => null,
         Full       => null,
         Normalized => null,
         Normalized_And_Resolved => null,
         Kind       => Unknown);

      if not Is_Configured (Host) then
         --  Delayed initialization
         Ret.Tmp_Host := new String'(Host);
         Ret.Tmp_Path := new FS_String'(Path);
      else
         Internal_Initialize (Ret, Host, Path);
      end if;

      return File_Access (Ret);
   end Create;

   -----------------
   -- Current_Dir --
   -----------------

   function Current_Dir (Host : String) return File_Access is
      Server : Server_Access;
   begin
      if not Is_Configured (Host) then
         raise Remote_Config_Error with
           "Invalid FS for host " & Host;
      else
         Server := Get_Server (Host);
      end if;

      case Server.Shell_FS is
         when FS_Unix | FS_Unix_Case_Insensitive =>
            return Create
              (Host,
               GNATCOLL.IO.Remote.Unix.Current_Dir (Server),
               False);
         when FS_Windows =>
            return Create
              (Host,
               GNATCOLL.IO.Remote.Windows.Current_Dir (Server),
               False);
         when FS_Unknown =>
            raise Remote_Config_Error with
              "Invalid FS for host " & Host;
      end case;
   end Current_Dir;

   --------------
   -- Home_Dir --
   --------------

   function Home_Dir (Host : String) return File_Access is
      Server : Server_Access;
   begin
      if not Is_Configured (Host) then
         raise Remote_Config_Error with
           "Invalid FS for host " & Host;
      else
         Server := Get_Server (Host);
      end if;

      case Server.Shell_FS is
         when FS_Unix | FS_Unix_Case_Insensitive =>
            return Create
              (Host,
               GNATCOLL.IO.Remote.Unix.Home_Dir (Server),
               False);
         when FS_Windows =>
            return Create
              (Host,
               GNATCOLL.IO.Remote.Windows.Home_Dir (Server),
               False);
         when FS_Unknown =>
            raise Remote_Config_Error with
              "Invalid FS for host " & Host;
      end case;
   end Home_Dir;

   -----------------------
   -- Get_Tmp_Directory --
   -----------------------

   function Get_Tmp_Directory (Host : String) return File_Access is
      Server : Server_Access;
   begin
      if not Is_Configured (Host) then
         raise Remote_Config_Error with
           "Invalid FS for host " & Host;
      else
         Server := Get_Server (Host);
      end if;

      case Server.Shell_FS is
         when FS_Unix | FS_Unix_Case_Insensitive =>
            return Create
              (Host, GNATCOLL.IO.Remote.Unix.Tmp_Dir (Server), False);
         when FS_Windows =>
            return Create
              (Host, GNATCOLL.IO.Remote.Windows.Tmp_Dir (Server), False);
         when FS_Unknown =>
            raise Remote_Config_Error with
              "Invalid FS for host " & Host;
      end case;
   end Get_Tmp_Directory;

   --------------------
   -- Locate_On_Path --
   --------------------

   function Locate_On_Path (Host : String; Base : FS_String) return File_Access
   is
      Server : Server_Access;
   begin
      if not Is_Configured (Host) then
         raise Remote_Config_Error with
           "Invalid FS for host " & Host;
      else
         Server := Get_Server (Host);
      end if;

      if GNATCOLL.Path.Is_Absolute_Path (Server.Shell_FS, Base) then
         return Create (Host, Base, False);
      end if;

      case Server.Shell_FS is
         when FS_Unix | FS_Unix_Case_Insensitive =>
            declare
               Ret : constant FS_String :=
                       GNATCOLL.IO.Remote.Unix.Locate_On_Path (Server, Base);
            begin
               if Ret = "" then
                  return null;
               else
                  return Create (Host, Ret, False);
               end if;
            end;

         when FS_Windows =>
            declare
               Ret : constant FS_String :=
                       GNATCOLL.IO.Remote.Windows.Locate_On_Path
                         (Server, Base);
            begin
               if Ret = "" then
                  return null;
               else
                  return Create (Host, Ret, False);
               end if;
            end;

         when FS_Unknown =>
            raise Remote_Config_Error with
              "Invalid FS for host " & Host;
      end case;
   end Locate_On_Path;

   ------------------------
   -- Get_Logical_Drives --
   ------------------------

   function Get_Logical_Drives (Host : String) return File_Array is
      Server : Server_Access;
      List   : GNAT.Strings.String_List_Access;

   begin
      if not Is_Configured (Host) then
         raise Remote_Config_Error with
           "Invalid FS for host " & Host;
      else
         Server := Get_Server (Host);
      end if;

      case Server.Shell_FS is
         when FS_Unix | FS_Unix_Case_Insensitive =>
            List := GNATCOLL.IO.Remote.Unix.Get_Logical_Drives (Server);
         when FS_Windows =>
            List := GNATCOLL.IO.Remote.Windows.Get_Logical_Drives (Server);
         when FS_Unknown =>
            raise Remote_Config_Error with
              "Invalid FS for host " & Host;
      end case;

      if List = null then
         return (1 .. 0 => <>);
      end if;

      declare
         Ret : File_Array (1 .. List'Length);
      begin
         for J in Ret'Range loop
            Ret (J) :=
              Create (Host, FS_String (List (List'First + J - Ret'First).all),
                      False);
         end loop;

         GNAT.Strings.Free (List);
         return Ret;
      end;
   end Get_Logical_Drives;

   --------------
   -- Get_Host --
   --------------

   function Get_Host
     (File : not null access Remote_File_Record) return String
   is
   begin
      if File.Server = null then
         if not Is_Configured (File.Tmp_Host.all) then
            return File.Tmp_Host.all;
         else
            Internal_Initialize (File, File.Tmp_Host.all, File.Tmp_Path.all);
            Free (File.Tmp_Host);
            Free (File.Tmp_Path);

            return File.Server.Nickname;
         end if;
      else
         return File.Server.Nickname;
      end if;
   end Get_Host;

   ------------------------
   -- Dispatching_Create --
   ------------------------

   overriding function Dispatching_Create
     (Ref : not null access Remote_File_Record;
      Full_Path : FS_String) return File_Access
   is
   begin
      return Create (Ref.Get_Host, Full_Path, False);
   end Dispatching_Create;

   -------------
   -- To_UTF8 --
   -------------

   overriding function To_UTF8
     (Ref : not null access Remote_File_Record;
      Path : FS_String) return String
   is
      pragma Unreferenced (Ref);
   begin
      return Codec.To_UTF8 (Path);
   end To_UTF8;

   ---------------
   -- From_UTF8 --
   ---------------

   overriding function From_UTF8
     (Ref : not null access Remote_File_Record;
      Path : String) return FS_String
   is
      pragma Unreferenced (Ref);
   begin
      return Codec.From_UTF8 (Path);
   end From_UTF8;

   --------------
   -- Is_Local --
   --------------

   overriding function Is_Local (File : Remote_File_Record) return Boolean is
      pragma Unreferenced (File);
   begin
      return False;
   end Is_Local;

   ------------
   -- Get_FS --
   ------------

   overriding function Get_FS
     (File : not null access Remote_File_Record) return FS_Type
   is
   begin
      Ensure_Initialized (File);

      return File.Server.Shell_FS;
   end Get_FS;

   ----------------------
   -- Resolve_Symlinks --
   ----------------------

   overriding procedure Resolve_Symlinks
     (File : not null access Remote_File_Record)
   is
   begin
      Ensure_Initialized (File);

      --  ??? Should we do something more here (e.g. try to actually resolve ?)
      if File.Normalized_And_Resolved = null then
         if File.Normalized = null then
            File.Normalized := new FS_String'
              (GNATCOLL.Path.Normalize (Get_FS (File), File.Full.all));
         end if;
         File.Normalized_And_Resolved := File.Normalized;
      end if;
   end Resolve_Symlinks;

   ---------------------
   -- Is_Regular_File --
   ---------------------

   overriding function Is_Regular_File
     (File : not null access Remote_File_Record) return Boolean
   is
   begin
      Ensure_Initialized (File);

      case File.Server.Shell_FS is
         when FS_Unix | FS_Unix_Case_Insensitive =>
            return GNATCOLL.IO.Remote.Unix.Is_Regular_File
              (File.Server, File.Full.all);
         when FS_Windows =>
            return GNATCOLL.IO.Remote.Windows.Is_Regular_File
              (File.Server, File.Full.all);
         when FS_Unknown =>
            raise Remote_Config_Error with
              "Invalid FS for host " & File.Get_Host;
      end case;
   end Is_Regular_File;

   ----------
   -- Size --
   ----------

   overriding function Size
     (File : not null access Remote_File_Record) return Long_Integer
   is
   begin
      Ensure_Initialized (File);
      case File.Server.Shell_FS is
         when FS_Unix | FS_Unix_Case_Insensitive =>
            return GNATCOLL.IO.Remote.Unix.Size
              (File.Server, File.Full.all);
         when FS_Windows =>
            return GNATCOLL.IO.Remote.Windows.Size
              (File.Server, File.Full.all);
         when FS_Unknown =>
            raise Remote_Config_Error with
              "Invalid FS for host " & File.Get_Host;
      end case;
   end Size;

   ------------------
   -- Is_Directory --
   ------------------

   overriding function Is_Directory
     (File : not null access Remote_File_Record) return Boolean
   is
   begin
      Ensure_Initialized (File);

      case File.Server.Shell_FS is
         when FS_Unix | FS_Unix_Case_Insensitive =>
            return GNATCOLL.IO.Remote.Unix.Is_Directory
              (File.Server, File.Full.all);
         when FS_Windows =>
            return GNATCOLL.IO.Remote.Windows.Is_Directory
              (File.Server, File.Full.all);
         when FS_Unknown =>
            raise Remote_Config_Error with
              "Invalid FS for host " & File.Get_Host;
      end case;
   end Is_Directory;

   ----------------------
   -- Is_Symbolic_Link --
   ----------------------

   overriding function Is_Symbolic_Link
     (File : not null access Remote_File_Record) return Boolean
   is
   begin
      Ensure_Initialized (File);

      case File.Server.Shell_FS is
         when FS_Unix | FS_Unix_Case_Insensitive =>
            return GNATCOLL.IO.Remote.Unix.Is_Symbolic_Link
              (File.Server, File.Full.all);
         when FS_Windows =>
            return GNATCOLL.IO.Remote.Windows.Is_Symbolic_Link
              (File.Server, File.Full.all);
         when FS_Unknown =>
            raise Remote_Config_Error with
              "Invalid FS for host " & File.Get_Host;
      end case;
   end Is_Symbolic_Link;

   ---------------------
   -- File_Time_Stamp --
   ---------------------

   overriding function File_Time_Stamp
     (File : not null access Remote_File_Record) return Ada.Calendar.Time
   is
   begin
      Ensure_Initialized (File);

      case File.Server.Shell_FS is
         when FS_Unix | FS_Unix_Case_Insensitive =>
            return GNATCOLL.IO.Remote.Unix.File_Time_Stamp
              (File.Server, File.Full.all);
         when FS_Windows =>
            return GNATCOLL.IO.Remote.Windows.File_Time_Stamp
              (File.Server, File.Full.all);
         when FS_Unknown =>
            raise Remote_Config_Error with
              "Invalid FS for host " & File.Get_Host;
      end case;
   end File_Time_Stamp;

   -----------------
   -- Is_Readable --
   -----------------

   overriding function Is_Readable
     (File : not null access Remote_File_Record) return Boolean is
   begin
      Ensure_Initialized (File);

      case File.Server.Shell_FS is
         when FS_Unix | FS_Unix_Case_Insensitive =>
            return GNATCOLL.IO.Remote.Unix.Is_Readable
              (File.Server, File.Full.all);
         when FS_Windows =>
            return GNATCOLL.IO.Remote.Windows.Is_Readable
              (File.Server, File.Full.all);
         when FS_Unknown =>
            raise Remote_Config_Error with
              "Invalid FS for host " & File.Get_Host;
      end case;
   end Is_Readable;

   -----------------
   -- Is_Writable --
   -----------------

   overriding function Is_Writable
     (File : not null access Remote_File_Record) return Boolean is
   begin
      Ensure_Initialized (File);

      case File.Server.Shell_FS is
         when FS_Unix | FS_Unix_Case_Insensitive =>
            return GNATCOLL.IO.Remote.Unix.Is_Writable
              (File.Server, File.Full.all);
         when FS_Windows =>
            return GNATCOLL.IO.Remote.Windows.Is_Writable
              (File.Server, File.Full.all);
         when FS_Unknown =>
            raise Remote_Config_Error with
              "Invalid FS for host " & File.Get_Host;
      end case;
   end Is_Writable;

   ------------------
   -- Set_Writable --
   ------------------

   overriding procedure Set_Writable
     (File  : not null access Remote_File_Record;
      State : Boolean)
   is
   begin
      Ensure_Initialized (File);

      case File.Server.Shell_FS is
         when FS_Unix | FS_Unix_Case_Insensitive =>
            GNATCOLL.IO.Remote.Unix.Set_Writable
              (File.Server, File.Full.all,
               State);
         when FS_Windows =>
            GNATCOLL.IO.Remote.Windows.Set_Writable
              (File.Server, File.Full.all,
               State);
         when FS_Unknown =>
            raise Remote_Config_Error with
              "Invalid FS for host " & File.Get_Host;
      end case;
   end Set_Writable;

   ------------------
   -- Set_Readable --
   ------------------

   overriding procedure Set_Readable
     (File  : not null access Remote_File_Record;
      State : Boolean)
   is
   begin
      Ensure_Initialized (File);

      case File.Server.Shell_FS is
         when FS_Unix | FS_Unix_Case_Insensitive =>
            GNATCOLL.IO.Remote.Unix.Set_Readable
              (File.Server, File.Full.all,
               State);
         when FS_Windows =>
            GNATCOLL.IO.Remote.Windows.Set_Readable
              (File.Server, File.Full.all,
               State);
         when FS_Unknown =>
            raise Remote_Config_Error with
              "Invalid FS for host " & File.Get_Host;
      end case;
   end Set_Readable;

   ------------
   -- Rename --
   ------------

   overriding procedure Rename
     (From    : not null access Remote_File_Record;
      Dest    : not null access Remote_File_Record;
      Success : out Boolean)
   is
   begin
      Ensure_Initialized (From);
      Ensure_Initialized (Dest);

      if From.Get_Host /= Dest.Get_Host then
         raise Remote_Config_Error with
           "cannot rename a file to another host";
      end if;

      case From.Server.Shell_FS is
         when FS_Unix | FS_Unix_Case_Insensitive =>
            GNATCOLL.IO.Remote.Unix.Rename
              (From.Server, From.Full.all, Dest.Full.all, Success);
         when FS_Windows =>
            GNATCOLL.IO.Remote.Windows.Rename
              (From.Server, From.Full.all, Dest.Full.all, Success);
         when FS_Unknown =>
            raise Remote_Config_Error with
              "Invalid FS for host " & From.Get_Host;
      end case;
   end Rename;

   ----------
   -- Copy --
   ----------

   overriding procedure Copy
     (From    : not null access Remote_File_Record;
      Dest    : FS_String;
      Success : out Boolean)
   is
   begin
      Ensure_Initialized (From);

      case From.Server.Shell_FS is
         when FS_Unix | FS_Unix_Case_Insensitive =>
            GNATCOLL.IO.Remote.Unix.Copy
              (From.Server, From.Full.all, Dest, Success);
         when FS_Windows =>
            GNATCOLL.IO.Remote.Windows.Copy
              (From.Server, From.Full.all, Dest, Success);
         when FS_Unknown =>
            raise Remote_Config_Error with
              "Invalid FS for host " & From.Get_Host;
      end case;
   end Copy;

   ------------
   -- Delete --
   ------------

   overriding procedure Delete
     (File    : not null access Remote_File_Record;
      Success : out Boolean)
   is
   begin
      Ensure_Initialized (File);

      case File.Server.Shell_FS is
         when FS_Unix | FS_Unix_Case_Insensitive =>
            GNATCOLL.IO.Remote.Unix.Delete
              (File.Server, File.Full.all,
               Success);
         when FS_Windows =>
            GNATCOLL.IO.Remote.Windows.Delete
              (File.Server, File.Full.all,
               Success);
         when FS_Unknown =>
            raise Remote_Config_Error with
              "Invalid FS for host " & File.Get_Host;
      end case;
   end Delete;

   ---------------------
   -- Read_Whole_File --
   ---------------------

   overriding function Read_Whole_File
     (File : not null access Remote_File_Record)
      return GNAT.Strings.String_Access
   is
   begin
      Ensure_Initialized (File);

      case File.Server.Shell_FS is
         when FS_Unix | FS_Unix_Case_Insensitive =>
            return GNATCOLL.IO.Remote.Unix.Read_Whole_File
              (File.Server, File.Full.all);
         when FS_Windows =>
            return GNATCOLL.IO.Remote.Windows.Read_Whole_File
              (File.Server, File.Full.all);
         when FS_Unknown =>
            raise Remote_Config_Error with
              "Invalid FS for host " & File.Get_Host;
      end case;
   end Read_Whole_File;

   ---------------------
   -- Read_Whole_File --
   ---------------------

   overriding function Read_Whole_File
     (File : not null access Remote_File_Record)
      return GNATCOLL.Strings.XString
   is
   begin
      Ensure_Initialized (File);

      case File.Server.Shell_FS is
         when FS_Unix | FS_Unix_Case_Insensitive =>
            return GNATCOLL.IO.Remote.Unix.Read_Whole_File
              (File.Server, File.Full.all);
         when FS_Windows =>
            return GNATCOLL.IO.Remote.Windows.Read_Whole_File
              (File.Server, File.Full.all);
         when FS_Unknown =>
            raise Remote_Config_Error with
              "Invalid FS for host " & File.Get_Host;
      end case;
   end Read_Whole_File;

   ----------------
   -- Open_Write --
   ----------------

   overriding procedure Open_Write
     (File    : not null access Remote_File_Record;
      Append  : Boolean := False;
      FD      : out GNAT.OS_Lib.File_Descriptor;
      Error   : out Ada.Strings.Unbounded.Unbounded_String)
   is
      pragma Unreferenced (Error);
      --  Error diagnostics is not implemented for remote files.

      Tmp_Dir : File_Access :=
                  GNATCOLL.IO.Native.Get_Tmp_Directory;
      Cur_Dir : File_Access :=
                  GNATCOLL.IO.Native.Current_Dir;
      Tmp     : constant FS_String :=
                  GNATCOLL.Path.Ensure_Directory
                    (Tmp_Dir.Get_FS, Tmp_Dir.Full.all);
      Cur     : constant FS_String :=
                  GNATCOLL.Path.Ensure_Directory
                    (Cur_Dir.Get_FS, Cur_Dir.Full.all);
      Content : GNAT.Strings.String_Access;
      Written : Integer;
      pragma Unreferenced (Written);

   begin
      Ensure_Initialized (File);
      Unref (Tmp_Dir);
      Unref (Cur_Dir);

      GNAT.Directory_Operations.Change_Dir (String (Tmp));
      GNAT.OS_Lib.Create_Temp_File (FD, File.Tmp_Name);
      GNAT.Directory_Operations.Change_Dir (String (Cur));

      if Append then
         case File.Server.Shell_FS is
            when FS_Unix | FS_Unix_Case_Insensitive =>
               Content := GNATCOLL.IO.Remote.Unix.Read_Whole_File
                 (File.Server, File.Full.all);
            when FS_Windows =>
               Content := GNATCOLL.IO.Remote.Windows.Read_Whole_File
                 (File.Server, File.Full.all);
            when FS_Unknown =>
               raise Remote_Config_Error with
                 "Invalid FS for host " & File.Get_Host;
         end case;

         Written :=
           GNAT.OS_Lib.Write (FD, Content.all'Address, Content'Length);
         GNAT.Strings.Free (Content);
      end if;
   end Open_Write;

   -----------
   -- Close --
   -----------

   overriding procedure Close
     (File    : not null access Remote_File_Record;
      FD      : GNAT.OS_Lib.File_Descriptor;
      Success : out Boolean)
   is
      Content : GNAT.Strings.String_Access;
      Tmp_Dir : File_Access :=
                  GNATCOLL.IO.Native.Get_Tmp_Directory;
      Tmp     : constant FS_String :=
                  GNATCOLL.Path.Ensure_Directory
                    (Tmp_Dir.Get_FS, Tmp_Dir.Full.all);
      Dead    : Boolean;
      pragma Unreferenced (Dead);

   begin
      Unref (Tmp_Dir);
      Ensure_Initialized (File);

      GNAT.OS_Lib.Close (FD);

      Content := GNATCOLL.Mmap.Read_Whole_File
        (String (Tmp) & File.Tmp_Name, Empty_If_Not_Found => True);

      case File.Server.Shell_FS is
         when FS_Unix | FS_Unix_Case_Insensitive =>
            Success := GNATCOLL.IO.Remote.Unix.Write_File
              (File.Server, File.Full.all, Content.all);
         when FS_Windows =>
            Success := GNATCOLL.IO.Remote.Windows.Write_File
              (File.Server, File.Full.all, Content.all);
         when FS_Unknown =>
            raise Remote_Config_Error with
              "Invalid FS for host " & File.Get_Host;
      end case;

      GNAT.OS_Lib.Delete_File (String (Tmp) & File.Tmp_Name, Dead);
   end Close;

   ----------------
   -- Change_Dir --
   ----------------

   overriding function Change_Dir
     (Dir : not null access Remote_File_Record) return Boolean
   is
   begin
      Ensure_Initialized (Dir);

      case Dir.Server.Shell_FS is
         when FS_Unix | FS_Unix_Case_Insensitive =>
            return GNATCOLL.IO.Remote.Unix.Change_Dir
              (Dir.Server, Dir.Full.all);
         when FS_Windows =>
            return GNATCOLL.IO.Remote.Windows.Change_Dir
              (Dir.Server, Dir.Full.all);
         when FS_Unknown =>
            raise Remote_Config_Error with
              "Invalid FS for host " & Dir.Get_Host;
      end case;
   end Change_Dir;

   --------------
   -- Read_Dir --
   --------------

   overriding function Read_Dir
     (Dir            : not null access Remote_File_Record;
      Dirs_Only      : Boolean := False;
      Files_Only     : Boolean := False) return GNAT.Strings.String_List
   is
   begin
      Ensure_Initialized (Dir);

      case Dir.Server.Shell_FS is
         when FS_Unix | FS_Unix_Case_Insensitive =>
            return GNATCOLL.IO.Remote.Unix.Read_Dir
              (Dir.Server, Dir.Full.all,
               Dirs_Only, Files_Only);
         when FS_Windows =>
            return GNATCOLL.IO.Remote.Windows.Read_Dir
              (Dir.Server, Dir.Full.all,
               Dirs_Only, Files_Only);
         when FS_Unknown =>
            raise Remote_Config_Error with
              "Invalid FS for host " & Dir.Get_Host;
      end case;
   end Read_Dir;

   --------------
   -- Make_Dir --
   --------------

   overriding function Make_Dir
     (Dir       : not null access Remote_File_Record;
      Recursive : Boolean) return Boolean
   is
   begin
      Ensure_Initialized (Dir);

      case Dir.Server.Shell_FS is
         when FS_Unix | FS_Unix_Case_Insensitive =>
            return GNATCOLL.IO.Remote.Unix.Make_Dir
              (Dir.Server, Dir.Full.all, Recursive);
         when FS_Windows =>
            return GNATCOLL.IO.Remote.Windows.Make_Dir
              (Dir.Server, Dir.Full.all, Recursive);
         when FS_Unknown =>
            raise Remote_Config_Error with
              "Invalid FS for host " & Dir.Get_Host;
      end case;
   end Make_Dir;

   ----------------
   -- Remove_Dir --
   ----------------

   overriding procedure Remove_Dir
     (Dir       : not null access Remote_File_Record;
      Recursive : Boolean;
      Success   : out Boolean)
   is
   begin
      Ensure_Initialized (Dir);

      case Dir.Server.Shell_FS is
         when FS_Unix | FS_Unix_Case_Insensitive =>
            GNATCOLL.IO.Remote.Unix.Delete_Dir
              (Dir.Server, Dir.Full.all, Recursive, Success);
         when FS_Windows =>
            GNATCOLL.IO.Remote.Windows.Delete_Dir
              (Dir.Server, Dir.Full.all, Recursive, Success);
         when FS_Unknown =>
            raise Remote_Config_Error with
              "Invalid FS for host " & Dir.Get_Host;
      end case;
   end Remove_Dir;

   --------------
   -- Copy_Dir --
   --------------

   overriding procedure Copy_Dir
     (From    : not null access Remote_File_Record;
      Dest    : FS_String;
      Success : out Boolean)
   is
   begin
      Ensure_Initialized (From);

      case From.Server.Shell_FS is
         when FS_Unix | FS_Unix_Case_Insensitive =>
            GNATCOLL.IO.Remote.Unix.Copy_Dir
              (From.Server, From.Full.all, Dest, Success);
         when FS_Windows =>
            GNATCOLL.IO.Remote.Windows.Copy_Dir
              (From.Server, From.Full.all, Dest, Success);
         when FS_Unknown =>
            raise Remote_Config_Error with
              "Invalid FS for host " & From.Get_Host;
      end case;
   end Copy_Dir;

   ---------------------------
   -- Copy_File_Permissions --
   ---------------------------

   overriding procedure Copy_File_Permissions
     (From, To : not null access Remote_File_Record;
      Success  : out Boolean)
   is
      pragma Unreferenced (From, To);
   begin
      Success := False;
   end Copy_File_Permissions;

   -----------
   -- Codec --
   -----------

   package body Codec is

      -------------
      -- To_UTF8 --
      -------------

      function To_UTF8 (Path : FS_String) return String is
      begin
         --  ??? What if the Transport uses a specific charset ?
         return String (Path);
      end To_UTF8;

      ---------------
      -- From_UTF8 --
      ---------------

      function From_UTF8 (Path : String) return FS_String is
      begin
         --  ??? What if the Transport uses a specific charset ?
         return FS_String (Path);
      end From_UTF8;

   end Codec;

end GNATCOLL.IO.Remote;
