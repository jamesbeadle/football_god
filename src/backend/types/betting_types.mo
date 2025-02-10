import Base "mo:waterway-mops/BaseTypes";
import FootballTypes "mo:waterway-mops/FootballTypes";


module BettingTypes {

    /* Match odds related types */

    public type MatchOdds = {
        leagueId: FootballTypes.LeagueId;
        gameweek: FootballTypes.GameweekNumber;
        fixtureId: FootballTypes.FixtureId;
        correctResults: TeamSelectionOdds;
        correctScores: [ScoreSelectionOdds];
        halfTimeScores: [ScoreSelectionOdds];
        firstGoalscorers: [PlayerSelectionOdds];
        lastGoalscorers: [PlayerSelectionOdds];
        anytimeScorers: [PlayerSelectionOdds];
        yellowCards: [PlayerSelectionOdds];
        redCards: [PlayerSelectionOdds];
        penaltyMissed: MissPenaltyOdds;
        penaltyMissers: [PlayerSelectionOdds];
        firstAssisters: [PlayerSelectionOdds];
        lastAssist: [PlayerSelectionOdds];
        anytimeAssist: [PlayerSelectionOdds];
        scoresBrace: [PlayerSelectionOdds];
        scoresHatTrick: [PlayerSelectionOdds];
        goalsOverUnder: OverUnderSelectionOdds;
        bothTeamsToScore: YesNoSelectionOdds;
        halfTimeFullTimeResult: [HalfTimeFullTimeOdds];
        bothTeamsToScoreAndWinner: [ResultAndYesNoSelectionOdds];
    };

    public type TeamSelectionOdds = {
        homeOdds: Float;
        drawOdds: Float;
        awayOdds: Float;
    };

    public type ScoreSelectionOdds = {
        homeGoals: Nat8;
        awayGoals: Nat8;
        odds: Float;
    };

    public type PlayerSelectionOdds = {
        playerId: FootballTypes.PlayerId;
        odds: Float;
    };

    public type OverUnderSelectionOdds = {
        overOdds: [OverUnderSelection];
        underOdds: [OverUnderSelection];
    };

    public type OverUnderSelection = {
        margin: Float;
        odds: Float;
    };

    public type YesNoSelectionOdds = {
        yesOdds: Float;
        noOdds: Float;
    };

    public type HalfTimeFullTimeOdds = {
        firstHalfResult: MatchResult;
        secondHalfResult: MatchResult;
        odds: Float;
    };

    public type ResultAndYesNoSelectionOdds = {
        result: MatchResult;
        isYes: Bool;
        odds: Float;
    };

    public type MissPenaltyOdds = {
        homeTeam: Float;
        awayTeam: Float;
    };

    /* Betting slip related types */

    public type BetSlip = {
        id: Nat;
        placedBy: Base.PrincipalId;
        placedOn: Int;
        status: SelectionStatus;
        result: BetResult;
        selections: [Selection];
        betType: BetType;
        totalStake: Nat64;
        expectedReturns: Nat64;
        totalWinnings: Nat64;
        settledOn: Int;
    };

    public type Selection = {
        leagueId: FootballTypes.LeagueId;
        selectionType: Category;
        selectionDetail: SelectionDetail;
        status: SelectionStatus;
        result: BetResult;
        odds: Float;
        stake: Nat64;
        fixtureId: FootballTypes.FixtureId;
        winnings: Float;
        expectedReturns: Nat64;
    };

    public type SelectionStatus = {
        #Unsettled;
        #Settled;
        #Void;
    };

    public type BetResult = {
        #Open;
        #Won;
        #Lost;
    };

    public type Event = {
        fixtureId: FootballTypes.FixtureId;
        results: EventResults; 
    };

