module Types {
    
    public type Error = {
        #NotFound;
        #AlreadyExists;
        #NotAuthorized;
    };

    public type Season = {
        id : Nat16;
        name : Text;
        year : Nat16;
        active : Bool;
    };

    public type Team = {
        id: Nat16;
        name: Text;
    };

    public type Gameweek = {
        id: Nat32;
        number: Nat8;
        status: Nat8; // 0 = Unopened, 1 = Open, 2 = Closed, 3 = Finalised
    };

    public type Fixture = {
        SeasonId: Nat16;
        GameweekId: Nat32;
        HomeTeamId: Nat16;
        AwayTeamId: Nat16;
        HomeGoals: Nat8;
        AwayGoals: Nat8;
        Status: Nat8; // 0 = Unplayed, 1 = Active, 2 = Finished
    };

    public type Prediction = {
        FixtureId: Nat16;
        HomeGoals: Nat8;
        AwayGoals: Nat8;
    };

}
