
import FootballTypes "../types/football_types";
import Base "../types/base_types";
import BettingTypes "../types/betting_types";

module RequestDTOs {

  public type UpdateAppStatusDTO = {
    onHold : Bool;
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

  public type PaginationFiltersDTO = {
    limit : Nat;
    offset : Nat;
  };


  public type SubmitBetslipDTO = {
    principalId: Base.PrincipalId;
    leagueId: FootballTypes.LeagueId;
    seasonId: FootballTypes.SeasonId;
    totalStake: Nat64;
    expectedReturn: Nat64;
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

  public type RequestFixturesDTO = {
    leagueId: FootballTypes.LeagueId;
    seasonId: FootballTypes.SeasonId;
  };

  public type GetSnapshotPlayers = {
    seasonId: FootballTypes.SeasonId;
    leagueId: FootballTypes.LeagueId;
    gameweek: FootballTypes.GameweekNumber;
  };

  public type UpdateRewardPoolsDTO = {
    seasonId : FootballTypes.SeasonId;
    seasonLeaderboardPool : Nat64;
    monthlyLeaderboardPool : Nat64;
    weeklyLeaderboardPool : Nat64;
    mostValuableTeamPool : Nat64;
    highestScoringMatchPlayerPool : Nat64;
    allTimeWeeklyHighScorePool : Nat64;
    allTimeMonthlyHighScorePool : Nat64;
    allTimeSeasonHighScorePool : Nat64;
  };

  public type GetPlayerDetailsDTO = {
    playerId : FootballTypes.ClubId;
    seasonId : FootballTypes.SeasonId;
  };

  public type GameweekFiltersDTO = {
    seasonId : FootballTypes.SeasonId;
    gameweek : FootballTypes.GameweekNumber;
  };
};
