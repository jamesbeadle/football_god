export const idlFactory = ({ IDL }) => {
  const GetAppStatus = IDL.Record({});
  const AppStatus = IDL.Record({ version: IDL.Text, onHold: IDL.Bool });
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
  const Result_9 = IDL.Variant({ ok: AppStatus, err: Error });
  const LeagueId = IDL.Nat16;
  const GetClubs = IDL.Record({ leagueId: LeagueId });
  const ClubId = IDL.Nat16;
  const ShirtType = IDL.Variant({ Filled: IDL.Null, Striped: IDL.Null });
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
  const Result_8 = IDL.Variant({ ok: Clubs, err: Error });
  const GetCountries = IDL.Record({});
  const CountryId = IDL.Nat16;
  const Country = IDL.Record({
    id: CountryId,
    code: IDL.Text,
    name: IDL.Text,
  });
  const Countries = IDL.Record({ countries: IDL.Vec(Country) });
  const Result_7 = IDL.Variant({ ok: Countries, err: Error });
  const GetDataHashes = IDL.Record({ leagueId: LeagueId });
  const DataHash = IDL.Record({ hash: IDL.Text, category: IDL.Text });
  const DataHashes = IDL.Record({ dataHashes: IDL.Vec(DataHash) });
  const Result_6 = IDL.Variant({ ok: DataHashes, err: Error });
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
  const PlayerId = IDL.Nat16;
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
  const Result_5 = IDL.Variant({ ok: Fixtures, err: Error });
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
  const Result_4 = IDL.Variant({ ok: LeagueStatus, err: Error });
  const GetLeagues = IDL.Record({});
  const Gender = IDL.Variant({ Male: IDL.Null, Female: IDL.Null });
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
  const Result_3 = IDL.Variant({ ok: Leagues, err: Error });
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
  const Result_2 = IDL.Variant({ ok: LoanedPlayers, err: Error });
  const GetPlayers = IDL.Record({ leagueId: LeagueId });
  const Players = IDL.Record({ players: IDL.Vec(Player) });
  const Result_1 = IDL.Variant({ ok: Players, err: Error });
  const GetSeasons = IDL.Record({ leagueId: LeagueId });
  const Season = IDL.Record({
    id: IDL.Nat16,
    name: IDL.Text,
    year: IDL.Nat16,
  });
  const Seasons = IDL.Record({ seasons: IDL.Vec(Season) });
  const Result = IDL.Variant({ ok: Seasons, err: Error });
  return IDL.Service({
    getAppStatus: IDL.Func([GetAppStatus], [Result_9], ["query"]),
    getClubs: IDL.Func([GetClubs], [Result_8], []),
    getCountries: IDL.Func([GetCountries], [Result_7], []),
    getDataHashes: IDL.Func([GetDataHashes], [Result_6], []),
    getFixtures: IDL.Func([GetFixtures], [Result_5], []),
    getLeagueStatus: IDL.Func([GetLeagueStatus], [Result_4], []),
    getLeagues: IDL.Func([GetLeagues], [Result_3], []),
    getLoanedPlayers: IDL.Func([GetLoanedPlayers], [Result_2], []),
    getPlayers: IDL.Func([GetPlayers], [Result_1], []),
    getSeasons: IDL.Func([GetSeasons], [Result], []),
  });
};
export const init = ({ IDL }) => {
  return [];
};
