
import FootballTypes "../types/football_types";
import Base "../types/base_types";
import BettingTypes "../types/betting_types";

module RequestDTOs {

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

  public type ClubFilterDTO = {
    leagueId: FootballTypes.LeagueId;
    clubId: FootballTypes.ClubId;
  };

  public type GetFixturesDTO = {
    leagueId: FootballTypes.LeagueId;
    seasonId: FootballTypes.SeasonId;
  };

  public type UpdateFixtureDTO = {
    seasonId : FootballTypes.SeasonId;
    fixtureId : FootballTypes.FixtureId;
    gameweek : FootballTypes.GameweekNumber;
    kickOff : Int;
    status : FootballTypes.FixtureStatusType;
  };

  public type PaginationFiltersDTO = {
    limit : Nat;
    offset : Nat;
  };


  public type SubmitBetslipDTO = {
    principalId: Base.PrincipalId;
    leagueId: FootballTypes.LeagueId;
    seasonId: FootballTypes.SeasonId;
    totalStake: Nat64;
  };

  public type GetBetsDTO = {
    principalId: Base.PrincipalId;
  };

  public type UpdateUsernameDTO = {
    principalId: Base.PrincipalId;
    username: Text;
  };

  public type UpdateProfilePictureDTO = {
    principalId: Base.PrincipalId;
    profilePicture: Blob;
    profilePictureExtension: Text;
  };

  public type UpdateWithdrawalAddressDTO = {
    principalId: Base.PrincipalId;
    withdrawalAddress: Text;
  };

  public type PauseAccountDTO = {
    principalId: Base.PrincipalId;
    pauseDays: Nat;
  };

  public type SetMaxBetLimit = {
    principalId: Base.PrincipalId;
    maxBetLimit: Nat64;
  };

  public type SetMonthlyBetLimitDTO = {
    principalId: Base.PrincipalId;
    monthlyBetLimit: Nat64;
  };

  public type WithdrawDTO = {
    principalId: Base.PrincipalId;
    amount: Nat64;
  };

  public type GetBetslipFixturesDTO = {
    selections: [BettingTypes.Selection];
  };
};
