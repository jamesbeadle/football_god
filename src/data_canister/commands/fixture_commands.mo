import FootballTypes "mo:waterway-mops/FootballTypes";
module FixtureCommands {

  public type SubmitFixtureData = {
    leagueId: FootballTypes.LeagueId;
    seasonId: FootballTypes.SeasonId;
    fixtureId : FootballTypes.FixtureId;
    gameweek: FootballTypes.GameweekNumber;
    playerEventData : [FootballTypes.PlayerEventData];
  };

  public type AddInitialFixtures = {
    leagueId: FootballTypes.LeagueId;
    seasonId: FootballTypes.SeasonId;
    seasonFixtures : [InitialFixture];
  };

  public type InitialFixture = {

  };

  public type MoveFixture = {
    leagueId: FootballTypes.LeagueId;
    seasonId: FootballTypes.SeasonId;
    fixtureId : FootballTypes.FixtureId;
    updatedFixtureGameweek : FootballTypes.GameweekNumber;
    updatedFixtureDate : Int;
  };

  public type PostponeFixture = {
    leagueId: FootballTypes.LeagueId;
    seasonId: FootballTypes.SeasonId;
    fixtureId : FootballTypes.FixtureId;
  };

  public type RescheduleFixture = {
    leagueId: FootballTypes.LeagueId;
    seasonId: FootballTypes.SeasonId;
    fixtureId : FootballTypes.FixtureId;
    updatedFixtureGameweek : FootballTypes.GameweekNumber;
    updatedFixtureDate : Int;
  };
}