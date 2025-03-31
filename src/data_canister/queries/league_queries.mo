import FootballIds "mo:waterway-mops/football/FootballIds";


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
        leagueId: FootballIds.LeagueId;
    };

    public type LeagueStatus = {

    };

    public type GetLeagueTable = {
        leagueId: FootballIds.LeagueId;
        seasonId: FootballIds.SeasonId;
    };

    public type LeagueTable = {

    };


}