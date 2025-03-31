
import Ids "mo:waterway-mops/Ids";
import FootballIds "mo:waterway-mops/football/FootballIds";
import FootballEnums "mo:waterway-mops/football/FootballEnums";

module PlayerCommands {

  public type RevaluePlayerUp = {
    leagueId: FootballIds.LeagueId;
    playerId : FootballIds.PlayerId;
  };

  public type RevaluePlayerDown = {
    leagueId: FootballIds.LeagueId;
    playerId : FootballIds.PlayerId;
  };
  public type LoanPlayer = {
    leagueId: FootballIds.LeagueId;
    playerId : FootballIds.ClubId;
    loanLeagueId: FootballIds.LeagueId;
    loanClubId : FootballIds.ClubId;
    loanEndDate : Int;
    newValueQuarterMillions : Nat16;
  };

  public type TransferPlayer = {
    leagueId: FootballIds.LeagueId;
    clubId: FootballIds.ClubId;
    playerId : FootballIds.ClubId;
    newLeagueId: FootballIds.LeagueId;
    newClubId : FootballIds.ClubId;
    newShirtNumber: Nat8;
    newValueQuarterMillions : Nat16;
  };

  public type SetFreeAgent = {
    leagueId: FootballIds.LeagueId;
    playerId : FootballIds.ClubId;
    newValueQuarterMillions : Nat16;
  };

  public type RecallPlayer = {
    leagueId: FootballIds.LeagueId;
    playerId : FootballIds.ClubId;
    newValueQuarterMillions : Nat16;
  };

  public type CreatePlayer = {
    leagueId: FootballIds.LeagueId;
    clubId : FootballIds.ClubId;
    position : FootballEnums.PlayerPosition;
    firstName : Text;
    lastName : Text;
    shirtNumber : Nat8;
    valueQuarterMillions : Nat16;
    dateOfBirth : Int;
    nationality : Ids.CountryId;
  };

  public type UpdatePlayer = {
    leagueId: FootballIds.LeagueId;
    playerId : FootballIds.ClubId;
    position : FootballEnums.PlayerPosition;
    firstName : Text;
    lastName : Text;
    shirtNumber : Nat8;
    dateOfBirth : Int;
    nationality : Ids.CountryId;
  };

  public type SetPlayerInjury = {
    leagueId: FootballIds.LeagueId;
    playerId : FootballIds.ClubId;
    description : Text;
    expectedEndDate : Int;
  };

  public type RetirePlayer = {
    leagueId: FootballIds.LeagueId;
    playerId : FootballIds.ClubId;
    retirementDate : Int;
  };

  public type UnretirePlayer = {
    leagueId: FootballIds.LeagueId;
    playerId : FootballIds.ClubId;
    newValueQuarterMillions : Nat16;
  };
}
