import Types "types";
import FootballTypes "football_types";


module BettingTypes {

    public type EventId = Nat;

    public type Selection = {
        selectionType: Category;
        selectionDetail: SelectionDetail;
        result: SelectionResult;
    };

    public type SelectionResult = {
        #Unsettled;
        #Settled;
        #Void;
    };

    public type BetStatus = {
        #Open;
        #Won;
        #Lost;
    };

    public type BetSlip = {
        placedBy: Types.PrincipalId;
        placedOn: Int;
        status: BetStatus;
        selections: [Selection];
        betType: BetType;
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
        penaltyTaken: [PlayerEventDetail];
        penaltyScored: [PlayerEventDetail];
        penaltyMissed: [PlayerEventDetail];
        scoreOutsideBox: [PlayerEventDetail];
        scoreHeader : [PlayerEventDetail];
        scorePenalty : [PlayerEventDetail];
        missPenalty : [PlayerEventDetail];
        firstAssist : PlayerEventDetail;
        lastAssist : PlayerEventDetail;
        anytimeAssist : [PlayerEventDetail];
        scoreBrace : [PlayerGroupEventDetail];
        scoreHatrick : [PlayerGroupEventDetail];
        halfTimeScore : ScoreDetail;
        minuteBandGoalsScored : MinuteBandGoalsScoredDetail;
        minuteBandTeamGoalsScored : MinuteBandTeamGoalsScoredDetail;
        bothTeamsToScore : BothTeamsToScoreDetail;
        halfTimeFullTimeResult : HalfTimeFullTimeResultDetail;
        halfTimeFullTimeScore : HalfTimeFullTimeScoreDetail;
        cornerCount : CornerCountDetail;
        teamCornerCount : TeamCornerCountDetail;
        halfTimeCornerCount : CornerCountDetail;
        halfTimeTeamCornerCount : TeamCornerCountDetail;
        asianHandicap : ScoreDetail;
        bothTeamsToScoreAndWinner : BothTeamsToScoreAndWinnerDetail;
    };

    public type CorrectResultDetail = {
        matchResult: MatchResult;
    };

    public type ScoreDetail = {
        homeGoals: Nat8;
        awayGoals: Nat8;
    };

    public type PlayerEventDetail = {
        clubId: FootballTypes.ClubId;
        playerId: FootballTypes.PlayerId;
        minute: Nat8;
    };

    public type PlayerGroupEventDetail = {
        clubId: FootballTypes.ClubId;
        playerId: FootballTypes.PlayerId;
    };

    public type PickTwoScorersDetail = {
        clubId: FootballTypes.ClubId;
        playerId: FootballTypes.PlayerId;
    };

    public type MinuteBandGoalsScoredDetail = {
        start: Nat8;
        end: Nat8;
        goalsScored: Nat8;
    };

    public type MinuteBandTeamGoalsScoredDetail = {
        start: Nat8;
        end: Nat8;
        goalsScored: Nat8;
        clubId: FootballTypes.ClubId;
    };

    public type BothTeamsToScoreDetail = {
        prediction: Bool;
    };

    public type HalfTimeFullTimeResultDetail = {
        halfTimeResult: MatchResult;
        fullTimeResult: MatchResult;
    };

    public type HalfTimeFullTimeScoreDetail = {
        halfTimeHomeGoals: Nat8;
        halfTimeAwayGoals: Nat8;
        fullTimeHomeGoals: Nat8;
        fullTimeAwayGoals: Nat8;
    };

    public type CornerCountDetail = {
        corners: Nat8;
    };

    public type TeamCornerCountDetail = {
        homeCorners: Nat8;
        awayCorners: Nat8;
    };

    public type BothTeamsToScoreAndWinnerDetail = {
        bothTeamsScored: Bool;
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
        #PenaltyTaken;
        #PenaltyScored;
        #PenaltyMissed;
        #ScoreOutsideBox;
        #ScoreHeader;
        #ScorePenalty;
        #MissPenalty;
        #FirstAssist;
        #LastAssist;
        #AnytimeAssist;
        #ScoreBrace;
        #ScoreHatrick;
        #PickTwoScorers;
        #PickThreeScorers;
        #PickFourScorers;
        #GoalAssistCombo;
        #TeamScoreOverUnder;
        #HalfTimeScore;
        #MinuteBandGoalsScored;
        #MinuteBandTeamGoalsScored;
        #BothTeamsToScore;
        #HalfTimeFullTimeResult;
        #HalfTimeFullTimeScore;
        #CornerCount;
        #TeamCornerCount;
        #HalfTimeCornerCount;
        #HalfTimeTeamCornerCount;
        #AsianHandicap;
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
        #AnytimeGoalscorer: [PlayerEventDetail];
        #YellowCard: [PlayerEventDetail];
        #RedCard: [PlayerEventDetail];
        #PenaltyTaken: [PlayerEventDetail];
        #PenaltyScored: [PlayerEventDetail];
        #PenaltyMissed: [PlayerEventDetail];
        #ScoreOutsideBox: [PlayerEventDetail];
        #ScoreHeader : [PlayerEventDetail];
        #ScorePenalty : [PlayerEventDetail];
        #MissPenalty : [PlayerEventDetail];
        #FirstAssist : PlayerEventDetail;
        #LastAssist : PlayerEventDetail;
        #AnytimeAssist : [PlayerEventDetail];
        #ScoreBrace : [PlayerGroupEventDetail];
        #ScoreHatrick : [PlayerGroupEventDetail];
        #HalfTimeScore : ScoreDetail;
        #MinuteBandGoalsScored : MinuteBandGoalsScoredDetail;
        #MinuteBandTeamGoalsScored : MinuteBandTeamGoalsScoredDetail;
        #BothTeamsToScore : BothTeamsToScoreDetail;
        #HalfTimeFullTimeResult : HalfTimeFullTimeResultDetail;
        #HalfTimeFullTimeScore : HalfTimeFullTimeScoreDetail;
        #CornerCount : CornerCountDetail;
        #TeamCornerCount : TeamCornerCountDetail;
        #HalfTimeCornerCount : CornerCountDetail;
        #HalfTimeTeamCornerCount : TeamCornerCountDetail;
        #AsianHandicap : ScoreDetail;
        #BothTeamsToScoreAndWinner : BothTeamsToScoreAndWinnerDetail;
    };

    



};
