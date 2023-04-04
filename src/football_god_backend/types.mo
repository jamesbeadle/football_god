import List "mo:base/List";
import Map "mo:base/HashMap";
import Principal "mo:base/Principal";
import Hash "mo:base/Hash";
import Blob "mo:base/Blob";

module Types {
   
    public type Error = {
        #NotFound;
        #AlreadyExists;
        #NotAuthorized;
        #NotAllowed;
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
        displayName: Text;
        wallet: Text;
        depositAddress: Blob;
    };

    public type UserGameweek = {
        seasonId: Nat16;
        gameweekNumber: Nat8;
        predictions: List.List<Types.Prediction>;
        enteredSweepstake: Bool;
        correctScores: Nat8;
        predictionCount: Nat8;
        winnings: Nat;
    };

    public type Prediction = {
        fixtureId: Nat16;
        homeGoals: Nat8;
        awayGoals: Nat8;
    };

    public type LeaderboardEntry = {
        principalName: Text;
        correctScores: Nat8;
        predictionCount: Nat8;
    };

    public type PayoutData = {
        totalPot: Nat;
        winners: Nat;
    };

}
