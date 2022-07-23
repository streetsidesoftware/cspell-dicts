with Ada.Text_IO;

-- Related to [issue-1276](https://github.com/streetsidesoftware/cspell-dicts/issues/1276)

procedure Test is
begin
  -- This didn't spell check properly.
  Ada.Text_IO.Put_Line(Integer'Image(5));
end Test;
