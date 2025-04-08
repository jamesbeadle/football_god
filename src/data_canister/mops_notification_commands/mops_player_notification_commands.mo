import FootballIds "mo:waterway-mops/football/FootballIds";
module MopsPlayerNotificationCommands = {

  public type PlayerChangeNotification = {
    leagueId: FootballIds.LeagueId;
    playerId: FootballIds.PlayerId;
  };

};