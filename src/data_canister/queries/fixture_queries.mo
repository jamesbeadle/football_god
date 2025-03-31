import FootballTypes "mo:waterway-mops/FootballTypes";
module FixtureQueries {
    public type GetFixtures = {
        leagueId: FootballTypes.LeagueId;
        seasonId: FootballTypes.SeasonId;
    };

    public type Fixtures = {
        fixtures: [Fixture];
    };

    public type GetBettableFixtures = {
        leagueId: FootballTypes.LeagueId;
        seasonId: FootballTypes.SeasonId;
    };

    public type BettableFixtures = {
        fixtures: [Fixture];
    };

    public type GetPostponedFixtures = {
        leagueId: FootballTypes.LeagueId;
    };

    public type PostponedFixtures = {
        fixtures: [Fixture];
    };

    public type Fixture = {
        id : FootballTypes.FixtureId;
        seasonId : FootballTypes.SeasonId;
        gameweek : FootballTypes.GameweekNumber;
        kickOff : Int;
        homeClubId : FootballTypes.ClubId;
        awayClubId : FootballTypes.ClubId;
        homeGoals : Nat8;
        awayGoals : Nat8;
        status : FootballTypes.FixtureStatusType;
        highestScoringPlayerId : FootballTypes.PlayerId;
        events : [FootballTypes.PlayerEventData];
    };
}