    public type EventResults = {
        correctResult: CorrectResultDetail;
        correctScore: ScoreDetail;
        firstGoalscorer: PlayerEventDetail;
        lastGoalscorer: PlayerEventDetail;
        anytimeGoalscorer: [PlayerEventDetail];
        yellowCard: [PlayerEventDetail];
        redCard: [PlayerEventDetail];
        penaltyMissed: [ClubEventDetail];
        missPenalty : [PlayerEventDetail];
        firstAssist : PlayerEventDetail;
        lastAssist : PlayerEventDetail;
        anytimeAssist : [PlayerEventDetail];
        scoreBrace : [PlayerGroupEventDetail];
        scoreHatrick : [PlayerGroupEventDetail];
        halfTimeScore : ScoreDetail;
        bothTeamsToScore : BothTeamsToScoreDetail;
        halfTimeFullTimeResult : HalfTimeFullTimeResultDetail;
        bothTeamsToScoreAndWinner : BothTeamsToScoreAndWinnerDetail;
    };

    public type CorrectResultDetail = {
        matchResult: MatchResult;
    };

    public type ClubEventDetail = {
        clubId: FootballTypes.ClubId;
    };

    public type ScoreDetail = {
        homeGoals: Nat8;
        awayGoals: Nat8;
    };

    public type PlayerEventDetail = {
        clubId: FootballTypes.ClubId;
        playerId: FootballTypes.PlayerId;
    };

    public type PlayerGroupEventDetail = {
        clubId: FootballTypes.ClubId;
        playerId: FootballTypes.PlayerId;
    };

    public type BothTeamsToScoreDetail = {
        bothTeamsToScore: Bool;
    };

    public type HalfTimeFullTimeResultDetail = {
        halfTimeResult: MatchResult;
        fullTimeResult: MatchResult;
    };

    public type BothTeamsToScoreAndWinnerDetail = {
        bothTeamsToScore: Bool;
        matchResult: MatchResult;
    };

    public type Category = {
        #CorrectResult;
        #CorrectScore;
        #FirstGoalscorer;
        #LastGoalscorer;
        #AnytimeGoalscorer;
        #YellowCard;
        #RedCard;
        #PenaltyMissed;
        #MissPenalty;
        #FirstAssist;
        #LastAssist;
        #AnytimeAssist;
        #ScoreBrace;
        #ScoreHatrick;
        #HalfTimeScore;
        #BothTeamsToScore;
        #HalfTimeFullTimeResult;
        #BothTeamsToScoreAndWinner;
    };


    public type BetType = {
        #Single;
        #Double;
        #Treble;
        #FourFold;
        #FiveFold;
        #SixFold;
        #SevenFold;
        #EightFold;
        #NineFold;
        #TenFold;
        #Lucky15;
        #Lucky31;
        #Lucky63;
        #Trixie;
        #Patent;
        #Yankee;
        #Canadian;
        #Heinz;
        #SuperHeinz;
        #Goliath;
    };


    public type MatchResult = {
        #HomeWin;
        #Draw;
        #AwayWin;
    };

    public type SelectionDetail = {
        #CorrectResult: CorrectResultDetail;
        #CorrectScore: ScoreDetail;
        #FirstGoalscorer: PlayerEventDetail;
        #LastGoalscorer: PlayerEventDetail;
        #AnytimeGoalscorer: PlayerEventDetail;
        #YellowCard: PlayerEventDetail;
        #RedCard: PlayerEventDetail;
        #PenaltyMissed: ClubEventDetail;
        #MissPenalty : PlayerEventDetail;
        #FirstAssist : PlayerEventDetail;
        #LastAssist : PlayerEventDetail;
        #AnytimeAssist : PlayerEventDetail;
        #ScoreBrace : PlayerGroupEventDetail;
        #ScoreHatrick : PlayerGroupEventDetail;
        #HalfTimeScore : ScoreDetail;
        #BothTeamsToScore : BothTeamsToScoreDetail;
        #HalfTimeFullTimeResult : HalfTimeFullTimeResultDetail;
        #BothTeamsToScoreAndWinner : BothTeamsToScoreAndWinnerDetail;
    };

    



};
