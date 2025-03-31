import FootballIds "mo:waterway-mops/football/FootballIds";
import FootballEnums "mo:waterway-mops/football/FootballEnums";

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
}