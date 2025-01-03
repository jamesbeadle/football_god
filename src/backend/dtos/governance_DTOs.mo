import Base "../types/base_types";
import FootballTypes "../types/football_types";

import RequestDTOs "../dtos/request_DTOs";
import ResponseDTOs "../dtos/response_DTOs";

module GovernanceDTOs {

  public type RevaluePlayerUpDTO = {
    playerId : FootballTypes.ClubId;
    seasonId : FootballTypes.SeasonId;
    gameweek: FootballTypes.GameweekNumber;
  };

  public type RevaluePlayerDownDTO = {
    playerId : FootballTypes.ClubId;
    seasonId : FootballTypes.SeasonId;
    gameweek: FootballTypes.GameweekNumber;
  };

  public type SubmitFixtureDataDTO = {
    seasonId: FootballTypes.SeasonId;
    leagueId: FootballTypes.LeagueId;
    fixtureId : FootballTypes.FixtureId;
    gameweek: FootballTypes.GameweekNumber;
    playerEventData : [FootballTypes.PlayerEventData];
  };

  public type AddInitialFixturesDTO = {
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
    postponedFixtureId : FootballTypes.FixtureId;
    updatedFixtureGameweek : FootballTypes.GameweekNumber;
    updatedFixtureDate : Int;
  };

  public type LoanPlayerDTO = {
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
    playerId : FootballTypes.ClubId;
  };

  public type CreatePlayerDTO = {
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
    playerId : FootballTypes.ClubId;
    position : FootballTypes.PlayerPosition;
    firstName : Text;
    lastName : Text;
    shirtNumber : Nat8;
    dateOfBirth : Int;
    nationality : Base.CountryId;
  };

  public type SetPlayerInjuryDTO = {
    playerId : FootballTypes.ClubId;
    description : Text;
    expectedEndDate : Int;
  };

  public type RetirePlayerDTO = {
    playerId : FootballTypes.ClubId;
    retirementDate : Int;
  };

  public type UnretirePlayerDTO = {
    leagueId: FootballTypes.LeagueId;
    playerId : FootballTypes.ClubId;
  };

  public type UpdateClubDTO = {
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
    name : Text;
    friendlyName : Text;
    primaryColourHex : Text;
    secondaryColourHex : Text;
    thirdColourHex : Text;
    abbreviatedName : Text;
    shirtType : FootballTypes.ShirtType;
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

  public type RemoveClubDTO = {
    leagueId: FootballTypes.LeagueId;
    clubId: FootballTypes.ClubId;
  };
};
