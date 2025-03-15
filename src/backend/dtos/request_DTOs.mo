
import FootballTypes "mo:waterway-mops/FootballTypes";
import Base "mo:waterway-mops/BaseTypes";
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

  public type WithdrawDTO = {
    principalId: Base.PrincipalId;
    amount: Nat64;
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
