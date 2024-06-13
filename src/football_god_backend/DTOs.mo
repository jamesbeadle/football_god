import T "types";

module DTOs {

  public type DataCacheDTO = {
    category : Text;
    hash : Text;
  };

  public type HomeDTO = {
    systemUpdating : Bool;
    activeSeasonName : Text;
    activeGameweekNumber : Nat8;
    fixtures : [FixtureDTO];
    gameweekStatus : Nat8;
    hasPredictions : Bool;
    principalName : Text;
    activeSeasonId : Nat16;
  };

  public type GameweekPotDTO = {
    gameweekPot : Nat64;
  };

  public type PlayDTO = {
    activeSeasonName : Text;
    activeSeasonId : Nat16;
    activeGameweekNumber : Nat8;
    fixtures : [FixtureDTO];
    sweepstakePaid : Bool;
    userId : Text;
  };

  public type AccountBalanceDTO = {
    accountBalance : Nat;
  };

  public type SubmitPlayDTO = {
    fixtures : [FixtureDTO];
    enterSweepstake : Bool;
  };

  public type ViewPredictionDTO = {
    seasonName : Text;
    fixtures : [FixtureDTO];
    playerName : Text;
    correctScores : Nat8;
    totalFixtures : Nat8;
  };

  public type HistoryDTO = {
    seasons : [SeasonDTO];
    activeSeasonId : Nat16;
    activeSeasonName : Text;
    seasonGameweeks : [GameweekDTO];
    userId : Text;
  };

  public type LeaderBoardDTO = {
    seasons : [SeasonDTO];
    activeSeasonId : Nat16;
    activeSeasonName : Text;
    activeGameweekNumber : Nat8;
    leaderboardEntries : [LeaderboardEntryDTO];
    totalEntries : Nat64;
    totalPot : Nat64;
    winningShare : Nat64;
    status : Nat8;
  };

  public type LeaderboardEntryDTO = {
    principalName : Text;
    position : Text;
    displayName : Text;
    correctScores : Nat8;
    totalFixtures : Nat8;
    enteredSweepstake : Bool;
  };

  public type AdminDTO = {
    activeSeasonId : Nat16;
    activeSeasonName : Text;
    activeGameweekNumber : Nat8;
    activeGameweekStatus : Text;
    seasons : [SeasonDTO];
  };

  public type BalancesDTO = {
    potAccountBalance : Nat64;
    userBalances : [UserBalanceDTO];
    totalEntries : Nat64;
  };

  public type UserBalanceDTO = {
    principalName : Text;
    displayName : Text;
    balance : Nat64;
  };

  public type PayoutDTO = {
    activeSeasonName : Text;
    activeGameweekNumber : Nat8;
    potAccountBalance : Nat64;
    adminFee : Nat64;
    gameweekPot : Nat64;
    winnerCount : Nat64;
    winnerShare : Nat64;
  };

  public type FixtureDTO = {
    fixtureId : Nat32;
    homeTeamId : Nat16;
    awayTeamId : Nat16;
    homeTeamName : Text;
    awayTeamName : Text;
    homeTeamGoals : Nat8;
    awayTeamGoals : Nat8;
    homeTeamPrediction : Nat8;
    awayTeamPrediction : Nat8;
    correct : Bool;
    status : Nat8;
  };

  public type SeasonDTO = {
    seasonId : Nat16;
    seasonName : Text;
    seasonYear : Nat16;
    gameweeks : [GameweekDTO];
  };

  public type GameweekDTO = {
    gameweekNumber : Nat8;
    sweepstakeEntered : Bool;
    correctScores : Nat8;
    totalFixtures : Nat8;
    winnings : Nat64;
  };

  public type ProfileDTO = {
    principalName : Text;
    depositAddress : Blob;
    fplDepositAddress : Text;
    displayName : Text;
    walletAddress : Text;
  };

  public type CorrectPredictionsDTO = {
    seasonName : Text;
    seasonId : Nat16;
    gameweekNumber : Nat8;
    homeTeamName : Text;
    awayTeamName : Text;
    homeTeamGoals : Nat8;
    awayTeamGoals : Nat8;
    predictions : [CorrectPredictionDTO];
    totalEntries : Nat64;
  };

  public type CorrectPredictionDTO = {
    principalName : Text;
    displayName : Text;
  };

  public type LiveOddsDTO = {
    eventId : T.EventId;
    correctResultOdds : ResultOddsDTO;
    correctScoreOdds : [ScoreOddsDTO];
    firstGoalScorerOdds : [PlayerOddsDTO];
    anytimeGoalScorerOdds : [PlayerOddsDTO];
    score2OrMoreOdds : [PlayerOddsDTO];
    score3OrMoreOdds : [PlayerOddsDTO];
    scoreFreekickOdds : [PlayerOddsDTO];
    missPenaltyOdds : [PlayerOddsDTO];
    yellowCardOdds : [PlayerOddsDTO];
    redCardOdds : [PlayerOddsDTO];
    scorecastOdds : [ScorecastOddsDTO];
  };

  public type ResultOddsDTO = {
    homeOdds : Float;
    drawOdds : Float;
    awayOdds : Float;
  };

  public type ScoreOddsDTO = {
    homeScore : Nat8;
    awayScore : Nat8;
    odds : Float;
  };

  public type PlayerOddsDTO = {
    playerId : T.PlayerId;
    odds : Float;
  };

  public type ScorecastOddsDTO = {
    playerId : T.PlayerId;
    homeGoals : Nat8;
    awayGoals : Nat8;
    odds : Float;
  };

  public type Euro2024PredictionDTO = {
    alreadyEntered: Bool;
    groupAPrediction : T.PredictionSet;
    groupBPrediction : T.PredictionSet;
    groupCPrediction : T.PredictionSet;
    groupDPrediction : T.PredictionSet;
    groupEPrediction : T.PredictionSet;
    groupFPrediction : T.PredictionSet;
    r16Prediction : T.PredictionSet;
    qfPrediction : T.PredictionSet;
    sfPrediction : T.PredictionSet;
    fPrediction : T.PredictionSet;
    principalId : T.PrincipalName;
    entryTime: Int;
    totalScore : Nat16;
  };

  public type Euro2024FixtureDTO = {
    fixtureId : T.FixtureId;
    homeTeamId : T.TeamId;
    awayTeamId : T.TeamId;
    homeTeamName : Text;
    awayTeamName : Text;
    homeTeamGoals : Nat8;
    awayTeamGoals : Nat8;
    status : Nat8;
  };

  public type Euro2024LeaderBoardDTO = {
    leaderboardEntries : [Euro2024LeaderboardEntryDTO];
    totalEntries : Nat;
    totalPot : Nat64;
    winningShare : Nat64;
    status : Nat8;
  };

  public type Euro2024DTO = {
    prizePool : Nat64;
    totalManagers : Nat;
    stage : T.GameState;
  };

  public type Euro2024EventDTO = {
    eventId: T.Euro2024EventId;
    stage: T.TournamentStage;
    eventType: T.EventType;
    playerId: T.PlayerId;
    teamId: T.TeamId;
    fixtureId: T.FixtureId;
  };

  public type AccountBalancesDTO = {
    principalId: T.PrincipalName;
    fplBalance: Nat;
    icpBalance: Nat64;
  };

  public type GetLeaderboardDTO = {
    limit : Nat;
    offset : Nat;
    entries: [LeaderboardEntryDTO];
    totalEntries: Nat;
  };

  public type Euro2024LeaderboardEntryDTO = {
    principalName : Text;
    position : Text;
    displayName : Text;
    totalScore : Nat;
    profilePicture: ?Blob;
  };

};
