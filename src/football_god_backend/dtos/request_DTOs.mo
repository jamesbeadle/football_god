
import FootballTypes "../types/football_types";
import Base "../types/base_types";

module GovernanceDTOs {

  public type UpdateSystemStateDTO = {
    calculationGameweek : FootballTypes.GameweekNumber;
    calculationMonth : Base.CalendarMonth;
    calculationSeasonId : FootballTypes.SeasonId;
    pickTeamGameweek : FootballTypes.GameweekNumber;
    pickTeamSeasonId : FootballTypes.SeasonId;
    pickTeamMonth : Base.CalendarMonth;
    transferWindowActive : Bool;
    onHold : Bool;
    seasonActive: Bool;
    version: Text;
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
