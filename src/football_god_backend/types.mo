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

    sweepstakePaid: Bool;
    totalScore: Nat16;
    winnings: Nat64;
    groupAWinnerTeamId: TeamId;
    groupALoserTeamId: TeamId;
    groupAGoalscorer: PlayerId;
    groupAGoalAssister: PlayerId;
    groupAYellowCard: PlayerId;
    groupARedCard: PlayerId;

    groupBWinnerTeamId: TeamId;
    groupBLoserTeamId: TeamId;
    groupBGoalscorer: PlayerId;
    groupBGoalAssister: PlayerId;
    groupBYellowCard: PlayerId;
    groupBRedCard: PlayerId;

    groupCWinnerTeamId: TeamId;
    groupCLoserTeamId: TeamId;
    groupCGoalscorer: PlayerId;
    groupCGoalAssister: PlayerId;
    groupCYellowCard: PlayerId;
    groupCRedCard: PlayerId;

    groupDWinnerTeamId: TeamId;
    groupDLoserTeamId: TeamId;
    groupDGoalscorer: PlayerId;
    groupDGoalAssister: PlayerId;
    groupDYellowCard: PlayerId;
    groupDRedCard: PlayerId;

    groupEWinnerTeamId: TeamId;
    groupELoserTeamId: TeamId;
    groupEGoalscorer: PlayerId;
    groupEGoalAssister: PlayerId;
    groupEYellowCard: PlayerId;
    groupERedCard: PlayerId;

    groupFWinnerTeamId: TeamId;
    groupFLoserTeamId: TeamId;
    groupFGoalscorer: PlayerId;
    groupFGoalAssister: PlayerId;
    groupFYellowCard: PlayerId;
    groupFRedCard: PlayerId;

    roundOf16Winner: TeamId;
    roundOf16Loser: TeamId;
    roundOf16Goalscorer: PlayerId;
    roundOf16GoalAssister: PlayerId;
    roundOf16YellowCard: PlayerId;
    roundOf16RedCard: PlayerId;

    quarterFinalWinner: TeamId;
    quarterFinalLoser: TeamId;
    quarterFinalGoalscorer: PlayerId;
    quarterFinalGoalAssister: PlayerId;
    quarterFinalYellowCard: PlayerId;
    quarterFinalRedCard: PlayerId;

    semiFinalWinner: TeamId;
    semiFinalLoser: TeamId;
    semiFinalGoalscorer: PlayerId;
    semiFinalGoalAssister: PlayerId;
    semiFinalYellowCard: PlayerId;
    semiFinalRedCard: PlayerId;

    finalWinner: TeamId;
    finalLoser: TeamId;
    finalGoalscorer: PlayerId;
    finalGoalAssister: PlayerId;
    finalYellowCard: PlayerId;
    finalRedCard: PlayerId;

  };

  public type InternationalTeam = {
    players: [InternationalPlayer];
    countryName: Text;
    countryCode: Text;
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
    status : Nat8; // 0 = Unplayed, 1 = Active, 2 = Finished
    stage: Euro2024Stage;
    group: ?Euro2024Group;
  };

  public type Euro2024Stage = {
    #GroupStage;
    #RoundOf16;
    #QuarterFinals;
    #SemiFinals;
    #Final;
  };

  public type Euro2024Group = { #A; #B; #C; #D; #E; #F}

};
