module Enums {
    public type NotificationType = {
        #NewClub;
        #UpdateClub;
        #PromoteClub;
        #RelegateClub;
        #AddInitialFixture;
        #BeginSeason;
        #BeginGameweek;
        #CompleteGameweek;
        #FinaliseFixture;
        #CompleteSeason;
        #RevaluePlayerUp;
        #RevaluePlayerDown;
        #LoanPlayer;
        #RecallPlayer;
        #ExpireLoan;
        #TransferPlayer;
        #SetFreeAgent;
        #CreatePlayer;
        #UpdatePlayer;
        #InjuryUpdated;
        #RetirePlayer;
        #UnretirePlayer;
        #ChangePlayerPosition;
    }
}