import FootballTypes "../types/football_types";
import Base "../types/base_types";
import BettingTypes "../types/betting_types";

module ResponseDTOs {

  public type SystemStateDTO = {
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

  public type ProfileDTO = {
    principalId : Base.PrincipalId;
    username : Text; 
    profilePicture: ?Blob;
    profilePictureExtension: Text;
    withdrawalAddress: Text;
    completedKYC: Bool;
    accountOnPause: Bool;
    maxBetLimit: Nat64;
    monthlyBetLimit: Nat64;
    monthlyBetTotal: Nat64;
    accountBalance: Nat64;
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

  public type BettableFixtureDTO = {
    fixtureId: FootballTypes.FixtureId;
    correctResults: BettingTypes.TeamSelectionOdds;
  };

  public type MatchOddsDTO = {
    fixtureId: FootballTypes.FixtureId;
    correctResults: BettingTypes.TeamSelectionOdds;
    correctScores: [BettingTypes.ScoreSelectionOdds];
    halfTimeScores: [BettingTypes.ScoreSelectionOdds];
    firstGoalscorers: [BettingTypes.PlayerSelectionOdds];
    lastGoalscorers: [BettingTypes.PlayerSelectionOdds];
    anytimeScorers: [BettingTypes.PlayerSelectionOdds];
    yellowCards: [BettingTypes.PlayerSelectionOdds];
    redCards: [BettingTypes.PlayerSelectionOdds];
    penaltyMissed: BettingTypes.TeamSelectionOdds;
    penaltyMissers: [BettingTypes.PlayerSelectionOdds];
    firstAssisters: [BettingTypes.PlayerSelectionOdds];
    lastAssist: [BettingTypes.PlayerSelectionOdds];
    anytimeAssist: [BettingTypes.PlayerSelectionOdds];
    scoresBrace: [BettingTypes.PlayerSelectionOdds];
    scoresHatTrick: [BettingTypes.PlayerSelectionOdds];
    goalsOverUnder: BettingTypes.OverUnderSelectionOdds;
    bothTeamsToScore: BettingTypes.YesNoSelectionOdds;
    halfTimeFullTimeResult: [BettingTypes.HalfTimeFullTimeOdds];
    bothTeamsToScoreAndWinner: [BettingTypes.ResultAndYesNoSelectionOdds];
  };
};
