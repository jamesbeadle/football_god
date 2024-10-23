import Base "../types/base_types";
import FootballTypes "../types/football_types";

module DTOs {

  public type ProfileDTO = {
    principalId : Base.PrincipalId;
    username : Text; 
    withdrawalAddress: Text;
  };

  public type ClubFilterDTO = {
    leagueId: FootballTypes.LeagueId;
    clubId: FootballTypes.ClubId;
  };

  public type PlayerRatingsDTO = {
    leagueId: FootballTypes.LeagueId;
    players : [FootballTypes.Player];
    totalEntries : Nat16;
  };

  public type PlayerDTO = {
    id : Nat16;
    clubId : FootballTypes.ClubId;
    position : FootballTypes.PlayerPosition;
    firstName : Text;
    lastName : Text;
    shirtNumber : Nat8;
    valueQuarterMillions : Nat16;
    dateOfBirth : Int;
    nationality : Base.CountryId;
    status : FootballTypes.PlayerStatus;
  };

  public type SnapshotPlayerDTO = {
    leagueId: FootballTypes.LeagueId;
    id : Nat16;
    clubId : FootballTypes.ClubId;
    position : FootballTypes.PlayerPosition;
    firstName : Text;
    lastName : Text;
    shirtNumber : Nat8;
    valueQuarterMillions : Nat16;
    dateOfBirth : Int;
    nationality : Base.CountryId;
    status : FootballTypes.PlayerStatus;
    totalPoints: Int;
  };

  public type PlayerScoreDTO = {
    id : Nat16;
    points : Int16;
    clubId : FootballTypes.ClubId;
    goalsScored : Int16;
    goalsConceded : Int16;
    position : FootballTypes.PlayerPosition;
    nationality : Base.CountryId;
    dateOfBirth : Int;
    saves : Int16;
    assists : Int16;
    events : [FootballTypes.PlayerEventData];
  };

  public type PlayerPointsDTO = {
    id : Nat16;
    gameweek : FootballTypes.GameweekNumber;
    points : Int16;
    clubId : FootballTypes.ClubId;
    position : FootballTypes.PlayerPosition;
    events : [FootballTypes.PlayerEventData];
  };

  public type PlayerDetailDTO = {
    id : FootballTypes.PlayerId;
    clubId : FootballTypes.ClubId;
    position : FootballTypes.PlayerPosition;
    firstName : Text;
    lastName : Text;
    shirtNumber : Nat8;
    valueQuarterMillions : Nat16;
    dateOfBirth : Int;
    nationality : Base.CountryId;
    seasonId : FootballTypes.SeasonId;
    gameweeks : [PlayerGameweekDTO];
    valueHistory : [FootballTypes.ValueHistory];
    status : FootballTypes.PlayerStatus;
    parentClubId : FootballTypes.ClubId;
    latestInjuryEndDate : Int;
    injuryHistory : [FootballTypes.InjuryHistory];
    retirementDate : Int;
  };

  public type PlayerGameweekDTO = {
    number : Nat8;
    events : [FootballTypes.PlayerEventData];
    points : Int16;
    fixtureId : FootballTypes.FixtureId;
  };

  public type LeaderboardEntryDTO = {
    position : Int;
    positionText : Text;
    username : Text;
    principalId : Text;
    points : Int16;
  };

  public type SeasonDTO = {
    id : FootballTypes.SeasonId;
    name : Text;
    year : Nat16;
  };

  public type FixtureDTO = {
    id : Nat32;
    seasonId : FootballTypes.SeasonId;
    gameweek : FootballTypes.GameweekNumber;
    kickOff : Int;
    homeClubId : FootballTypes.ClubId;
    awayClubId : FootballTypes.ClubId;
    homeGoals : Nat8;
    awayGoals : Nat8;
    status : FootballTypes.FixtureStatusType;
    highestScoringPlayerId : Nat16;
    events : [FootballTypes.PlayerEventData];
  };

  public type UpdateFixtureDTO = {
    seasonId : FootballTypes.SeasonId;
    fixtureId : FootballTypes.FixtureId;
    gameweek : FootballTypes.GameweekNumber;
    kickOff : Int;
    status : FootballTypes.FixtureStatusType;
  };

  public type FootballLeagueDTO = {
    id: FootballTypes.LeagueId;
    name: Text;
    abbreviation: Text;
    teamCount: Nat8;
    relatedGender: Base.Gender;
    governingBody: Text;
    formed: Int;
    countryId: Base.CountryId;
    logo: Blob;
  };

  public type ClubDTO = {
    id : FootballTypes.ClubId;
    name : Text;
    friendlyName : Text;
    primaryColourHex : Text;
    secondaryColourHex : Text;
    thirdColourHex : Text;
    abbreviatedName : Text;
    shirtType : FootballTypes.ShirtType;
  };

  public type CountryDTO = {
    id : Base.CountryId;
    name : Text;
    code : Text;
  };

  public type DataHashDTO = {
    category : Text;
    hash : Text;
  };

  public type PaginationFiltersDTO = {
    limit : Nat;
    offset : Nat;
  };



};
