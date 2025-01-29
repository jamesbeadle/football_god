export const idlFactory = ({ IDL }) => {
  const List = IDL.Rec();
  const List_1 = IDL.Rec();
  const List_2 = IDL.Rec();
  const List_3 = IDL.Rec();
  const List_4 = IDL.Rec();
  const List_5 = IDL.Rec();
  const ShirtType = IDL.Variant({ Filled: IDL.Null, Striped: IDL.Null });
  const LeagueId = IDL.Nat16;
  const CreateClubDTO = IDL.Record({
    secondaryColourHex: IDL.Text,
    name: IDL.Text,
    friendlyName: IDL.Text,
    thirdColourHex: IDL.Text,
    abbreviatedName: IDL.Text,
    shirtType: ShirtType,
    primaryColourHex: IDL.Text,
    leagueId: LeagueId,
  });
  const Error = IDL.Variant({
    DecodeError: IDL.Null,
    NotAllowed: IDL.Null,
    NotFound: IDL.Null,
    NotAuthorized: IDL.Null,
    InvalidData: IDL.Null,
    AlreadyExists: IDL.Null,
    CanisterCreateError: IDL.Null,
    CanisterFull: IDL.Null,
  });
  const Result = IDL.Variant({ ok: IDL.Null, err: Error });
  const Gender = IDL.Variant({ Male: IDL.Null, Female: IDL.Null });
  const CountryId = IDL.Nat16;
  const CreateLeagueDTO = IDL.Record({
    logo: IDL.Vec(IDL.Nat8),
    name: IDL.Text,
    teamCount: IDL.Nat8,
    relatedGender: Gender,
    countryId: CountryId,
    abbreviation: IDL.Text,
    governingBody: IDL.Text,
    formed: IDL.Int,
  });
  const ClubId = IDL.Nat16;
  const PlayerPosition = IDL.Variant({
    Goalkeeper: IDL.Null,
    Midfielder: IDL.Null,
    Forward: IDL.Null,
    Defender: IDL.Null,
  });
  const CreatePlayerDTO = IDL.Record({
    clubId: ClubId,
    valueQuarterMillions: IDL.Nat16,
    dateOfBirth: IDL.Int,
    nationality: CountryId,
    shirtNumber: IDL.Nat8,
    position: PlayerPosition,
    lastName: IDL.Text,
    firstName: IDL.Text,
  });
  const SelectionStatus = IDL.Variant({
    Void: IDL.Null,
    Unsettled: IDL.Null,
    Settled: IDL.Null,
  });
  const BetResult = IDL.Variant({
    Won: IDL.Null,
    Lost: IDL.Null,
    Open: IDL.Null,
  });
  const FixtureId = IDL.Nat32;
  const PlayerId = IDL.Nat16;
  const PlayerEventDetail = IDL.Record({
    clubId: ClubId,
    playerId: PlayerId,
  });
  const ClubEventDetail = IDL.Record({ clubId: ClubId });
  const MatchResult = IDL.Variant({
    HomeWin: IDL.Null,
    Draw: IDL.Null,
    AwayWin: IDL.Null,
  });
  const CorrectResultDetail = IDL.Record({ matchResult: MatchResult });
  const ScoreDetail = IDL.Record({
    homeGoals: IDL.Nat8,
    awayGoals: IDL.Nat8,
  });
  const BothTeamsToScoreDetail = IDL.Record({ bothTeamsToScore: IDL.Bool });
  const HalfTimeFullTimeResultDetail = IDL.Record({
    fullTimeResult: MatchResult,
    halfTimeResult: MatchResult,
  });
  const PlayerGroupEventDetail = IDL.Record({
    clubId: ClubId,
    playerId: PlayerId,
  });
  const BothTeamsToScoreAndWinnerDetail = IDL.Record({
    bothTeamsToScore: IDL.Bool,
    matchResult: MatchResult,
  });
  const SelectionDetail = IDL.Variant({
    MissPenalty: PlayerEventDetail,
    LastAssist: PlayerEventDetail,
    PenaltyMissed: ClubEventDetail,
    FirstAssist: PlayerEventDetail,
    AnytimeGoalscorer: PlayerEventDetail,
    CorrectResult: CorrectResultDetail,
    HalfTimeScore: ScoreDetail,
    BothTeamsToScore: BothTeamsToScoreDetail,
    HalfTimeFullTimeResult: HalfTimeFullTimeResultDetail,
    LastGoalscorer: PlayerEventDetail,
    RedCard: PlayerEventDetail,
    ScoreHatrick: PlayerGroupEventDetail,
    CorrectScore: ScoreDetail,
    AnytimeAssist: PlayerEventDetail,
    YellowCard: PlayerEventDetail,
    BothTeamsToScoreAndWinner: BothTeamsToScoreAndWinnerDetail,
    FirstGoalscorer: PlayerEventDetail,
    ScoreBrace: PlayerGroupEventDetail,
  });
  const Category = IDL.Variant({
    MissPenalty: IDL.Null,
    LastAssist: IDL.Null,
    PenaltyMissed: IDL.Null,
    FirstAssist: IDL.Null,
    AnytimeGoalscorer: IDL.Null,
    CorrectResult: IDL.Null,
    HalfTimeScore: IDL.Null,
    BothTeamsToScore: IDL.Null,
    HalfTimeFullTimeResult: IDL.Null,
    LastGoalscorer: IDL.Null,
    RedCard: IDL.Null,
    ScoreHatrick: IDL.Null,
    CorrectScore: IDL.Null,
    AnytimeAssist: IDL.Null,
    YellowCard: IDL.Null,
    BothTeamsToScoreAndWinner: IDL.Null,
    FirstGoalscorer: IDL.Null,
    ScoreBrace: IDL.Null,
  });
  const Selection = IDL.Record({
    status: SelectionStatus,
    result: BetResult,
    fixtureId: FixtureId,
    winnings: IDL.Float64,
    odds: IDL.Float64,
    stake: IDL.Nat64,
    expectedReturns: IDL.Nat64,
    selectionDetail: SelectionDetail,
    leagueId: LeagueId,
    selectionType: Category,
  });
  const GetBetslipFixturesDTO = IDL.Record({
    selections: IDL.Vec(Selection),
  });
  const FixtureStatusType = IDL.Variant({
    Unplayed: IDL.Null,
    Finalised: IDL.Null,
    Active: IDL.Null,
    Complete: IDL.Null,
  });
  const SeasonId = IDL.Nat16;
  const PlayerEventType = IDL.Variant({
    PenaltyMissed: IDL.Null,
    Goal: IDL.Null,
    GoalConceded: IDL.Null,
    Appearance: IDL.Null,
    PenaltySaved: IDL.Null,
    RedCard: IDL.Null,
    KeeperSave: IDL.Null,
    CleanSheet: IDL.Null,
    YellowCard: IDL.Null,
    GoalAssisted: IDL.Null,
    OwnGoal: IDL.Null,
    HighestScoringPlayer: IDL.Null,
  });
  const PlayerEventData = IDL.Record({
    fixtureId: FixtureId,
    clubId: ClubId,
    playerId: IDL.Nat16,
    eventStartMinute: IDL.Nat8,
    eventEndMinute: IDL.Nat8,
    eventType: PlayerEventType,
  });
  const GameweekNumber = IDL.Nat8;
  const FixtureDTO = IDL.Record({
    id: IDL.Nat32,
    status: FixtureStatusType,
    highestScoringPlayerId: IDL.Nat16,
    seasonId: SeasonId,
    awayClubId: ClubId,
    events: IDL.Vec(PlayerEventData),
    homeClubId: ClubId,
    kickOff: IDL.Int,
    homeGoals: IDL.Nat8,
    gameweek: GameweekNumber,
    awayGoals: IDL.Nat8,
  });
  const Result_2 = IDL.Variant({ ok: IDL.Vec(FixtureDTO), err: Error });
  const ClubDTO = IDL.Record({
    id: ClubId,
    secondaryColourHex: IDL.Text,
    name: IDL.Text,
    friendlyName: IDL.Text,
    thirdColourHex: IDL.Text,
    abbreviatedName: IDL.Text,
    shirtType: ShirtType,
    primaryColourHex: IDL.Text,
  });
  const Result_3 = IDL.Variant({ ok: IDL.Vec(ClubDTO), err: Error });
  const DataHashDTO = IDL.Record({ hash: IDL.Text, category: IDL.Text });
  const Result_12 = IDL.Variant({ ok: IDL.Vec(DataHashDTO), err: Error });
  const Club = IDL.Record({
    id: ClubId,
    secondaryColourHex: IDL.Text,
    name: IDL.Text,
    friendlyName: IDL.Text,
    thirdColourHex: IDL.Text,
    abbreviatedName: IDL.Text,
    shirtType: ShirtType,
    primaryColourHex: IDL.Text,
  });
  const PlayerStatus = IDL.Variant({
    OnLoan: IDL.Null,
    Active: IDL.Null,
    FreeAgent: IDL.Null,
    Retired: IDL.Null,
  });
  List_3.fill(IDL.Opt(IDL.Tuple(PlayerEventData, List_3)));
  const PlayerGameweek = IDL.Record({
    events: List_3,
    number: GameweekNumber,
    points: IDL.Int16,
  });
  List_2.fill(IDL.Opt(IDL.Tuple(PlayerGameweek, List_2)));
  const PlayerSeason = IDL.Record({
    id: SeasonId,
    gameweeks: List_2,
    totalPoints: IDL.Int16,
  });
  List_1.fill(IDL.Opt(IDL.Tuple(PlayerSeason, List_1)));
  const InjuryHistory = IDL.Record({
    description: IDL.Text,
    injuryStartDate: IDL.Int,
    expectedEndDate: IDL.Int,
  });
  List.fill(IDL.Opt(IDL.Tuple(InjuryHistory, List)));
  const TransferHistory = IDL.Record({
    transferDate: IDL.Int,
    loanEndDate: IDL.Int,
    toLeagueId: LeagueId,
    toClub: ClubId,
    fromLeagueId: LeagueId,
    fromClub: ClubId,
  });
  List_4.fill(IDL.Opt(IDL.Tuple(TransferHistory, List_4)));
  const ValueHistory = IDL.Record({
    oldValue: IDL.Nat16,
    changedOn: IDL.Int,
    newValue: IDL.Nat16,
  });
  List_5.fill(IDL.Opt(IDL.Tuple(ValueHistory, List_5)));
  const Player = IDL.Record({
    id: PlayerId,
    status: PlayerStatus,
    clubId: ClubId,
    parentClubId: ClubId,
    seasons: List_1,
    valueQuarterMillions: IDL.Nat16,
    dateOfBirth: IDL.Int,
    injuryHistory: List,
    transferHistory: List_4,
    nationality: CountryId,
    retirementDate: IDL.Int,
    valueHistory: List_5,
    latestInjuryEndDate: IDL.Int,
    gender: Gender,
    currentLoanEndDate: IDL.Int,
    shirtNumber: IDL.Nat8,
    parentLeagueId: LeagueId,
    position: PlayerPosition,
    lastName: IDL.Text,
    leagueId: LeagueId,
    firstName: IDL.Text,
  });
  const CalendarMonth = IDL.Nat8;
  const LeagueStatus = IDL.Record({
    transferWindowEndMonth: IDL.Nat8,
    transferWindowEndDay: IDL.Nat8,
    transferWindowStartMonth: IDL.Nat8,
    transferWindowActive: IDL.Bool,
    totalGameweeks: IDL.Nat8,
    completedGameweek: GameweekNumber,
    transferWindowStartDay: IDL.Nat8,
    unplayedGameweek: GameweekNumber,
    activeMonth: CalendarMonth,
    activeSeasonId: SeasonId,
    activeGameweek: GameweekNumber,
    leagueId: LeagueId,
    seasonActive: IDL.Bool,
  });
  const Result_11 = IDL.Variant({ ok: LeagueStatus, err: Error });
  const FootballLeagueDTO = IDL.Record({
    id: LeagueId,
    logo: IDL.Vec(IDL.Nat8),
    name: IDL.Text,
    teamCount: IDL.Nat8,
    relatedGender: Gender,
    countryId: CountryId,
    abbreviation: IDL.Text,
    governingBody: IDL.Text,
    formed: IDL.Int,
  });
  const Result_10 = IDL.Variant({
    ok: IDL.Vec(FootballLeagueDTO),
    err: Error,
  });
  const LoanedPlayerDTO = IDL.Record({
    id: IDL.Nat16,
    status: PlayerStatus,
    clubId: ClubId,
    parentClubId: ClubId,
    valueQuarterMillions: IDL.Nat16,
    dateOfBirth: IDL.Int,
    nationality: CountryId,
    currentLoanEndDate: IDL.Int,
    shirtNumber: IDL.Nat8,
    parentLeagueId: LeagueId,
    position: PlayerPosition,
    lastName: IDL.Text,
    leagueId: LeagueId,
    firstName: IDL.Text,
  });
  const Result_9 = IDL.Variant({
    ok: IDL.Vec(LoanedPlayerDTO),
    err: Error,
  });
  const GetPlayerDetailsDTO = IDL.Record({
    playerId: ClubId,
    seasonId: SeasonId,
  });
  const PlayerGameweekDTO = IDL.Record({
    fixtureId: FixtureId,
    events: IDL.Vec(PlayerEventData),
    number: IDL.Nat8,
    points: IDL.Int16,
  });
  const PlayerDetailDTO = IDL.Record({
    id: PlayerId,
    status: PlayerStatus,
    clubId: ClubId,
    parentClubId: ClubId,
    valueQuarterMillions: IDL.Nat16,
    dateOfBirth: IDL.Int,
    injuryHistory: IDL.Vec(InjuryHistory),
    seasonId: SeasonId,
    gameweeks: IDL.Vec(PlayerGameweekDTO),
    nationality: CountryId,
    retirementDate: IDL.Int,
    valueHistory: IDL.Vec(ValueHistory),
    latestInjuryEndDate: IDL.Int,
    shirtNumber: IDL.Nat8,
    position: PlayerPosition,
    lastName: IDL.Text,
    firstName: IDL.Text,
  });
  const Result_8 = IDL.Variant({ ok: PlayerDetailDTO, err: Error });
  const GameweekFiltersDTO = IDL.Record({
    seasonId: SeasonId,
    gameweek: GameweekNumber,
  });
  const PlayerPointsDTO = IDL.Record({
    id: IDL.Nat16,
    clubId: ClubId,
    events: IDL.Vec(PlayerEventData),
    position: PlayerPosition,
    gameweek: GameweekNumber,
    points: IDL.Int16,
  });
  const Result_7 = IDL.Variant({
    ok: IDL.Vec(PlayerPointsDTO),
    err: Error,
  });
  const PlayerDTO = IDL.Record({
    id: IDL.Nat16,
    status: PlayerStatus,
    clubId: ClubId,
    parentClubId: ClubId,
    valueQuarterMillions: IDL.Nat16,
    dateOfBirth: IDL.Int,
    nationality: CountryId,
    currentLoanEndDate: IDL.Int,
    shirtNumber: IDL.Nat8,
    parentLeagueId: LeagueId,
    position: PlayerPosition,
    lastName: IDL.Text,
    leagueId: LeagueId,
    firstName: IDL.Text,
  });
  const Result_1 = IDL.Variant({ ok: IDL.Vec(PlayerDTO), err: Error });
  const PlayerScoreDTO = IDL.Record({
    id: IDL.Nat16,
    clubId: ClubId,
    assists: IDL.Int16,
    dateOfBirth: IDL.Int,
    nationality: CountryId,
    goalsScored: IDL.Int16,
    saves: IDL.Int16,
    goalsConceded: IDL.Int16,
    events: IDL.Vec(PlayerEventData),
    position: PlayerPosition,
    points: IDL.Int16,
  });
  const Result_6 = IDL.Variant({
    ok: IDL.Vec(IDL.Tuple(IDL.Nat16, PlayerScoreDTO)),
    err: Error,
  });
  const RequestFixturesDTO = IDL.Record({
    seasonId: SeasonId,
    leagueId: LeagueId,
  });
  const ClubFilterDTO = IDL.Record({
    clubId: ClubId,
    leagueId: LeagueId,
  });
  const SeasonDTO = IDL.Record({
    id: SeasonId,
    name: IDL.Text,
    year: IDL.Nat16,
  });
  const Result_5 = IDL.Variant({ ok: IDL.Vec(SeasonDTO), err: Error });
  const TimerInfo = IDL.Record({
    id: IDL.Int,
    callbackName: IDL.Text,
    triggerTime: IDL.Int,
  });
  const Result_4 = IDL.Variant({ ok: IDL.Vec(TimerInfo), err: Error });
  const LoanPlayerDTO = IDL.Record({
    loanEndDate: IDL.Int,
    playerId: ClubId,
    loanClubId: ClubId,
    loanLeagueId: LeagueId,
  });
  const MoveFixtureDTO = IDL.Record({
    fixtureId: FixtureId,
    updatedFixtureGameweek: GameweekNumber,
    updatedFixtureDate: IDL.Int,
    seasonId: SeasonId,
    leagueId: LeagueId,
  });
  const SubmitFixtureDataDTO = IDL.Record({
    fixtureId: FixtureId,
    seasonId: SeasonId,
    gameweek: GameweekNumber,
    playerEventData: IDL.Vec(PlayerEventData),
    leagueId: LeagueId,
  });
  const PostponeFixtureDTO = IDL.Record({
    fixtureId: FixtureId,
    seasonId: SeasonId,
    leagueId: LeagueId,
  });
  const PromoteClubDTO = IDL.Record({
    secondaryColourHex: IDL.Text,
    name: IDL.Text,
    friendlyName: IDL.Text,
    thirdColourHex: IDL.Text,
    abbreviatedName: IDL.Text,
    shirtType: ShirtType,
    primaryColourHex: IDL.Text,
  });
  const RecallPlayerDTO = IDL.Record({
    recallFromLeagueId: LeagueId,
    playerId: ClubId,
  });
  const RelegateClubDTO = IDL.Record({
    clubId: ClubId,
    leagueId: LeagueId,
  });
  const RemoveClubDTO = IDL.Record({
    clubId: ClubId,
    leagueId: LeagueId,
  });
  const RetirePlayerDTO = IDL.Record({
    playerId: ClubId,
    retirementDate: IDL.Int,
  });
  const RevaluePlayerDownDTO = IDL.Record({
    playerId: ClubId,
    seasonId: SeasonId,
    gameweek: GameweekNumber,
  });
  const RevaluePlayerUpDTO = IDL.Record({
    playerId: ClubId,
    seasonId: SeasonId,
    gameweek: GameweekNumber,
  });
  const SetFreeAgentDTO = IDL.Record({
    playerId: ClubId,
    leagueId: LeagueId,
  });
  const SetPlayerInjuryDTO = IDL.Record({
    playerId: ClubId,
    description: IDL.Text,
    expectedEndDate: IDL.Int,
  });
  const TransferPlayerDTO = IDL.Record({
    clubId: ClubId,
    newLeagueId: LeagueId,
    playerId: ClubId,
    newShirtNumber: IDL.Nat8,
    newClubId: ClubId,
    leagueId: LeagueId,
  });
  const UnretirePlayerDTO = IDL.Record({
    playerId: ClubId,
    leagueId: LeagueId,
  });
  const UpdateClubDTO = IDL.Record({
    clubId: ClubId,
    secondaryColourHex: IDL.Text,
    name: IDL.Text,
    friendlyName: IDL.Text,
    thirdColourHex: IDL.Text,
    abbreviatedName: IDL.Text,
    shirtType: ShirtType,
    primaryColourHex: IDL.Text,
  });
  const UpdateLeagueDTO = IDL.Record({
    logo: IDL.Vec(IDL.Nat8),
    name: IDL.Text,
    teamCount: IDL.Nat8,
    relatedGender: Gender,
    countryId: CountryId,
    abbreviation: IDL.Text,
    governingBody: IDL.Text,
    leagueId: LeagueId,
    formed: IDL.Int,
  });
  const UpdatePlayerDTO = IDL.Record({
    dateOfBirth: IDL.Int,
    playerId: ClubId,
    nationality: CountryId,
    shirtNumber: IDL.Nat8,
    position: PlayerPosition,
    lastName: IDL.Text,
    firstName: IDL.Text,
  });
  const AddInitialFixturesDTO = IDL.Record({
    seasonFixtures: IDL.Vec(FixtureDTO),
  });
  const RescheduleFixtureDTO = IDL.Record({
    postponedFixtureId: FixtureId,
    updatedFixtureGameweek: GameweekNumber,
    updatedFixtureDate: IDL.Int,
  });
  return IDL.Service({
    addInitialFixtures: IDL.Func([], [], []),
    createClub: IDL.Func([CreateClubDTO], [Result], []),
    createLeague: IDL.Func([CreateLeagueDTO], [Result], []),
    createPlayer: IDL.Func([LeagueId, CreatePlayerDTO], [Result], []),
    getBetslipFixtures: IDL.Func([GetBetslipFixturesDTO], [Result_2], []),
    getClubs: IDL.Func([LeagueId], [Result_3], ["query"]),
    getDataHashes: IDL.Func([LeagueId], [Result_12], ["composite_query"]),
    getFixtures: IDL.Func([LeagueId], [Result_2], ["query"]),
    getLeagueClubs: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(LeagueId, IDL.Vec(Club)))],
      [],
    ),
    getLeaguePlayers: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(LeagueId, IDL.Vec(Player)))],
      [],
    ),
    getLeagueStatus: IDL.Func([LeagueId], [Result_11], ["query"]),
    getLeagues: IDL.Func([], [Result_10], ["query"]),
    getLoanedPlayers: IDL.Func([LeagueId], [Result_9], ["query"]),
    getPlayerDetails: IDL.Func(
      [LeagueId, GetPlayerDetailsDTO],
      [Result_8],
      ["query"],
    ),
    getPlayerDetailsForGameweek: IDL.Func(
      [LeagueId, GameweekFiltersDTO],
      [Result_7],
      ["query"],
    ),
    getPlayers: IDL.Func([LeagueId], [Result_1], ["query"]),
    getPlayersMap: IDL.Func(
      [LeagueId, GameweekFiltersDTO],
      [Result_6],
      ["query"],
    ),
    getPostponedFixtures: IDL.Func(
      [LeagueId, RequestFixturesDTO],
      [Result_2],
      ["query"],
    ),
    getRetiredPlayers: IDL.Func(
      [LeagueId, ClubFilterDTO],
      [Result_1],
      ["query"],
    ),
    getSeasons: IDL.Func([LeagueId], [Result_5], ["query"]),
    getTimers: IDL.Func([], [Result_4], ["query"]),
    getVerifiedClubs: IDL.Func([LeagueId], [Result_3], []),
    getVerifiedFixtures: IDL.Func([RequestFixturesDTO], [Result_2], []),
    getVerifiedPlayers: IDL.Func([LeagueId], [Result_1], []),
    loanPlayer: IDL.Func([LeagueId, LoanPlayerDTO], [Result], []),
    moveFixture: IDL.Func([MoveFixtureDTO], [Result], []),
    populatePlayerEventData: IDL.Func(
      [SubmitFixtureDataDTO, IDL.Vec(Player)],
      [IDL.Opt(IDL.Vec(PlayerEventData))],
      [],
    ),
    postponeFixture: IDL.Func([PostponeFixtureDTO], [Result], []),
    promoteClub: IDL.Func([LeagueId, PromoteClubDTO], [Result], []),
    recallPlayer: IDL.Func([RecallPlayerDTO], [Result], []),
    relegateClub: IDL.Func([LeagueId, RelegateClubDTO], [Result], []),
    removeClub: IDL.Func([RemoveClubDTO], [Result], []),
    retirePlayer: IDL.Func([LeagueId, RetirePlayerDTO], [Result], []),
    revaluePlayerDown: IDL.Func([LeagueId, RevaluePlayerDownDTO], [Result], []),
    revaluePlayerUp: IDL.Func([LeagueId, RevaluePlayerUpDTO], [Result], []),
    setFreeAgent: IDL.Func([LeagueId, SetFreeAgentDTO], [Result], []),
    setPlayerInjury: IDL.Func([LeagueId, SetPlayerInjuryDTO], [Result], []),
    submitFixtureData: IDL.Func([SubmitFixtureDataDTO], [Result], []),
    transferPlayer: IDL.Func([LeagueId, TransferPlayerDTO], [Result], []),
    unretirePlayer: IDL.Func([UnretirePlayerDTO], [Result], []),
    updateClub: IDL.Func([UpdateClubDTO], [Result], []),
    updateDataHash: IDL.Func([LeagueId, IDL.Text], [], []),
    updateLeague: IDL.Func([UpdateLeagueDTO], [Result], []),
    updatePlayer: IDL.Func([LeagueId, UpdatePlayerDTO], [Result], []),
    updatePlayerValue: IDL.Func([PlayerId, IDL.Nat16], [Result], []),
    validateAddInitialFixtures: IDL.Func(
      [LeagueId, AddInitialFixturesDTO],
      [Result],
      [],
    ),
    validateCreateClub: IDL.Func([LeagueId, CreateClubDTO], [Result], []),
    validateCreateLeague: IDL.Func([CreateLeagueDTO], [Result], []),
    validateCreatePlayer: IDL.Func([LeagueId, CreatePlayerDTO], [Result], []),
    validateLoanPlayer: IDL.Func([LeagueId, LoanPlayerDTO], [Result], []),
    validateMoveFixture: IDL.Func([LeagueId, MoveFixtureDTO], [Result], []),
    validatePostponeFixture: IDL.Func(
      [LeagueId, PostponeFixtureDTO],
      [Result],
      [],
    ),
    validatePromoteClub: IDL.Func([LeagueId, PromoteClubDTO], [Result], []),
    validateRecallPlayer: IDL.Func([LeagueId, RecallPlayerDTO], [Result], []),
    validateRelegateClub: IDL.Func([LeagueId, RelegateClubDTO], [Result], []),
    validateRescehduleFixture: IDL.Func(
      [LeagueId, RescheduleFixtureDTO],
      [Result],
      [],
    ),
    validateRetirePlayer: IDL.Func([LeagueId, RetirePlayerDTO], [Result], []),
    validateRevaluePlayerDown: IDL.Func(
      [LeagueId, RevaluePlayerDownDTO],
      [Result],
      [],
    ),
    validateRevaluePlayerUp: IDL.Func(
      [LeagueId, RevaluePlayerUpDTO],
      [Result],
      [],
    ),
    validateSetFreeAgent: IDL.Func([LeagueId, SetFreeAgentDTO], [Result], []),
    validateSetPlayerInjury: IDL.Func(
      [LeagueId, SetPlayerInjuryDTO],
      [Result],
      [],
    ),
    validateSubmitFixtureData: IDL.Func(
      [LeagueId, SubmitFixtureDataDTO],
      [Result],
      [],
    ),
    validateTransferPlayer: IDL.Func(
      [LeagueId, TransferPlayerDTO],
      [Result],
      [],
    ),
    validateUnretirePlayer: IDL.Func(
      [LeagueId, UnretirePlayerDTO],
      [Result],
      [],
    ),
    validateUpdateClub: IDL.Func([LeagueId, UpdateClubDTO], [Result], []),
    validateUpdateLeague: IDL.Func([UpdateLeagueDTO], [Result], []),
    validateUpdatePlayer: IDL.Func([LeagueId, UpdatePlayerDTO], [Result], []),
    validationRemoveClub: IDL.Func([LeagueId, RemoveClubDTO], [Result], []),
  });
};
export const init = ({ IDL }) => {
  return [];
};
