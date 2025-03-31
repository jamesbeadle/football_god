import FootballTypes "mo:waterway-mops/FootballTypes";
module LeagueQueries {

    public type GetLeagues = {

    };

    public type Leagues = {
        leagues: [League];
    };

    public type League = {

    };

    public type GetBettableLeagues = {

    };

    public type BettableLeagues = {
        leagues: [League];
    };

    public type GetLeagueStatus = {
        leagueId: FootballTypes.LeagueId;
    };

    public type LeagueStatus = {

    };

    public type GetLeagueTable = {
        leagueId: FootballTypes.LeagueId;
        seasonId: FootballTypes.SeasonId;
    };

    public type LeagueTable = {

    };


}