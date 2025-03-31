import FootballIds "mo:waterway-mops/football/FootballIds";
import FootballDefinitions "mo:waterway-mops/football/FootballDefinitions";
import FootballEnums "mo:waterway-mops/football/FootballEnums";

module FixtureQueries {
    public type GetFixtures = {
        leagueId: FootballIds.LeagueId;
        seasonId: FootballIds.SeasonId;
    };

    public type Fixtures = {
        fixtures: [Fixture];
    };

    public type GetBettableFixtures = {
        leagueId: FootballIds.LeagueId;
        seasonId: FootballIds.SeasonId;
    };

    public type BettableFixtures = {
        fixtures: [Fixture];
    };

    public type GetPostponedFixtures = {
        leagueId: FootballIds.LeagueId;
    };

    public type PostponedFixtures = {
        fixtures: [Fixture];
    };

    public type Fixture = {
        id : FootballIds.FixtureId;
        seasonId : FootballIds.SeasonId;
        gameweek : FootballDefinitions.GameweekNumber;
        kickOff : Int;
        homeClubId : FootballIds.ClubId;
        awayClubId : FootballIds.ClubId;
        homeGoals : Nat8;
        awayGoals : Nat8;
        status : FootballEnums.FixtureStatusType;
        highestScoringPlayerId : FootballIds.PlayerId;
        events : [PlayerEventData];
    };

    public type PlayerEventData = {
        fixtureId : FootballIds.FixtureId;
        playerId : Nat16;
        eventType : FootballEnums.PlayerEventType;
        eventStartMinute : Nat8;
        eventEndMinute : Nat8;
        clubId : FootballIds.ClubId;
    };
}