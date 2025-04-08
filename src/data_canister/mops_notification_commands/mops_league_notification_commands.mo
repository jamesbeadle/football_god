import FootballIds "mo:waterway-mops/football/FootballIds";
import FootballDefinitions "mo:waterway-mops/football/FootballDefinitions";
module MopsPlayerNotificationCommands = {

    public type CreateLeagueNotification = {
        leagueId: FootballIds.LeagueId;
    };

    public type UpdateLeagueNotification = {
        leagueId: FootballIds.LeagueId;
    };

    public type AddInitialFixtureNotification = {
        leagueId: FootballIds.LeagueId;
    };

    public type BeginSeasonNotification = {
        leagueId: FootballIds.LeagueId;
        seasonId: FootballIds.SeasonId;
    };

    public type BeginGameweekNotification = {
        leagueId: FootballIds.LeagueId;
        seasonId: FootballIds.SeasonId;
        gameweek: FootballDefinitions.GameweekNumber;
    };

    public type CompleteGameweekNotification = {
        leagueId: FootballIds.LeagueId;
        seasonId: FootballIds.SeasonId;
        gameweek: FootballDefinitions.GameweekNumber;
    };

    public type CompleteFixtureNotification = {
        leagueId: FootballIds.LeagueId;
        seasonId: FootballIds.SeasonId;
        fixtureId: FootballIds.FixtureId;
    };

    public type FinaliseFixtureNotification = {
        leagueId: FootballIds.LeagueId;
        seasonId: FootballIds.SeasonId;
        fixtureId: FootballIds.FixtureId;
    };
    
    public type CompleteSeasonNotification = {
        leagueId: FootballIds.LeagueId;
        seasonId: FootballIds.SeasonId;
    };
};