export const idlFactory = ({ IDL }) => {
  const Error = IDL.Variant({
    'DecodeError' : IDL.Null,
    'NotAllowed' : IDL.Null,
    'NotFound' : IDL.Null,
    'NotAuthorized' : IDL.Null,
    'InvalidData' : IDL.Null,
    'AlreadyExists' : IDL.Null,
    'CanisterCreateError' : IDL.Null,
    'CanisterFull' : IDL.Null,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : Error });
  const GameweekNumber = IDL.Nat8;
  const LeagueId = IDL.Nat16;
  const FixtureStatusType = IDL.Variant({
    'Unplayed' : IDL.Null,
    'Finalised' : IDL.Null,
    'Active' : IDL.Null,
    'Complete' : IDL.Null,
  });
  const SeasonId = IDL.Nat16;
  const ClubId = IDL.Nat16;
  const FixtureId = IDL.Nat32;
  const PlayerEventType = IDL.Variant({
    'PenaltyMissed' : IDL.Null,
    'Goal' : IDL.Null,
    'GoalConceded' : IDL.Null,
    'Appearance' : IDL.Null,
    'PenaltySaved' : IDL.Null,
    'RedCard' : IDL.Null,
    'KeeperSave' : IDL.Null,
    'CleanSheet' : IDL.Null,
    'YellowCard' : IDL.Null,
    'GoalAssisted' : IDL.Null,
    'OwnGoal' : IDL.Null,
    'HighestScoringPlayer' : IDL.Null,
  });
  const PlayerEventData = IDL.Record({
    'fixtureId' : FixtureId,
    'clubId' : ClubId,
    'playerId' : IDL.Nat16,
    'eventStartMinute' : IDL.Nat8,
    'eventEndMinute' : IDL.Nat8,
    'eventType' : PlayerEventType,
  });
  const FixtureDTO = IDL.Record({
    'id' : IDL.Nat32,
    'status' : FixtureStatusType,
    'highestScoringPlayerId' : IDL.Nat16,
    'seasonId' : SeasonId,
    'awayClubId' : ClubId,
    'events' : IDL.Vec(PlayerEventData),
    'homeClubId' : ClubId,
    'kickOff' : IDL.Int,
    'homeGoals' : IDL.Nat8,
    'gameweek' : GameweekNumber,
    'awayGoals' : IDL.Nat8,
  });
  const AddInitialFixturesDTO = IDL.Record({
    'seasonFixtures' : IDL.Vec(FixtureDTO),
  });
  const ShirtType = IDL.Variant({ 'Filled' : IDL.Null, 'Striped' : IDL.Null });
  const CreateClubDTO = IDL.Record({
    'secondaryColourHex' : IDL.Text,
    'name' : IDL.Text,
    'friendlyName' : IDL.Text,
    'thirdColourHex' : IDL.Text,
    'abbreviatedName' : IDL.Text,
    'shirtType' : ShirtType,
    'primaryColourHex' : IDL.Text,
    'leagueId' : LeagueId,
  });
  const Gender = IDL.Variant({ 'Male' : IDL.Null, 'Female' : IDL.Null });
  const CountryId = IDL.Nat16;
  const CreateLeagueDTO = IDL.Record({
    'logo' : IDL.Vec(IDL.Nat8),
    'name' : IDL.Text,
    'teamCount' : IDL.Nat8,
    'relatedGender' : Gender,
    'countryId' : CountryId,
    'abbreviation' : IDL.Text,
    'governingBody' : IDL.Text,
    'formed' : IDL.Int,
  });
  const PlayerPosition = IDL.Variant({
    'Goalkeeper' : IDL.Null,
    'Midfielder' : IDL.Null,
    'Forward' : IDL.Null,
    'Defender' : IDL.Null,
  });
  const CreatePlayerDTO = IDL.Record({
    'clubId' : ClubId,
    'valueQuarterMillions' : IDL.Nat16,
    'dateOfBirth' : IDL.Int,
    'nationality' : CountryId,
    'shirtNumber' : IDL.Nat8,
    'position' : PlayerPosition,
    'lastName' : IDL.Text,
    'firstName' : IDL.Text,
  });
  const LoanPlayerDTO = IDL.Record({
    'loanEndDate' : IDL.Int,
    'playerId' : ClubId,
    'loanClubId' : ClubId,
    'loanLeagueId' : LeagueId,
  });
  const MoveFixtureDTO = IDL.Record({
    'fixtureId' : FixtureId,
    'updatedFixtureGameweek' : GameweekNumber,
    'updatedFixtureDate' : IDL.Int,
    'seasonId' : SeasonId,
    'leagueId' : LeagueId,
  });
  const PostponeFixtureDTO = IDL.Record({
    'fixtureId' : FixtureId,
    'seasonId' : SeasonId,
    'leagueId' : LeagueId,
  });
  const PromoteClubDTO = IDL.Record({
    'secondaryColourHex' : IDL.Text,
    'name' : IDL.Text,
    'friendlyName' : IDL.Text,
    'thirdColourHex' : IDL.Text,
    'abbreviatedName' : IDL.Text,
    'shirtType' : ShirtType,
    'primaryColourHex' : IDL.Text,
  });
  const RecallPlayerDTO = IDL.Record({
    'recallFromLeagueId' : LeagueId,
    'playerId' : ClubId,
  });
  const RemoveClubDTO = IDL.Record({
    'clubId' : ClubId,
    'leagueId' : LeagueId,
  });
  const RescheduleFixtureDTO = IDL.Record({
    'postponedFixtureId' : FixtureId,
    'updatedFixtureGameweek' : GameweekNumber,
    'updatedFixtureDate' : IDL.Int,
  });
  const RetirePlayerDTO = IDL.Record({
    'playerId' : ClubId,
    'retirementDate' : IDL.Int,
  });
  const RevaluePlayerDownDTO = IDL.Record({
    'playerId' : ClubId,
    'seasonId' : SeasonId,
    'gameweek' : GameweekNumber,
  });
  const RevaluePlayerUpDTO = IDL.Record({
    'playerId' : ClubId,
    'seasonId' : SeasonId,
    'gameweek' : GameweekNumber,
  });
  const SetFreeAgentDTO = IDL.Record({
    'playerId' : ClubId,
    'leagueId' : LeagueId,
  });
  const SetPlayerInjuryDTO = IDL.Record({
    'playerId' : ClubId,
    'description' : IDL.Text,
    'expectedEndDate' : IDL.Int,
  });
  const SubmitFixtureDataDTO = IDL.Record({
    'fixtureId' : FixtureId,
    'seasonId' : SeasonId,
    'gameweek' : GameweekNumber,
    'playerEventData' : IDL.Vec(PlayerEventData),
    'leagueId' : LeagueId,
  });
  const TransferPlayerDTO = IDL.Record({
    'clubId' : ClubId,
    'newLeagueId' : LeagueId,
    'playerId' : ClubId,
    'newShirtNumber' : IDL.Nat8,
    'newClubId' : ClubId,
    'leagueId' : LeagueId,
  });
  const UnretirePlayerDTO = IDL.Record({
    'playerId' : ClubId,
    'leagueId' : LeagueId,
  });
  const UpdateClubDTO = IDL.Record({
    'clubId' : ClubId,
    'secondaryColourHex' : IDL.Text,
    'name' : IDL.Text,
    'friendlyName' : IDL.Text,
    'thirdColourHex' : IDL.Text,
    'abbreviatedName' : IDL.Text,
    'shirtType' : ShirtType,
    'primaryColourHex' : IDL.Text,
  });
  const UpdateLeagueDTO = IDL.Record({
    'logo' : IDL.Vec(IDL.Nat8),
    'name' : IDL.Text,
    'teamCount' : IDL.Nat8,
    'relatedGender' : Gender,
    'countryId' : CountryId,
    'abbreviation' : IDL.Text,
    'governingBody' : IDL.Text,
    'leagueId' : LeagueId,
    'formed' : IDL.Int,
  });
  const UpdatePlayerDTO = IDL.Record({
    'dateOfBirth' : IDL.Int,
    'playerId' : ClubId,
    'nationality' : CountryId,
    'shirtNumber' : IDL.Nat8,
    'position' : PlayerPosition,
    'lastName' : IDL.Text,
    'firstName' : IDL.Text,
  });
  const PrincipalId = IDL.Text;
  const GetBetsDTO = IDL.Record({ 'principalId' : PrincipalId });
  const SelectionStatus = IDL.Variant({
    'Void' : IDL.Null,
    'Unsettled' : IDL.Null,
    'Settled' : IDL.Null,
  });
  const BetResult = IDL.Variant({
    'Won' : IDL.Null,
    'Lost' : IDL.Null,
    'Open' : IDL.Null,
  });
  const BetType = IDL.Variant({
    'SevenFold' : IDL.Null,
    'Patent' : IDL.Null,
    'FiveFold' : IDL.Null,
    'FourFold' : IDL.Null,
    'Goliath' : IDL.Null,
    'Double' : IDL.Null,
    'Lucky15' : IDL.Null,
    'Lucky31' : IDL.Null,
    'Lucky63' : IDL.Null,
    'SuperHeinz' : IDL.Null,
    'Treble' : IDL.Null,
    'Trixie' : IDL.Null,
    'TenFold' : IDL.Null,
    'EightFold' : IDL.Null,
    'Heinz' : IDL.Null,
    'Yankee' : IDL.Null,
    'SixFold' : IDL.Null,
    'NineFold' : IDL.Null,
    'Canadian' : IDL.Null,
    'Single' : IDL.Null,
  });
  const PlayerId = IDL.Nat16;
  const PlayerEventDetail = IDL.Record({
    'clubId' : ClubId,
    'playerId' : PlayerId,
  });
  const ClubEventDetail = IDL.Record({ 'clubId' : ClubId });
  const MatchResult = IDL.Variant({
    'HomeWin' : IDL.Null,
    'Draw' : IDL.Null,
    'AwayWin' : IDL.Null,
  });
  const CorrectResultDetail = IDL.Record({ 'matchResult' : MatchResult });
  const ScoreDetail = IDL.Record({
    'homeGoals' : IDL.Nat8,
    'awayGoals' : IDL.Nat8,
  });
  const BothTeamsToScoreDetail = IDL.Record({ 'bothTeamsToScore' : IDL.Bool });
  const HalfTimeFullTimeResultDetail = IDL.Record({
    'fullTimeResult' : MatchResult,
    'halfTimeResult' : MatchResult,
  });
  const PlayerGroupEventDetail = IDL.Record({
    'clubId' : ClubId,
    'playerId' : PlayerId,
  });
  const BothTeamsToScoreAndWinnerDetail = IDL.Record({
    'bothTeamsToScore' : IDL.Bool,
    'matchResult' : MatchResult,
  });
  const SelectionDetail = IDL.Variant({
    'MissPenalty' : PlayerEventDetail,
    'LastAssist' : PlayerEventDetail,
    'PenaltyMissed' : ClubEventDetail,
    'FirstAssist' : PlayerEventDetail,
    'AnytimeGoalscorer' : PlayerEventDetail,
    'CorrectResult' : CorrectResultDetail,
    'HalfTimeScore' : ScoreDetail,
    'BothTeamsToScore' : BothTeamsToScoreDetail,
    'HalfTimeFullTimeResult' : HalfTimeFullTimeResultDetail,
    'LastGoalscorer' : PlayerEventDetail,
    'RedCard' : PlayerEventDetail,
    'ScoreHatrick' : PlayerGroupEventDetail,
    'CorrectScore' : ScoreDetail,
    'AnytimeAssist' : PlayerEventDetail,
    'YellowCard' : PlayerEventDetail,
    'BothTeamsToScoreAndWinner' : BothTeamsToScoreAndWinnerDetail,
    'FirstGoalscorer' : PlayerEventDetail,
    'ScoreBrace' : PlayerGroupEventDetail,
  });
  const Category = IDL.Variant({
    'MissPenalty' : IDL.Null,
    'LastAssist' : IDL.Null,
    'PenaltyMissed' : IDL.Null,
    'FirstAssist' : IDL.Null,
    'AnytimeGoalscorer' : IDL.Null,
    'CorrectResult' : IDL.Null,
    'HalfTimeScore' : IDL.Null,
    'BothTeamsToScore' : IDL.Null,
    'HalfTimeFullTimeResult' : IDL.Null,
    'LastGoalscorer' : IDL.Null,
    'RedCard' : IDL.Null,
    'ScoreHatrick' : IDL.Null,
    'CorrectScore' : IDL.Null,
    'AnytimeAssist' : IDL.Null,
    'YellowCard' : IDL.Null,
    'BothTeamsToScoreAndWinner' : IDL.Null,
    'FirstGoalscorer' : IDL.Null,
    'ScoreBrace' : IDL.Null,
  });
  const Selection = IDL.Record({
    'status' : SelectionStatus,
    'result' : BetResult,
    'fixtureId' : FixtureId,
    'winnings' : IDL.Float64,
    'odds' : IDL.Float64,
    'stake' : IDL.Nat64,
    'expectedReturns' : IDL.Nat64,
    'selectionDetail' : SelectionDetail,
    'leagueId' : LeagueId,
    'selectionType' : Category,
  });
  const BetSlip = IDL.Record({
    'id' : IDL.Nat,
    'status' : SelectionStatus,
    'result' : BetResult,
    'betType' : BetType,
    'totalWinnings' : IDL.Nat64,
    'totalStake' : IDL.Nat64,
    'placedBy' : PrincipalId,
    'placedOn' : IDL.Int,
    'selections' : IDL.Vec(Selection),
    'expectedReturns' : IDL.Nat64,
    'settledOn' : IDL.Int,
  });
  const Result_20 = IDL.Variant({ 'ok' : IDL.Vec(BetSlip), 'err' : Error });
  const HomePageFixtureDTO = IDL.Record({
    'fixtureId' : FixtureId,
    'homeOdds' : IDL.Float64,
    'drawOdds' : IDL.Float64,
    'awayOdds' : IDL.Float64,
    'gameweek' : GameweekNumber,
    'leagueId' : LeagueId,
  });
  const Result_19 = IDL.Variant({
    'ok' : IDL.Vec(HomePageFixtureDTO),
    'err' : Error,
  });
  const CountryDTO = IDL.Record({
    'id' : CountryId,
    'code' : IDL.Text,
    'name' : IDL.Text,
  });
  const Result_18 = IDL.Variant({ 'ok' : IDL.Vec(CountryDTO), 'err' : Error });
  const DataHash = IDL.Record({ 'hash' : IDL.Text, 'category' : IDL.Text });
  const Result_17 = IDL.Variant({ 'ok' : IDL.Vec(DataHash), 'err' : Error });
  const DataHashDTO = IDL.Record({ 'hash' : IDL.Text, 'category' : IDL.Text });
  const Result_16 = IDL.Variant({ 'ok' : IDL.Vec(DataHashDTO), 'err' : Error });
  const Result_15 = IDL.Variant({ 'ok' : IDL.Vec(FixtureDTO), 'err' : Error });
  const ClubDTO = IDL.Record({
    'id' : ClubId,
    'secondaryColourHex' : IDL.Text,
    'name' : IDL.Text,
    'friendlyName' : IDL.Text,
    'thirdColourHex' : IDL.Text,
    'abbreviatedName' : IDL.Text,
    'shirtType' : ShirtType,
    'primaryColourHex' : IDL.Text,
  });
  const Result_14 = IDL.Variant({ 'ok' : IDL.Vec(ClubDTO), 'err' : Error });
  const PlayerStatus = IDL.Variant({
    'OnLoan' : IDL.Null,
    'Active' : IDL.Null,
    'FreeAgent' : IDL.Null,
    'Retired' : IDL.Null,
  });
  const PlayerDTO = IDL.Record({
    'id' : IDL.Nat16,
    'status' : PlayerStatus,
    'clubId' : ClubId,
    'parentClubId' : ClubId,
    'valueQuarterMillions' : IDL.Nat16,
    'dateOfBirth' : IDL.Int,
    'nationality' : CountryId,
    'currentLoanEndDate' : IDL.Int,
    'shirtNumber' : IDL.Nat8,
    'parentLeagueId' : LeagueId,
    'position' : PlayerPosition,
    'lastName' : IDL.Text,
    'leagueId' : LeagueId,
    'firstName' : IDL.Text,
  });
  const Result_13 = IDL.Variant({ 'ok' : IDL.Vec(PlayerDTO), 'err' : Error });
  const CalendarMonth = IDL.Nat8;
  const LeagueStatus = IDL.Record({
    'transferWindowEndMonth' : IDL.Nat8,
    'transferWindowEndDay' : IDL.Nat8,
    'transferWindowStartMonth' : IDL.Nat8,
    'transferWindowActive' : IDL.Bool,
    'totalGameweeks' : IDL.Nat8,
    'completedGameweek' : GameweekNumber,
    'transferWindowStartDay' : IDL.Nat8,
    'unplayedGameweek' : GameweekNumber,
    'activeMonth' : CalendarMonth,
    'activeSeasonId' : SeasonId,
    'activeGameweek' : GameweekNumber,
    'leagueId' : LeagueId,
    'seasonActive' : IDL.Bool,
  });
  const Result_12 = IDL.Variant({ 'ok' : LeagueStatus, 'err' : Error });
  const FootballLeagueDTO = IDL.Record({
    'id' : LeagueId,
    'logo' : IDL.Vec(IDL.Nat8),
    'name' : IDL.Text,
    'teamCount' : IDL.Nat8,
    'relatedGender' : Gender,
    'countryId' : CountryId,
    'abbreviation' : IDL.Text,
    'governingBody' : IDL.Text,
    'formed' : IDL.Int,
  });
  const Result_11 = IDL.Variant({
    'ok' : IDL.Vec(FootballLeagueDTO),
    'err' : Error,
  });
  const LoanedPlayerDTO = IDL.Record({
    'id' : IDL.Nat16,
    'status' : PlayerStatus,
    'clubId' : ClubId,
    'parentClubId' : ClubId,
    'valueQuarterMillions' : IDL.Nat16,
    'dateOfBirth' : IDL.Int,
    'nationality' : CountryId,
    'currentLoanEndDate' : IDL.Int,
    'shirtNumber' : IDL.Nat8,
    'parentLeagueId' : LeagueId,
    'position' : PlayerPosition,
    'lastName' : IDL.Text,
    'leagueId' : LeagueId,
    'firstName' : IDL.Text,
  });
  const Result_10 = IDL.Variant({
    'ok' : IDL.Vec(LoanedPlayerDTO),
    'err' : Error,
  });
  const PlayerSelectionOdds = IDL.Record({
    'playerId' : PlayerId,
    'odds' : IDL.Float64,
  });
  const ScoreSelectionOdds = IDL.Record({
    'odds' : IDL.Float64,
    'homeGoals' : IDL.Nat8,
    'awayGoals' : IDL.Nat8,
  });
  const YesNoSelectionOdds = IDL.Record({
    'noOdds' : IDL.Float64,
    'yesOdds' : IDL.Float64,
  });
  const TeamSelectionOdds = IDL.Record({
    'homeOdds' : IDL.Float64,
    'drawOdds' : IDL.Float64,
    'awayOdds' : IDL.Float64,
  });
  const MissPenaltyOdds = IDL.Record({
    'homeTeam' : IDL.Float64,
    'awayTeam' : IDL.Float64,
  });
  const OverUnderSelection = IDL.Record({
    'odds' : IDL.Float64,
    'margin' : IDL.Float64,
  });
  const OverUnderSelectionOdds = IDL.Record({
    'overOdds' : IDL.Vec(OverUnderSelection),
    'underOdds' : IDL.Vec(OverUnderSelection),
  });
  const HalfTimeFullTimeOdds = IDL.Record({
    'firstHalfResult' : MatchResult,
    'odds' : IDL.Float64,
    'secondHalfResult' : MatchResult,
  });
  const ResultAndYesNoSelectionOdds = IDL.Record({
    'result' : MatchResult,
    'odds' : IDL.Float64,
    'isYes' : IDL.Bool,
  });
  const MatchOddsDTO = IDL.Record({
    'fixtureId' : FixtureId,
    'lastAssist' : IDL.Vec(PlayerSelectionOdds),
    'correctScores' : IDL.Vec(ScoreSelectionOdds),
    'bothTeamsToScore' : YesNoSelectionOdds,
    'yellowCards' : IDL.Vec(PlayerSelectionOdds),
    'lastGoalscorers' : IDL.Vec(PlayerSelectionOdds),
    'halfTimeScores' : IDL.Vec(ScoreSelectionOdds),
    'anytimeAssist' : IDL.Vec(PlayerSelectionOdds),
    'penaltyMissers' : IDL.Vec(PlayerSelectionOdds),
    'redCards' : IDL.Vec(PlayerSelectionOdds),
    'anytimeScorers' : IDL.Vec(PlayerSelectionOdds),
    'correctResults' : TeamSelectionOdds,
    'penaltyMissed' : MissPenaltyOdds,
    'scoresHatTrick' : IDL.Vec(PlayerSelectionOdds),
    'scoresBrace' : IDL.Vec(PlayerSelectionOdds),
    'goalsOverUnder' : OverUnderSelectionOdds,
    'firstAssisters' : IDL.Vec(PlayerSelectionOdds),
    'leagueId' : LeagueId,
    'firstGoalscorers' : IDL.Vec(PlayerSelectionOdds),
    'halfTimeFullTimeResult' : IDL.Vec(HalfTimeFullTimeOdds),
    'bothTeamsToScoreAndWinner' : IDL.Vec(ResultAndYesNoSelectionOdds),
  });
  const Result_9 = IDL.Variant({ 'ok' : MatchOddsDTO, 'err' : Error });
  const GameweekFiltersDTO = IDL.Record({
    'seasonId' : SeasonId,
    'gameweek' : GameweekNumber,
  });
  const InjuryHistory = IDL.Record({
    'description' : IDL.Text,
    'injuryStartDate' : IDL.Int,
    'expectedEndDate' : IDL.Int,
  });
  const PlayerGameweekDTO = IDL.Record({
    'fixtureId' : FixtureId,
    'events' : IDL.Vec(PlayerEventData),
    'number' : IDL.Nat8,
    'points' : IDL.Int16,
  });
  const ValueHistory = IDL.Record({
    'oldValue' : IDL.Nat16,
    'changedOn' : IDL.Int,
    'newValue' : IDL.Nat16,
  });
  const PlayerDetailDTO = IDL.Record({
    'id' : PlayerId,
    'status' : PlayerStatus,
    'clubId' : ClubId,
    'parentClubId' : ClubId,
    'valueQuarterMillions' : IDL.Nat16,
    'dateOfBirth' : IDL.Int,
    'injuryHistory' : IDL.Vec(InjuryHistory),
    'seasonId' : SeasonId,
    'gameweeks' : IDL.Vec(PlayerGameweekDTO),
    'nationality' : CountryId,
    'retirementDate' : IDL.Int,
    'valueHistory' : IDL.Vec(ValueHistory),
    'latestInjuryEndDate' : IDL.Int,
    'shirtNumber' : IDL.Nat8,
    'position' : PlayerPosition,
    'lastName' : IDL.Text,
    'firstName' : IDL.Text,
  });
  const Result_8 = IDL.Variant({ 'ok' : PlayerDetailDTO, 'err' : Error });
  const ProfileDTO = IDL.Record({
    'username' : IDL.Text,
    'maxBetLimit' : IDL.Nat64,
    'monthlyBetLimit' : IDL.Nat64,
    'withdrawalAddress' : IDL.Text,
    'profilePictureExtension' : IDL.Text,
    'accountBalance' : IDL.Nat64,
    'kycApprovalDate' : IDL.Int,
    'joinedDate' : IDL.Int,
    'accountOnPause' : IDL.Bool,
    'termsAcceptedDate' : IDL.Int,
    'kycComplete' : IDL.Bool,
    'kycRef' : IDL.Text,
    'profilePicture' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'kycSubmissionDate' : IDL.Int,
    'principalId' : PrincipalId,
    'monthlyBetTotal' : IDL.Nat64,
  });
  const Result_7 = IDL.Variant({ 'ok' : ProfileDTO, 'err' : Error });
  const SeasonDTO = IDL.Record({
    'id' : SeasonId,
    'name' : IDL.Text,
    'year' : IDL.Nat16,
  });
  const Result_6 = IDL.Variant({ 'ok' : IDL.Vec(SeasonDTO), 'err' : Error });
  const SystemStateDTO = IDL.Record({
    'version' : IDL.Text,
    'onHold' : IDL.Bool,
  });
  const Result_5 = IDL.Variant({ 'ok' : SystemStateDTO, 'err' : Error });
  const TimerInfo = IDL.Record({
    'id' : IDL.Int,
    'callbackName' : IDL.Text,
    'triggerTime' : IDL.Int,
  });
  const Result_4 = IDL.Variant({ 'ok' : IDL.Vec(TimerInfo), 'err' : Error });
  const UserDTO = IDL.Record({
    'kycApprovalDate' : IDL.Int,
    'joinedDate' : IDL.Int,
    'termsAcceptedDate' : IDL.Int,
    'kycComplete' : IDL.Bool,
    'kycRef' : IDL.Text,
    'kycSubmissionDate' : IDL.Int,
    'principalId' : PrincipalId,
  });
  const UserAuditDTO = IDL.Record({
    'date' : IDL.Int,
    'offset' : IDL.Nat,
    'users' : IDL.Vec(UserDTO),
  });
  const Result_3 = IDL.Variant({ 'ok' : UserAuditDTO, 'err' : Error });
  const Result_2 = IDL.Variant({ 'ok' : IDL.Bool, 'err' : Error });
  const ShuftiAcceptedResponse = IDL.Record({
    'reference' : IDL.Text,
    'event' : IDL.Text,
  });
  const ShuftiRejectedResponse = IDL.Record({});
  const ShuftiResponse = IDL.Variant({
    'ShuftiAcceptedResponse' : ShuftiAcceptedResponse,
    'ShuftiRejectedResponse' : ShuftiRejectedResponse,
  });
  const PauseAccountDTO = IDL.Record({
    'pauseDays' : IDL.Nat,
    'principalId' : PrincipalId,
  });
  const SubmitBetslipDTO = IDL.Record({
    'expectedReturn' : IDL.Nat64,
    'seasonId' : SeasonId,
    'totalStake' : IDL.Nat64,
    'principalId' : PrincipalId,
    'leagueId' : LeagueId,
  });
  const Result_1 = IDL.Variant({ 'ok' : BetSlip, 'err' : Error });
  const SetMaxBetLimit = IDL.Record({
    'maxBetLimit' : IDL.Nat64,
    'principalId' : PrincipalId,
  });
  const SetMonthlyBetLimitDTO = IDL.Record({
    'monthlyBetLimit' : IDL.Nat64,
    'principalId' : PrincipalId,
  });
  const UpdateProfilePictureDTO = IDL.Record({
    'profilePictureExtension' : IDL.Text,
    'profilePicture' : IDL.Vec(IDL.Nat8),
    'principalId' : PrincipalId,
  });
  const UpdateAppStatusDTO = IDL.Record({
    'version' : IDL.Text,
    'onHold' : IDL.Bool,
  });
  const UpdateUsernameDTO = IDL.Record({
    'username' : IDL.Text,
    'principalId' : PrincipalId,
  });
  const UpdateWithdrawalAddressDTO = IDL.Record({
    'withdrawalAddress' : IDL.Text,
    'principalId' : PrincipalId,
  });
  const RustResult = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text });
  return IDL.Service({
    'agreeTerms' : IDL.Func([], [Result], []),
    'calculateGameweekScores' : IDL.Func([IDL.Text], [Result], []),
    'calculateLeaderboards' : IDL.Func([IDL.Text], [Result], []),
    'calculateWeeklyRewards' : IDL.Func(
        [IDL.Text, GameweekNumber],
        [Result],
        [],
      ),
    'executeAddInitialFixtures' : IDL.Func(
        [LeagueId, AddInitialFixturesDTO],
        [],
        [],
      ),
    'executeCreateClub' : IDL.Func([CreateClubDTO], [], []),
    'executeCreateLeague' : IDL.Func([CreateLeagueDTO], [], []),
    'executeCreatePlayer' : IDL.Func([LeagueId, CreatePlayerDTO], [], []),
    'executeLoanPlayer' : IDL.Func([LeagueId, LoanPlayerDTO], [], []),
    'executeMoveFixture' : IDL.Func([MoveFixtureDTO], [], []),
    'executePostponeFixture' : IDL.Func([PostponeFixtureDTO], [], []),
    'executePromoteClub' : IDL.Func([LeagueId, PromoteClubDTO], [], []),
    'executeRecallPlayer' : IDL.Func([RecallPlayerDTO], [], []),
    'executeRemoveClub' : IDL.Func([RemoveClubDTO], [], []),
    'executeRescheduleFixture' : IDL.Func(
        [LeagueId, RescheduleFixtureDTO],
        [],
        [],
      ),
    'executeRetirePlayer' : IDL.Func([LeagueId, RetirePlayerDTO], [], []),
    'executeRevaluePlayerDown' : IDL.Func(
        [LeagueId, RevaluePlayerDownDTO],
        [],
        [],
      ),
    'executeRevaluePlayerUp' : IDL.Func([LeagueId, RevaluePlayerUpDTO], [], []),
    'executeSetFreeAgent' : IDL.Func([LeagueId, SetFreeAgentDTO], [], []),
    'executeSetPlayerInjury' : IDL.Func([LeagueId, SetPlayerInjuryDTO], [], []),
    'executeSubmitFixtureData' : IDL.Func([SubmitFixtureDataDTO], [], []),
    'executeTransferPlayer' : IDL.Func([LeagueId, TransferPlayerDTO], [], []),
    'executeUnretirePlayer' : IDL.Func([LeagueId, UnretirePlayerDTO], [], []),
    'executeUpdateClub' : IDL.Func([LeagueId, UpdateClubDTO], [], []),
    'executeUpdateLeague' : IDL.Func([UpdateLeagueDTO], [], []),
    'executeUpdatePlayer' : IDL.Func([LeagueId, UpdatePlayerDTO], [], []),
    'getBets' : IDL.Func([GetBetsDTO], [Result_20], []),
    'getBettableHomepageFixtures' : IDL.Func(
        [LeagueId],
        [Result_19],
        ['query'],
      ),
    'getCountries' : IDL.Func([], [Result_18], ['query']),
    'getDataHashForCategory' : IDL.Func(
        [LeagueId, IDL.Text],
        [Result_17],
        ['composite_query'],
      ),
    'getDataHashes' : IDL.Func([], [Result_16], ['composite_query']),
    'getFixtures' : IDL.Func([LeagueId], [Result_15], ['composite_query']),
    'getLeagueClubs' : IDL.Func([LeagueId], [Result_14], ['composite_query']),
    'getLeaguePlayers' : IDL.Func([LeagueId], [Result_13], ['composite_query']),
    'getLeagueStatus' : IDL.Func([LeagueId], [Result_12], ['composite_query']),
    'getLeagues' : IDL.Func([], [Result_11], ['composite_query']),
    'getLoanedPlayers' : IDL.Func([LeagueId], [Result_10], ['composite_query']),
    'getMatchOdds' : IDL.Func([LeagueId, FixtureId], [Result_9], ['query']),
    'getPlayerDetailsForGameweek' : IDL.Func(
        [LeagueId, GameweekFiltersDTO],
        [Result_8],
        ['composite_query'],
      ),
    'getProfile' : IDL.Func([], [Result_7], []),
    'getSeasons' : IDL.Func([LeagueId], [Result_6], ['composite_query']),
    'getSystemState' : IDL.Func([IDL.Text], [Result_5], ['composite_query']),
    'getTimers' : IDL.Func([], [Result_4], ['composite_query']),
    'getUserAudit' : IDL.Func([IDL.Nat], [Result_3], []),
    'isAdmin' : IDL.Func([], [Result_2], []),
    'isAuditor' : IDL.Func([], [Result_2], []),
    'isDataManager' : IDL.Func([], [Result_2], []),
    'kycVerificationCallback' : IDL.Func([ShuftiResponse], [Result], []),
    'pauseAccount' : IDL.Func([PauseAccountDTO], [Result], []),
    'payWeeklyRewards' : IDL.Func([IDL.Text, GameweekNumber], [Result], []),
    'placeBet' : IDL.Func([SubmitBetslipDTO], [Result_1], []),
    'refreshLeagueHashes' : IDL.Func([], [Result], []),
    'setMaxBetLimit' : IDL.Func([SetMaxBetLimit], [Result], []),
    'setMonthlyBetLimit' : IDL.Func([SetMonthlyBetLimitDTO], [Result], []),
    'snapshotManagers' : IDL.Func([IDL.Text], [Result], []),
    'storeKYCReference' : IDL.Func([IDL.Text], [], []),
    'updateBettingOdds' : IDL.Func([LeagueId], [Result], []),
    'updateProfilePicture' : IDL.Func([UpdateProfilePictureDTO], [Result], []),
    'updateSystemState' : IDL.Func(
        [IDL.Text, UpdateAppStatusDTO],
        [Result],
        [],
      ),
    'updateUsername' : IDL.Func([UpdateUsernameDTO], [Result], []),
    'updateWithdrawalAddress' : IDL.Func(
        [UpdateWithdrawalAddressDTO],
        [Result],
        [],
      ),
    'validateAddInitialFixtures' : IDL.Func(
        [AddInitialFixturesDTO],
        [RustResult],
        ['query'],
      ),
    'validateCreateLeague' : IDL.Func(
        [CreateLeagueDTO],
        [RustResult],
        ['query'],
      ),
    'validateCreatePlayer' : IDL.Func(
        [CreatePlayerDTO],
        [RustResult],
        ['query'],
      ),
    'validateLoanPlayer' : IDL.Func([LoanPlayerDTO], [RustResult], ['query']),
    'validateMoveFixture' : IDL.Func([MoveFixtureDTO], [RustResult], ['query']),
    'validatePostponeFixture' : IDL.Func(
        [PostponeFixtureDTO],
        [RustResult],
        ['query'],
      ),
    'validatePromoteClub' : IDL.Func([PromoteClubDTO], [RustResult], ['query']),
    'validateRecallPlayer' : IDL.Func(
        [RecallPlayerDTO],
        [RustResult],
        ['query'],
      ),
    'validateRescheduleFixture' : IDL.Func(
        [RescheduleFixtureDTO],
        [RustResult],
        ['query'],
      ),
    'validateRetirePlayer' : IDL.Func(
        [RetirePlayerDTO],
        [RustResult],
        ['query'],
      ),
    'validateRevaluePlayerDown' : IDL.Func(
        [RevaluePlayerDownDTO],
        [RustResult],
        ['query'],
      ),
    'validateRevaluePlayerUp' : IDL.Func(
        [RevaluePlayerUpDTO],
        [RustResult],
        ['query'],
      ),
    'validateSetFreeAgent' : IDL.Func(
        [TransferPlayerDTO],
        [RustResult],
        ['query'],
      ),
    'validateSetPlayerInjury' : IDL.Func(
        [SetPlayerInjuryDTO],
        [RustResult],
        ['query'],
      ),
    'validateSubmitFixtureData' : IDL.Func(
        [SubmitFixtureDataDTO],
        [RustResult],
        ['query'],
      ),
    'validateTransferPlayer' : IDL.Func(
        [TransferPlayerDTO],
        [RustResult],
        ['query'],
      ),
    'validateUnretirePlayer' : IDL.Func(
        [UnretirePlayerDTO],
        [RustResult],
        ['query'],
      ),
    'validateUpdateClub' : IDL.Func([UpdateClubDTO], [RustResult], ['query']),
    'validateUpdateLeague' : IDL.Func(
        [UpdateLeagueDTO],
        [RustResult],
        ['query'],
      ),
    'validateUpdatePlayer' : IDL.Func(
        [UpdatePlayerDTO],
        [RustResult],
        ['query'],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
