------------------------------------------------------------------------------
--                             G N A T C O L L                              --
--                                                                          --
--                     Copyright (C) 2009-2019, AdaCore                     --
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

-- cspell:words GNATCOLL

--  This package provides a type useful to manipulate command lines

with GNAT.OS_Lib;
with GNAT.Strings;
with Ada.Containers.Vectors;
with Ada.Strings.Unbounded;   use Ada.Strings.Unbounded;

package GNATCOLL.Arg_Lists is

   type Command_Line_Mode is (Raw_String, Separate_Args);
   --  There are two ways to treat a command line in GNATCOLL.
   --    Raw_String: these command lines should never be parsed for arguments
   --                and processing should be minimal.
   --    Separate_Args: these command lines need argument handling.

   type Argument_Mode is (Expandable, One_Arg);
   --  This type controls the behavior of arguments with respect to expansion.
   --    Expandable means that this argument can be expanded into multiple
   --     arguments.
   --    One_Arg means that this argument will only remain one argument,
   --     even if it gets expanded to separate space-separated strings.

   type Arg_List is private;
   --  A command line.
   --  This contains one command (an executable, typically) and a list of
   --  arguments.

   Empty_Command_Line : constant Arg_List;

   function Get_Command (C : Arg_List) return String;
   --  Return the command contained in C

   function Create (Command : String) return Arg_List;
   --  Create a command line from command.
   --  This creates a command line which has Command as a command and
   --  no arguments.

   function Argument_List_To_String
     (List           : GNAT.Strings.String_List;
      Protect_Quotes : Boolean := True) return String;
   --  Concatenate all the elements in List into a single string.
   --    Argument_String_To_List (Argument_List_To_String (X)) = X
   --  The returned string ends with a space.
   --  If Protect_Quotes is True, then all quotes (single and double) are
   --  preceded by a backslash.

   function Parse_String
     (Text : String;
      Mode : Command_Line_Mode) return Arg_List;
   --  Parse Text and return a Arg_List, assuming that Text contains both
   --  the command and the arguments

   function Parse_String (Command : String; Text : String) return Arg_List;
   --  Return a command line, assuming Command contains the command and
   --  Text contains the arguments

   procedure Append_Argument
     (C        : in out Arg_List;
      Argument : String;
      Mode     : Argument_Mode);
   --  Append Argument to the list of arguments in C

   function Args_Length (C : Arg_List) return Integer;
   --  Return the length of the arguments. The command is not included in this
   --  count.
   --  Return 0 if there is only a command and no arguments.
   --  Return -1 if the command is empty.

   function Nth_Arg (C : Arg_List; N : Natural) return String;
   --  Return the Nth argument. Nth_Arg (0) returns the command

   function Nth_Arg (C : Arg_List; N : Natural) return Unbounded_String;
   --  Return the Nth argument. Nth_Arg (0) returns the command

   procedure Set_Nth_Arg (C : in out Arg_List; N : Natural; Arg : String);
   --  Set the Nth arg.
   --  If there are not enough args, create them.

   ------------------
   -- Substitution --
   ------------------

   type Substitution_Function is access
     function (Param : String; Mode : Command_Line_Mode) return Arg_List;
   --  This type is preserved for backwards compatibility: it used to be the
   --  type of the Callback formal below.

   procedure Substitute
     (CL       : in out Arg_List;
      Char     : Character;
      Callback : access function
                   (Param : String; Mode : Command_Line_Mode) return Arg_List);
   --  Substitute all parameters that start with Char using the mechanisms
   --  specified in Callback.

   function To_List
     (C               : Arg_List;
      Include_Command : Boolean) return GNAT.OS_Lib.Argument_List;
   --  Return as an Argument_List:
   --     - the whole command line if Include_Command is True
   --     - only the arguments if Include_Command is False
   --  Caller must free the result.

   ---------------------------
   -- Conversions to string --
   ---------------------------

   function To_Display_String
     (C               : Arg_List;
      Include_Command : Boolean := True;
      Max_Arg_Length  : Positive := Positive'Last) return String;
   --  Return a string that represents C, for display purposes.
   --  For instance
   --       cmd /c make LIBRARY_TYPE=static
   --  If Include_Command is False, display only the arguments.
   --  Max_Arg_Length is the maximum length returned for each argument in C.

   function To_Debug_String (C : Arg_List) return String;
   --  Return a string that represents C, for display purposes.
   --  For instance:
   --      command: "cmd"
   --          arg: "/c"
   --          arg: "make LIBRARY_TYPE=static"

   function To_Script_String (C : Arg_List) return String;
   --  Return a string that represents C, ready to be sent to a script
   --  For instance:
   --      cmd /c make\ LIBRARY_TYPE=static

private

   type Argument_Type is record
      Mode : Argument_Mode;
      Text : Unbounded_String;
   end record;

   package Arg_List_Vector is new Ada.Containers.Vectors
     (Natural, Argument_Type);

   type Arg_List is record
      Mode : Command_Line_Mode := Separate_Args;
      V    : Arg_List_Vector.Vector;
      --  The element number 0 is the command, and the following elements are
      --  arguments.
   end record;

   Empty_Command_Line : constant Arg_List :=
                          (Mode => Separate_Args,
                           V    => Arg_List_Vector.Empty_Vector);

end GNATCOLL.Arg_Lists;
