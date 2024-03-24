import T "types";

module DTOs {

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
    accountBalance : Nat64;
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
    eventId: T.EventId;
    correctResultOdds: ResultOddsDTO;
    correctScoreOdds: [ScoreOddsDTO];
    firstGoalScorerOdds: [PlayerOddsDTO];
    anytimeGoalScorerOdds: [PlayerOddsDTO];
    score2OrMoreOdds:  [PlayerOddsDTO];
    score3OrMoreOdds:  [PlayerOddsDTO];
    scoreFreekickOdds:  [PlayerOddsDTO];
    missPenaltyOdds:  [PlayerOddsDTO];
    yellowCardOdds:  [PlayerOddsDTO];
    redCardOdds: [PlayerOddsDTO];
    scorecastOdds: [ScorecastOddsDTO];
  };

  public type ResultOddsDTO = {
    homeOdds: Float;
    drawOdds: Float;
    awayOdds: Float;
  };

  public type ScoreOddsDTO = {
    homeScore: Nat8;
    awayScore: Nat8;
    odds: Float;
  };

  public type PlayerOddsDTO = {
    playerId: T.PlayerId;
    odds: Float;
  };

  public type ScorecastOddsDTO = {
    playerId: T.PlayerId;
    homeGoals: Nat8;
    awayGoals: Nat8;
    odds: Float;
  };

  public type Euro2024PredictionDTO = {
    groupAWinnerTeamId: T.TeamId;
    groupALoserTeamId: T.TeamId;
    groupAGoalscorer: T.PlayerId;
    groupAGoalAssister: T.PlayerId;
    groupAYellowCard: T.PlayerId;
    groupARedCard: T.PlayerId;

    groupBWinnerTeamId: T.TeamId;
    groupBLoserTeamId: T.TeamId;
    groupBGoalscorer: T.PlayerId;
    groupBGoalAssister: T.PlayerId;
    groupBYellowCard: T.PlayerId;
    groupBRedCard: T.PlayerId;

    groupCWinnerTeamId: T.TeamId;
    groupCLoserTeamId: T.TeamId;
    groupCGoalscorer: T.PlayerId;
    groupCGoalAssister: T.PlayerId;
    groupCYellowCard: T.PlayerId;
    groupCRedCard: T.PlayerId;

    groupDWinnerTeamId: T.TeamId;
    groupDLoserTeamId: T.TeamId;
    groupDGoalscorer: T.PlayerId;
    groupDGoalAssister: T.PlayerId;
    groupDYellowCard: T.PlayerId;
    groupDRedCard: T.PlayerId;

    groupEWinnerTeamId: T.TeamId;
    groupELoserTeamId: T.TeamId;
    groupEGoalscorer: T.PlayerId;
    groupEGoalAssister: T.PlayerId;
    groupEYellowCard: T.PlayerId;
    groupERedCard: T.PlayerId;

    groupFWinnerTeamId: T.TeamId;
    groupFLoserTeamId: T.TeamId;
    groupFGoalscorer: T.PlayerId;
    groupFGoalAssister: T.PlayerId;
    groupFYellowCard: T.PlayerId;
    groupFRedCard: T.PlayerId;

    roundOf16Winner: T.TeamId;
    roundOf16Loser: T.TeamId;
    roundOf16Goalscorer: T.PlayerId;
    roundOf16GoalAssister: T.PlayerId;
    roundOf16YellowCard: T.PlayerId;
    roundOf16RedCard: T.PlayerId;

    quarterFinalWinner: T.TeamId;
    quarterFinalLoser: T.TeamId;
    quarterFinalGoalscorer: T.PlayerId;
    quarterFinalGoalAssister: T.PlayerId;
    quarterFinalYellowCard: T.PlayerId;
    quarterFinalRedCard: T.PlayerId;

    semiFinalWinner: T.TeamId;
    semiFinalLoser: T.TeamId;
    semiFinalGoalscorer: T.PlayerId;
    semiFinalGoalAssister: T.PlayerId;
    semiFinalYellowCard: T.PlayerId;
    semiFinalRedCard: T.PlayerId;

    finalWinner: T.TeamId;
    finalLoser: T.TeamId;
    finalGoalscorer: T.PlayerId;
    finalGoalAssister: T.PlayerId;
    finalYellowCard: T.PlayerId;
    finalRedCard: T.PlayerId;

  };

  public type PlayEuro2024DTO = {
    prediction : Euro2024PredictionDTO;
    sweepstakePaid : Bool;
    userId : Text;
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
  
  public type Euro2024LeaderboardEntryDTO = {
    principalName : Text;
    position : Text;
    displayName : Text;
    totalScore : Nat16;
    enteredSweepstake : Bool;
  };

  public type Euro2024LeaderBoardDTO = {
    leaderboardEntries : [Euro2024LeaderboardEntryDTO];
    totalEntries : Nat64;
    totalPot : Nat64;
    winningShare : Nat64;
    status : Nat8;
  };

};
