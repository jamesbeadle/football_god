import List "mo:base/List";

module Types {

  public type Error = {
    #NotFound;
    #AlreadyExists;
    #NotAuthorized;
    #NotAllowed;
    #DecodeError;
  };

  public type Season = {
    id : Nat16;
    name : Text;
    year : Nat16;
    gameweeks : List.List<Types.Gameweek>;
  };

  public type Team = {
    id : Nat16;
    name : Text;
  };

  public type Gameweek = {
    number : Nat8;
    status : Nat8; // 0 = Unopened, 1 = Open, 2 = Closed, 3 = Finalised
    fixtures : List.List<Types.Fixture>;
    fixtureCount : Nat8;
    totalPot : Nat64;
    winningShare : Nat64;
  };

  public type Fixture = {
    id : Nat32;
    homeTeamId : Nat16;
    awayTeamId : Nat16;
    homeGoals : Nat8;
    awayGoals : Nat8;
    status : Nat8; // 0 = Unplayed, 1 = Active, 2 = Finished
  };

  public type Profile = {
    principalName : Text;
    displayName : Text;
    wallet : Text;
    depositAddress : Blob;
    balance : Nat64;
  };

  public type UserGameweek = {
    seasonId : Nat16;
    gameweekNumber : Nat8;
    predictions : List.List<Types.Prediction>;
    enteredSweepstake : Bool;
    correctScores : Nat8;
    predictionCount : Nat8;
    winnings : Nat64;
  };

  public type GameweekSummary = {
    principalName : Text;
    displayName : Text;
  };

  public type Prediction = {
    fixtureId : Nat32;
    homeGoals : Nat8;
    awayGoals : Nat8;
  };

  public type PrincipalName = Text;


  //Types for new betting features

  public type EventId = Nat16;
  public type PlayerId = Nat16;
  public type TeamId = Nat16;
  public type FixtureId = Nat32;
  
  public type BettingMarket = {
    #CorrectResult;
    #CorrectScore;
    #FirstGoalScorer;
    #AnytimeGoalScorer;
    #Score2OrMore;
    #Score3OrMore;
    #ScoreFreekick;
    #MissPenalty;
    #YellowCard;
    #RedCard;
    #Scorecast;
  };

  //Euro 2024 types
  
  public type Euro2024Prediction = {

    totalScore: Nat16;

    groupAPrediction: PredictionSet;
    groupBPrediction: PredictionSet;
    groupCPrediction: PredictionSet;
    groupDPrediction: PredictionSet;
    groupEPrediction: PredictionSet;
    groupFPrediction: PredictionSet;
    r16Prediction: PredictionSet;
    qfPrediction: PredictionSet;
    sfPrediction: PredictionSet;
    fPrediction: PredictionSet;
  };

  public type PredictionSet = {
    stage: TournamentStage;
    winner: TeamId;
    loser: TeamId;
    goalScorer: PlayerId;
    goalAssister: PlayerId;
    yellowCard: PlayerId;
    redCard: PlayerId;
  };

  public type TournamentStage = {
    #GroupA;
    #GroupB;
    #GroupC;
    #GroupD;
    #GroupE;
    #GroupF;
    #RoundOf16;
    #QuarterFinal;
    #SemiFinal;
    #Final;
  };

  public type InternationalTeam = {
    id: TeamId;
    players: [InternationalPlayer];
    countryName: Text;
    countryCode: Text;
    shirtColour: Text;
  };

  public type InternationalPlayer = {
    id : PlayerId;
    firstName: Text;
    lastName: Text;
    nickname: Text;
    position: Position;
    qualifyingAppearances: Nat8;
    qualifyingGoals: Nat8;
    qualifyingAssists: Nat8;
    teamId : TeamId;
    shirtNumber : Nat8;
    dateOfBirth : Int;
    nationality : CountryId;
  };

  public type CountryId = Nat8;

  public type Position = {
    #Goalkeeper;
    #Defender;
    #Midfielder;
    #Foward;
  };

  public type Euro2024Fixture = {
    id : Nat8;
    homeTeamId : TeamId;
    awayTeamId : TeamId;
    homeGoals : Nat8;
    awayGoals : Nat8;
    status : FixtureStatus;
    stage: TournamentStage;
  };

  public type FixtureStatus = {
    #Unplayed;
    #Active;
    #Finished;
  };

  public type Bet = {
    betType: BetType;
    stake: Nat64;
    returns: Nat64;
    status: BetStatus;
  };

  public type BetStatus = {
    #Open;
    #Settled;
    #Void;
  };  

  public type BetType = {
    #CorrectResult : CorrectResultOptions;
  };

  public type CorrectResultOptions = {
    #HomeWin;
    #Draw;
    #AwayWin;
  };

  public type EuroProfile = {
    principalName : Text;
    displayName : Text;
    wallet : Text;
    depositAddress : Blob;
    euroPrediction: Euro2024Prediction;
    ogGameweeks: [Types.UserGameweek];
    bets: [Bet];
    termsAccepted: Bool;
  };

  public type Leaderboard = {
    entries : List.List<LeaderboardEntry>;
    totalEntries : Nat;
  };

  public type LeaderboardEntry = {
    principalName : Text;
    position: Nat;
    positionText: Text;
  };

  
};
