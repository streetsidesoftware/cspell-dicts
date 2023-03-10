page 50100 MyPage
{
    SourceTable = Customer;
    PageType = Card;

    layout
    {
        area(Content)
        {
            group(General)
            {
                field(Name; Name)
                {
                    ApplicationArea = All;
                }
            }
            group(Advanced)
            {
                Visible = ShowBalance;

                field(Balance; Balance)
                {
                    ApplicationArea = All;
                }
            }
        }
    }

    protected var
        [InDataSet]
        ShowBalance: Boolean;
}

pageextension 50101 MyPageExt extends MyPage
{
    layout
    {
        addlast(Content)
        {
            group(MoreBalance)
            {
                Visible = ShowBalance; // ShowBalance from MyPage

                field("Balance (LCY)"; "Balance (LCY)")
                {
                    ApplicationArea = All;
                }
            }
        }

    }

    actions
    {
        addlast(Navigation)
        {
            action(ToggleBalance)
            {
                ApplicationArea = All;
                trigger OnAction()
                begin
                    ShowBalance := not ShowBalance; // Toggle ShowBalance from MyPage.
                end;
            }
        }
    }
}
