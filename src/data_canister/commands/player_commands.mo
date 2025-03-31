import FootballTypes "mo:waterway-mops/FootballTypes";
import BaseTypes "mo:waterway-mops/BaseTypes";
module PlayerCommands {


  public type RevaluePlayerUp = {
    leagueId: FootballTypes.LeagueId;
    playerId : FootballTypes.PlayerId;
  };

  public type RevaluePlayerDown = {
    leagueId: FootballTypes.LeagueId;
    playerId : FootballTypes.PlayerId;
  };
  public type LoanPlayer = {
    leagueId: FootballTypes.LeagueId;
    playerId : FootballTypes.ClubId;
    loanLeagueId: FootballTypes.LeagueId;
    loanClubId : FootballTypes.ClubId;
    loanEndDate : Int;
    newValueQuarterMillions : Nat16;
  };

  public type TransferPlayer = {
    leagueId: FootballTypes.LeagueId;
    clubId: FootballTypes.ClubId;
    playerId : FootballTypes.ClubId;
    newLeagueId: FootballTypes.LeagueId;
    newClubId : FootballTypes.ClubId;
    newShirtNumber: Nat8;
    newValueQuarterMillions : Nat16;
  };

  public type SetFreeAgent = {
    leagueId: FootballTypes.LeagueId;
    playerId : FootballTypes.ClubId;
    newValueQuarterMillions : Nat16;
  };

  public type RecallPlayer = {
    leagueId: FootballTypes.LeagueId;
    playerId : FootballTypes.ClubId;
    newValueQuarterMillions : Nat16;
  };

  public type CreatePlayer = {
    leagueId: FootballTypes.LeagueId;
    clubId : FootballTypes.ClubId;
    position : FootballTypes.PlayerPosition;
    firstName : Text;
    lastName : Text;
    shirtNumber : Nat8;
    valueQuarterMillions : Nat16;
    dateOfBirth : Int;
    nationality : BaseTypes.CountryId;
  };

  public type UpdatePlayer = {
    leagueId: FootballTypes.LeagueId;
    playerId : FootballTypes.ClubId;
    position : FootballTypes.PlayerPosition;
    firstName : Text;
    lastName : Text;
    shirtNumber : Nat8;
    dateOfBirth : Int;
    nationality : BaseTypes.CountryId;
  };

  public type SetPlayerInjury = {
    leagueId: FootballTypes.LeagueId;
    playerId : FootballTypes.ClubId;
    description : Text;
    expectedEndDate : Int;
  };

  public type RetirePlayer = {
    leagueId: FootballTypes.LeagueId;
    playerId : FootballTypes.ClubId;
    retirementDate : Int;
  };

  public type UnretirePlayer = {
    leagueId: FootballTypes.LeagueId;
    playerId : FootballTypes.ClubId;
    newValueQuarterMillions : Nat16;
  };
}
