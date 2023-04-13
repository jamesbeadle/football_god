import List "mo:base/List";

module Types {
   
    public type Error = {
        #NotFound;
        #AlreadyExists;
        #NotAuthorized;
        #NotAllowed;
        #DecodeError;
    };

    public type Season = {
        id : Nat16;
        name : Text;
        year : Nat16;
        gameweeks: List.List<Types.Gameweek>;
    };

    public type Team = {
        id: Nat16;
        name: Text;
    };

    public type Gameweek = {
        number: Nat8;
        status: Nat8; // 0 = Unopened, 1 = Open, 2 = Closed, 3 = Finalised
        fixtures: List.List<Types.Fixture>;
        fixtureCount : Nat8;
    };

    public type Fixture = {
        id: Nat32;
        homeTeamId: Nat16;
        awayTeamId: Nat16;
        homeGoals: Nat8;
        awayGoals: Nat8;
        status: Nat8; // 0 = Unplayed, 1 = Active, 2 = Finished
    };

    public type Profile = {
        principalName: Text;
        displayName: Text;
        wallet: Text;
        depositAddress: Blob;
        balance: Nat64;
    };

    public type UserGameweek = {
        seasonId: Nat16;
        gameweekNumber: Nat8;
        predictions: List.List<Types.Prediction>;
        enteredSweepstake: Bool;
        correctScores: Nat8;
        predictionCount: Nat8;
        winnings: Nat64;
    };

    public type GameweekSummary = {
        principalName: Text;
        displayName: Text;
    };

    public type UserBalances = {
        entries: [Profile];
        totalEntries: Nat32;
    };

    public type Leaderboard = {
        entries: [LeaderboardEntry];
        totalEntries: Nat32;
    };

    public type Prediction = {
        fixtureId: Nat32;
        homeGoals: Nat8;
        awayGoals: Nat8;
    };

    public type CorrectPredictions = {
        entries: [GameweekSummary];
        totalEntries: Nat32;
    };

    public type LeaderboardEntry = {
        positionText: Text;
        principalName: Text;
        displayName: Text;
        correctScores: Nat8;
        predictionCount: Nat8;
        enteredSweepstake: Bool;
    };

    public type PayoutData = {
        totalPot: Nat64;
        winners: Nat;
    };

    public type PrincipalName = Text;

}
