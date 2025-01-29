import Base "../types/base_types";
import FootballTypes "../types/football_types";

import ResponseDTOs "../dtos/response_DTOs";

module GovernanceDTOs {

  public type RevaluePlayerUpDTO = {
    leagueId: FootballTypes.LeagueId;
    playerId : FootballTypes.PlayerId;
    seasonId : FootballTypes.SeasonId;
    gameweek: FootballTypes.GameweekNumber;
  };

  public type RevaluePlayerDownDTO = {
    leagueId: FootballTypes.LeagueId;
    playerId : FootballTypes.PlayerId;
    seasonId : FootballTypes.SeasonId;
    gameweek: FootballTypes.GameweekNumber;
  };

  public type SubmitFixtureDataDTO = {
    leagueId: FootballTypes.LeagueId;
    seasonId: FootballTypes.SeasonId;
    fixtureId : FootballTypes.FixtureId;
    gameweek: FootballTypes.GameweekNumber;
    playerEventData : [FootballTypes.PlayerEventData];
  };

  public type AddInitialFixturesDTO = {
    leagueId: FootballTypes.LeagueId;
    seasonFixtures : [ResponseDTOs.FixtureDTO];
  };

  public type MoveFixtureDTO = {
    leagueId: FootballTypes.LeagueId;
    seasonId: FootballTypes.SeasonId;
    fixtureId : FootballTypes.FixtureId;
    updatedFixtureGameweek : FootballTypes.GameweekNumber;
    updatedFixtureDate : Int;
  };

  public type PostponeFixtureDTO = {
    leagueId: FootballTypes.LeagueId;
    seasonId: FootballTypes.SeasonId;
    fixtureId : FootballTypes.FixtureId;
  };

  public type RescheduleFixtureDTO = {
    leagueId: FootballTypes.LeagueId;
    seasonId: FootballTypes.SeasonId;
    fixtureId : FootballTypes.FixtureId;
    updatedFixtureGameweek : FootballTypes.GameweekNumber;
    updatedFixtureDate : Int;
  };

  public type LoanPlayerDTO = {
    leagueId: FootballTypes.LeagueId;
    playerId : FootballTypes.ClubId;
    loanLeagueId: FootballTypes.LeagueId;
    loanClubId : FootballTypes.ClubId;
    loanEndDate : Int;
  };

  public type TransferPlayerDTO = {
    leagueId: FootballTypes.LeagueId;
    clubId: FootballTypes.ClubId;
    playerId : FootballTypes.ClubId;
    newLeagueId: FootballTypes.LeagueId;
    newClubId : FootballTypes.ClubId;
    newShirtNumber: Nat8;
  };

  public type SetFreeAgentDTO = {
    leagueId: FootballTypes.LeagueId;
    playerId : FootballTypes.ClubId;
  };

  public type RecallPlayerDTO = {
    leagueId: FootballTypes.LeagueId;
    playerId : FootballTypes.ClubId;
  };

  public type CreatePlayerDTO = {
    leagueId: FootballTypes.LeagueId;
    clubId : FootballTypes.ClubId;
    position : FootballTypes.PlayerPosition;
    firstName : Text;
    lastName : Text;
    shirtNumber : Nat8;
    valueQuarterMillions : Nat16;
    dateOfBirth : Int;
    nationality : Base.CountryId;
  };

  public type UpdatePlayerDTO = {
    leagueId: FootballTypes.LeagueId;
    playerId : FootballTypes.ClubId;
    position : FootballTypes.PlayerPosition;
    firstName : Text;
    lastName : Text;
    shirtNumber : Nat8;
    dateOfBirth : Int;
    nationality : Base.CountryId;
  };

  public type SetPlayerInjuryDTO = {
    leagueId: FootballTypes.LeagueId;
    playerId : FootballTypes.ClubId;
    description : Text;
    expectedEndDate : Int;
  };

  public type RetirePlayerDTO = {
    leagueId: FootballTypes.LeagueId;
    playerId : FootballTypes.ClubId;
    retirementDate : Int;
  };

  public type UnretirePlayerDTO = {
    leagueId: FootballTypes.LeagueId;
    playerId : FootballTypes.ClubId;
  };

  public type UpdateClubDTO = {
    leagueId: FootballTypes.LeagueId;
    clubId : FootballTypes.ClubId;
    name : Text;
    friendlyName : Text;
    primaryColourHex : Text;
    secondaryColourHex : Text;
    thirdColourHex : Text;
    abbreviatedName : Text;
    shirtType : FootballTypes.ShirtType;
  };

  public type PromoteClubDTO = {
    leagueId: FootballTypes.LeagueId;
    clubId: FootballTypes.ClubId;
    toLeagueId: FootballTypes.LeagueId;
  };

  public type RelegateClubDTO = {
    leagueId: FootballTypes.LeagueId;
    clubId: FootballTypes.ClubId;
  };
  
  public type CreateLeagueDTO = {
    name: Text;
    abbreviation: Text;
    teamCount: Nat8;
    relatedGender: Base.Gender;
    governingBody: Text;
    formed: Int;
    countryId: Base.CountryId;
    logo: Blob;
  };


  public type UpdateLeagueDTO = {
    leagueId: FootballTypes.LeagueId;
    name: Text;
    abbreviation: Text;
    teamCount: Nat8;
    relatedGender: Base.Gender;
    governingBody: Text;
    formed: Int;
    countryId: Base.CountryId;
    logo: Blob;
  };

  public type CreateClubDTO = {
    leagueId: FootballTypes.LeagueId;
    name : Text;
    friendlyName : Text;
    primaryColourHex : Text;
    secondaryColourHex : Text;
    thirdColourHex : Text;
    abbreviatedName : Text;
    shirtType : FootballTypes.ShirtType;
  };
};
