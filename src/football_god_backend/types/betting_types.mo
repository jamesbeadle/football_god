import Base "base_types";
import FootballTypes "football_types";


module BettingTypes {

    /* Match odds related types */

    public type MatchOdds = {
        correctResults: TeamSelectionOdds;
        correctScores: [ScoreSelectionOdds];
        halfTimeScores: [ScoreSelectionOdds];
        firstGoalscorers: [PlayerSelectionOdds];
        lastGoalscorers: [PlayerSelectionOdds];
        anytimeScorers: [PlayerSelectionOdds];
        yellowCards: [PlayerSelectionOdds];
        redCards: [PlayerSelectionOdds];
        penaltyAwarded: TeamSelectionOdds;
        penaltyScored: TeamSelectionOdds;
        penaltyMissed: TeamSelectionOdds;
        outsideBoxScorers: [PlayerSelectionOdds];
        headerScorers: [PlayerSelectionOdds];
        penaltyScorers: [PlayerSelectionOdds];
        penaltyMissers: [PlayerSelectionOdds];
        firstAssisters: [PlayerSelectionOdds];
        lastAssist: [PlayerSelectionOdds];
        anytimeAssist: [PlayerSelectionOdds];
        scoresBrace: [PlayerSelectionOdds];
        scoresHatTrick: [PlayerSelectionOdds];
        goalsOverUnder: OverUnderSelectionOdds;
        bothTeamsToScore: YesNoSelectionOdds;
        halfTimeFullTimeResult: [SplitHalfTeamSelectionOdds];
        bothTeamsToScoreAndWinner: [ClubAndYesNoSelectionOdds];
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
        homeOdds: [OverUnderSelection];
        awayOdds: [OverUnderSelection];
    };

    public type OverUnderSelection = {
        margin: Float;
        odds: Float;
    };

    public type YesNoSelectionOdds = {
        yesOdds: Float;
        noOdds: Float;
    };

    public type SplitHalfTeamSelectionOdds = {
        firstHalfClubId: FootballTypes.ClubId;
        secondHalfClubId: FootballTypes.ClubId;
        odds: Float;
    };

    public type ClubAndYesNoSelectionOdds = {
        clubId: FootballTypes.ClubId;
        isYes: Bool;
        isNo: Bool;
    };

    /* Betting slip related types */

    public type BetSlip = {
        id: Nat;
        placedBy: Base.PrincipalId;
        placedOn: Int;
        status: BetStatus;
        selections: [Selection];
        betType: BetType;
        totalStake: Nat64;
    };

    public type Selection = {
        selectionType: Category;
        selectionDetail: SelectionDetail;
        result: SelectionResult;
        odds: Float;
        stake: Nat64;
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
        penaltyGiven: [ClubEventDetail];
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
        bothTeamsToScore : BothTeamsToScoreDetail;
        halfTimeFullTimeResult : HalfTimeFullTimeResultDetail;
        bothTeamsToScoreAndWinner : BothTeamsToScoreAndWinnerDetail;
    };

    public type CorrectResultDetail = {
        matchResult: MatchResult;
    };

    public type ClubEventDetail = {
        teamId: FootballTypes.ClubId;
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

    public type BothTeamsToScoreDetail = {
        prediction: Bool;
    };

    public type HalfTimeFullTimeResultDetail = {
        halfTimeResult: MatchResult;
        fullTimeResult: MatchResult;
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
        #PenaltyGiven;
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
        #AnytimeGoalscorer: [PlayerEventDetail];
        #YellowCard: [PlayerEventDetail];
        #RedCard: [PlayerEventDetail];
        #PenaltyGiven: [PlayerEventDetail];
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
        #BothTeamsToScore : BothTeamsToScoreDetail;
        #HalfTimeFullTimeResult : HalfTimeFullTimeResultDetail;
        #BothTeamsToScoreAndWinner : BothTeamsToScoreAndWinnerDetail;
    };

    



};
