import FootballTypes "mo:waterway-mops/FootballTypes";
import Base "mo:waterway-mops/BaseTypes";

module ResponseDTOs {

  public type SystemStateDTO = {
    onHold : Bool;
    version: Text;
  };

  public type AppStatusDTO = {
      onHold : Bool;
      version : Text;
  };

  public type LeagueStatusDTO = {
    leagueId: FootballTypes.LeagueId;
    activeSeasonId: FootballTypes.SeasonId;
    activeGameweek: FootballTypes.GameweekNumber;
    lastConfirmedGameweek: FootballTypes.GameweekNumber;
    transferWindowActive: Bool;
    seasonActive : Bool;
  };

  public type ProfileDTO = {
    principalId : Base.PrincipalId;
    joinedDate: Int;
    termsAcceptedDate: Int;
    username : Text; 
    profilePicture: ?Blob;
    profilePictureExtension: Text;
    withdrawalAddress: Text;
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
    leagueId: FootballTypes.LeagueId;
    parentLeagueId: FootballTypes.LeagueId;
    parentClubId: FootballTypes.ClubId;
    currentLoanEndDate: Int;
  };

  public type LoanedPlayerDTO = {
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
    currentLoanEndDate: Int;
    parentClubId: FootballTypes.ClubId;
    parentLeagueId: FootballTypes.LeagueId;
    leagueId: FootballTypes.LeagueId;
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

  public type HomePageFixtureDTO = {
    leagueId: FootballTypes.LeagueId;
    gameweek: FootballTypes.GameweekNumber;
    fixtureId: FootballTypes.FixtureId;
    homeOdds: Float;
    drawOdds: Float;
    awayOdds: Float;
  };

  public type UserAuditDTO = {
    date: Int;
    users: [UserDTO];
    offset: Nat;
  };

  public type UserDTO = {
    principalId: Base.PrincipalId;
    joinedDate: Int;
    termsAcceptedDate: Int;
  }
  
};
