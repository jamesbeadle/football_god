import FootballIds "mo:waterway-mops/football/FootballIds";
import FootballEnums "mo:waterway-mops/football/FootballEnums";
import Enums "mo:waterway-mops/Enums";

module ClubQueries {
    public type GetClubs = {
        leagueId: FootballIds.LeagueId;
    };

    public type Clubs = {
        leagueId: FootballIds.LeagueId;
        clubs: [Club];
    };

    public type Club = {
        id : FootballIds.ClubId;
        name : Text;
        friendlyName : Text;
        primaryColourHex : Text;
        secondaryColourHex : Text;
        thirdColourHex : Text;
        abbreviatedName : Text;
        shirtType : FootballEnums.ShirtType;
    };

    public type GetClubValueLeaderboard = {};

    public type ClubValueLeaderboard = {
        clubs: [ClubSummary]
    };

    public type ClubSummary = {
        clubId: FootballIds.ClubId;
        leagueId: FootballIds.LeagueId;
        clubName: Text;
        position: Nat;
        positionText: Text;
        totalValue: Nat16;
        priorValue: Nat16;
        primaryColour: Text;
        secondaryColour: Text;
        thirdColour: Text;
        shirtType: FootballEnums.ShirtType;
        gender: Enums.Gender;
        totalPlayers: Nat8;
        totalGoalkeepers: Nat8;
        totalDefenders: Nat8;
        totalMidfielders: Nat8;
        totalForwards: Nat8;
        totalGKValue: Nat16;
        totalDFValue: Nat16;
        totalMFValue: Nat16;
        totalFWValue: Nat16;
        mvp: MostValuablePlayer;
    };

    public type MostValuablePlayer = {
        id: FootballIds.PlayerId;
        firstName: Text;
        lastName: Text;
        value: Nat16;
    };
}