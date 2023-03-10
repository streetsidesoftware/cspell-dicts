var
    CustomerExists: Boolean;
    MyBoolean: Boolean;
begin
    CustomerExists := true;
    MyBoolean := NOT CustomerExists;
    // Will result in MyBoolean: false
end;
