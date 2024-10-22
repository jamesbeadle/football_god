
import FootballTypes "../types/football_types";
import Base "../types/base_types";

module GovernanceDTOs {

  public type UpdateSystemStateDTO = {
    leagueId: FootballTypes.LeagueId;
    calculationSeasonId: FootballTypes.SeasonId;
    calculationMonth: Base.CalendarMonth;
    calculationGameweek: FootballTypes.GameweekNumber;
    pickTeamSeasonId: FootballTypes.SeasonId;
    pickTeamMonth: Base.CalendarMonth;
    pickTeamGameweek: FootballTypes.GameweekNumber;
    onHold: Bool;
  };

  public type SnapshotManagersDTO = {
    leagueId: FootballTypes.LeagueId;
    seasonId: FootballTypes.SeasonId;
    gameweek: FootballTypes.GameweekNumber;
  };

  public type CalculateGameweekScoresDTO = {
    leagueId: FootballTypes.LeagueId;
    seasonId: FootballTypes.SeasonId;
    gameweek: FootballTypes.GameweekNumber;
  };

  public type CalculateLeaderboardsDTO = {
    leagueId: FootballTypes.LeagueId;
    seasonId: FootballTypes.SeasonId;
    gameweek: FootballTypes.GameweekNumber;
  };
};
