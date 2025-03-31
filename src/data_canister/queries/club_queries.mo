import FootballTypes "mo:waterway-mops/FootballTypes";
module ClubQueries {
    public type GetClubs = {
        leagueId: FootballTypes.LeagueId;
    };

    public type Clubs = {
        clubs: [Club]
    };

    public type Club = {
        id : FootballTypes.ClubId;
        name : Text;
        friendlyName : Text;
        primaryColourHex : Text;
        secondaryColourHex : Text;
        thirdColourHex : Text;
        abbreviatedName : Text;
        shirtType : FootballTypes.ShirtType;
    };
}