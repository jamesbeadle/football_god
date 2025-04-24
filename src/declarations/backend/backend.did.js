export const idlFactory = ({ IDL }) => {
  const WaterwayLabsApp = IDL.Variant({
    OpenFPL: IDL.Null,
    OpenWSL: IDL.Null,
    ICPCasino: IDL.Null,
    FootballGod: IDL.Null,
    ICF1: IDL.Null,
    ICFC: IDL.Null,
    ICGC: IDL.Null,
    ICPFA: IDL.Null,
    TransferKings: IDL.Null,
    JeffBets: IDL.Null,
    OpenBook: IDL.Null,
    OpenCare: IDL.Null,
    OpenChef: IDL.Null,
    OpenBeats: IDL.Null,
    WaterwayLabs: IDL.Null,
  });
  const PrincipalId = IDL.Text;
  const CanisterId = IDL.Text;
  const AddController = IDL.Record({
    app: WaterwayLabsApp,
    controller: PrincipalId,
    canisterId: CanisterId,
  });
  const Error = IDL.Variant({
    InvalidProfilePicture: IDL.Null,
    DecodeError: IDL.Null,
    TooLong: IDL.Null,
    NotAllowed: IDL.Null,
    DuplicateData: IDL.Null,
    InvalidProperty: IDL.Null,
    NotFound: IDL.Null,
    IncorrectSetup: IDL.Null,
    AlreadyClaimed: IDL.Null,
    NotAuthorized: IDL.Null,
    MaxDataExceeded: IDL.Null,
    InvalidData: IDL.Null,
    SystemOnHold: IDL.Null,
    AlreadyExists: IDL.Null,
    NoPacketsRemaining: IDL.Null,
    UpdateFailed: IDL.Null,
    CanisterCreateError: IDL.Null,
    NeuronAlreadyUsed: IDL.Null,
    FailedInterCanisterCall: IDL.Null,
    InsufficientPacketsRemaining: IDL.Null,
    InsufficientFunds: IDL.Null,
    InEligible: IDL.Null,
  });
  const Result = IDL.Variant({ ok: IDL.Null, err: Error });
  const AppStatus = IDL.Record({ version: IDL.Text, onHold: IDL.Bool });
  const Result_15 = IDL.Variant({ ok: AppStatus, err: Error });
  const GetClubValueLeaderboard = IDL.Record({});
  const PlayerId = IDL.Nat16;
  const MostValuablePlayer = IDL.Record({
    id: PlayerId,
    value: IDL.Nat16,
    lastName: IDL.Text,
    firstName: IDL.Text,
  });
  const ClubId = IDL.Nat16;
  const Gender = IDL.Variant({ Male: IDL.Null, Female: IDL.Null });
  const ShirtType = IDL.Variant({ Filled: IDL.Null, Striped: IDL.Null });
  const LeagueId = IDL.Nat16;
  const ClubSummary = IDL.Record({
    mvp: MostValuablePlayer,
    clubId: ClubId,
    clubName: IDL.Text,
    totalMFValue: IDL.Nat,
    totalGKValue: IDL.Nat,
    totalPlayers: IDL.Nat16,
    totalValue: IDL.Nat,
    totalDefenders: IDL.Nat16,
    totalForwards: IDL.Nat16,
    positionText: IDL.Text,
    primaryColour: IDL.Text,
    totalGoalkeepers: IDL.Nat16,
    gender: Gender,
    shirtType: ShirtType,
    totalDFValue: IDL.Nat,
    thirdColour: IDL.Text,
    secondaryColour: IDL.Text,
    totalFWValue: IDL.Nat,
    position: IDL.Nat,
    priorValue: IDL.Nat,
    leagueId: LeagueId,
    totalMidfielders: IDL.Nat16,
  });
  const ClubValueLeaderboard = IDL.Record({ clubs: IDL.Vec(ClubSummary) });
  const Result_14 = IDL.Variant({ ok: ClubValueLeaderboard, err: Error });
  const GetClubs = IDL.Record({ leagueId: LeagueId });
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
  const Clubs = IDL.Record({ clubs: IDL.Vec(Club), leagueId: LeagueId });
  const Result_13 = IDL.Variant({ ok: Clubs, err: Error });
  const GetCountries = IDL.Record({});
  const CountryId = IDL.Nat16;
  const Country = IDL.Record({
    id: CountryId,
    code: IDL.Text,
    name: IDL.Text,
  });
  const Countries = IDL.Record({ countries: IDL.Vec(Country) });
  const Result_12 = IDL.Variant({ ok: Countries, err: Error });
  const GetDataHashes = IDL.Record({ leagueId: LeagueId });
  const DataHash = IDL.Record({ hash: IDL.Text, category: IDL.Text });
  const DataHashes = IDL.Record({ dataHashes: IDL.Vec(DataHash) });
  const Result_11 = IDL.Variant({ ok: DataHashes, err: Error });
  const GetDataTotals = IDL.Record({});
  const DataTotals = IDL.Record({
    totalGovernanceRewards: IDL.Nat,
    totalPlayers: IDL.Nat,
    totalClubs: IDL.Nat,
    totalNeurons: IDL.Nat,
    totalProposals: IDL.Nat,
    totalLeagues: IDL.Nat,
  });
  const Result_10 = IDL.Variant({ ok: DataTotals, err: Error });
  const SeasonId = IDL.Nat16;
  const GetFixtures = IDL.Record({
    seasonId: SeasonId,
    leagueId: LeagueId,
  });
  const FixtureId = IDL.Nat32;
  const FixtureStatusType = IDL.Variant({
    Unplayed: IDL.Null,
    Finalised: IDL.Null,
    Active: IDL.Null,
    Complete: IDL.Null,
  });
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
  const Fixture = IDL.Record({
    id: FixtureId,
    status: FixtureStatusType,
    highestScoringPlayerId: PlayerId,
    seasonId: SeasonId,
    awayClubId: ClubId,
    events: IDL.Vec(PlayerEventData),
    homeClubId: ClubId,
    kickOff: IDL.Int,
    homeGoals: IDL.Nat8,
    gameweek: GameweekNumber,
    awayGoals: IDL.Nat8,
  });
  const Fixtures = IDL.Record({
    seasonId: SeasonId,
    fixtures: IDL.Vec(Fixture),
    leagueId: LeagueId,
  });
  const Result_9 = IDL.Variant({ ok: Fixtures, err: Error });
  const GetLeagueStatus = IDL.Record({ leagueId: LeagueId });
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
  const Result_8 = IDL.Variant({ ok: LeagueStatus, err: Error });
  const GetLeagues = IDL.Record({});
  const League = IDL.Record({
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
  const Leagues = IDL.Record({ leagues: IDL.Vec(League) });
  const Result_7 = IDL.Variant({ ok: Leagues, err: Error });
  const GetLoanedPlayers = IDL.Record({ leagueId: LeagueId });
  const PlayerStatus = IDL.Variant({
    OnLoan: IDL.Null,
    Active: IDL.Null,
    FreeAgent: IDL.Null,
    Retired: IDL.Null,
  });
  const PlayerPosition = IDL.Variant({
    Goalkeeper: IDL.Null,
    Midfielder: IDL.Null,
    Forward: IDL.Null,
    Defender: IDL.Null,
  });
  const Player = IDL.Record({
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
  const LoanedPlayers = IDL.Record({ players: IDL.Vec(Player) });
  const Result_6 = IDL.Variant({ ok: LoanedPlayers, err: Error });
  const GetPlayerValueLeaderboard = IDL.Record({});
  const PlayerSummary = IDL.Record({
    clubId: ClubId,
    totalValue: IDL.Nat16,
    playerId: PlayerId,
    positionText: IDL.Text,
    position: IDL.Nat,
    priorValue: IDL.Nat16,
    leagueId: LeagueId,
  });
  const PlayerValueLeaderboard = IDL.Record({
    players: IDL.Vec(PlayerSummary),
  });
  const Result_5 = IDL.Variant({
    ok: PlayerValueLeaderboard,
    err: Error,
  });
  const GetPlayers = IDL.Record({ leagueId: LeagueId });
  const Players = IDL.Record({ players: IDL.Vec(Player) });
  const Result_4 = IDL.Variant({ ok: Players, err: Error });
  const GetPostponedFixtures = IDL.Record({ leagueId: LeagueId });
  const PostponedFixtures = IDL.Record({
    seasonId: SeasonId,
    fixtures: IDL.Vec(Fixture),
    leagueId: LeagueId,
  });
  const Result_3 = IDL.Variant({ ok: PostponedFixtures, err: Error });
  const CanisterType = IDL.Variant({
    SNS: IDL.Null,
    Dynamic: IDL.Null,
    Static: IDL.Null,
  });
  const Canister = IDL.Record({
    app: WaterwayLabsApp,
    canisterName: IDL.Text,
    canisterType: CanisterType,
    canisterId: CanisterId,
  });
  const ProjectCanisters = IDL.Record({ entries: IDL.Vec(Canister) });
  const Result_2 = IDL.Variant({ ok: ProjectCanisters, err: Error });
  const GetSeasons = IDL.Record({ leagueId: LeagueId });
  const Season = IDL.Record({
    id: IDL.Nat16,
    name: IDL.Text,
    year: IDL.Nat16,
  });
  const Seasons = IDL.Record({ seasons: IDL.Vec(Season) });
  const Result_1 = IDL.Variant({ ok: Seasons, err: Error });
  const RemoveController = IDL.Record({
    app: WaterwayLabsApp,
    controller: PrincipalId,
    canisterId: CanisterId,
  });
  const TopupCanister = IDL.Record({
    app: WaterwayLabsApp,
    cycles: IDL.Nat,
    canisterId: CanisterId,
  });
  return IDL.Service({
    addController: IDL.Func([AddController], [Result], []),
    getAppStatus: IDL.Func([], [Result_15], ["query"]),
    getClubValueLeaderboard: IDL.Func(
      [GetClubValueLeaderboard],
      [Result_14],
      [],
    ),
    getClubs: IDL.Func([GetClubs], [Result_13], []),
    getCountries: IDL.Func([GetCountries], [Result_12], []),
    getDataHashes: IDL.Func([GetDataHashes], [Result_11], []),
    getDataTotals: IDL.Func([GetDataTotals], [Result_10], []),
    getFixtures: IDL.Func([GetFixtures], [Result_9], []),
    getLeagueStatus: IDL.Func([GetLeagueStatus], [Result_8], []),
    getLeagues: IDL.Func([GetLeagues], [Result_7], []),
    getLoanedPlayers: IDL.Func([GetLoanedPlayers], [Result_6], []),
    getPlayerValueLeaderboard: IDL.Func(
      [GetPlayerValueLeaderboard],
      [Result_5],
      [],
    ),
    getPlayers: IDL.Func([GetPlayers], [Result_4], []),
    getPostponedFixtures: IDL.Func([GetPostponedFixtures], [Result_3], []),
    getProjectCanisters: IDL.Func([], [Result_2], []),
    getSeasons: IDL.Func([GetSeasons], [Result_1], []),
    removeController: IDL.Func([RemoveController], [Result], []),
    transferCycles: IDL.Func([TopupCanister], [Result], []),
  });
};
export const init = ({ IDL }) => {
  return [];
};
