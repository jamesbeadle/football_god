export const idlFactory = ({ IDL }) => {
  const List = IDL.Rec();
  const List_1 = IDL.Rec();
  const Error = IDL.Variant({
    'DecodeError' : IDL.Null,
    'NotAllowed' : IDL.Null,
    'NotFound' : IDL.Null,
    'NotAuthorized' : IDL.Null,
    'AlreadyExists' : IDL.Null,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : Error });
  const GameweekDTO = IDL.Record({
    'totalFixtures' : IDL.Nat8,
    'correctScores' : IDL.Nat8,
    'winnings' : IDL.Nat64,
    'sweepstakeEntered' : IDL.Bool,
    'gameweekNumber' : IDL.Nat8,
  });
  const SeasonDTO = IDL.Record({
    'seasonId' : IDL.Nat16,
    'gameweeks' : IDL.Vec(GameweekDTO),
    'seasonName' : IDL.Text,
    'seasonYear' : IDL.Nat16,
  });
  const AdminDTO = IDL.Record({
    'activeGameweekNumber' : IDL.Nat8,
    'seasons' : IDL.Vec(SeasonDTO),
    'activeGameweekStatus' : IDL.Text,
    'activeSeasonId' : IDL.Nat16,
    'activeSeasonName' : IDL.Text,
  });
  const CorrectPredictionDTO = IDL.Record({
    'displayName' : IDL.Text,
    'principalName' : IDL.Text,
  });
  const CorrectPredictionsDTO = IDL.Record({
    'totalEntries' : IDL.Nat64,
    'predictions' : IDL.Vec(CorrectPredictionDTO),
    'awayTeamName' : IDL.Text,
    'seasonId' : IDL.Nat16,
    'homeTeamName' : IDL.Text,
    'homeTeamGoals' : IDL.Nat8,
    'seasonName' : IDL.Text,
    'gameweekNumber' : IDL.Nat8,
    'awayTeamGoals' : IDL.Nat8,
  });
  const Fixture = IDL.Record({
    'id' : IDL.Nat32,
    'status' : IDL.Nat8,
    'awayTeamId' : IDL.Nat16,
    'homeTeamId' : IDL.Nat16,
    'homeGoals' : IDL.Nat8,
    'awayGoals' : IDL.Nat8,
  });
  List_1.fill(IDL.Opt(IDL.Tuple(Fixture, List_1)));
  const Gameweek = IDL.Record({
    'status' : IDL.Nat8,
    'number' : IDL.Nat8,
    'fixtureCount' : IDL.Nat8,
    'fixtures' : List_1,
  });
  const HistoryDTO = IDL.Record({
    'seasons' : IDL.Vec(SeasonDTO),
    'seasonGameweeks' : IDL.Vec(GameweekDTO),
    'userId' : IDL.Text,
    'activeSeasonId' : IDL.Nat16,
    'activeSeasonName' : IDL.Text,
  });
  const FixtureDTO = IDL.Record({
    'status' : IDL.Nat8,
    'awayTeamPrediction' : IDL.Nat8,
    'fixtureId' : IDL.Nat32,
    'homeTeamPrediction' : IDL.Nat8,
    'awayTeamId' : IDL.Nat16,
    'awayTeamName' : IDL.Text,
    'homeTeamId' : IDL.Nat16,
    'correct' : IDL.Bool,
    'homeTeamName' : IDL.Text,
    'homeTeamGoals' : IDL.Nat8,
    'awayTeamGoals' : IDL.Nat8,
  });
  const HomeDTO = IDL.Record({
    'activeGameweekNumber' : IDL.Nat8,
    'hasPredictions' : IDL.Bool,
    'gameweekPot' : IDL.Nat64,
    'systemUpdating' : IDL.Bool,
    'gameweekStatus' : IDL.Nat8,
    'activeSeasonId' : IDL.Nat16,
    'principalName' : IDL.Text,
    'activeSeasonName' : IDL.Text,
    'fixtures' : IDL.Vec(FixtureDTO),
  });
  const LeaderboardEntryDTO = IDL.Record({
    'totalFixtures' : IDL.Nat8,
    'correctScores' : IDL.Nat8,
    'displayName' : IDL.Text,
    'enteredSweepstake' : IDL.Bool,
    'principalName' : IDL.Text,
    'position' : IDL.Text,
  });
  const LeaderBoardDTO = IDL.Record({
    'activeGameweekNumber' : IDL.Nat8,
    'totalEntries' : IDL.Nat64,
    'seasons' : IDL.Vec(SeasonDTO),
    'leaderboardEntries' : IDL.Vec(LeaderboardEntryDTO),
    'activeSeasonId' : IDL.Nat16,
    'activeSeasonName' : IDL.Text,
  });
  const PayoutDTO = IDL.Record({
    'winnerShare' : IDL.Nat64,
    'activeGameweekNumber' : IDL.Nat8,
    'gameweekPot' : IDL.Nat64,
    'adminFee' : IDL.Nat64,
    'potAccountBalance' : IDL.Nat64,
    'winnerCount' : IDL.Nat64,
    'activeSeasonName' : IDL.Text,
  });
  const PlayDTO = IDL.Record({
    'activeGameweekNumber' : IDL.Nat8,
    'userId' : IDL.Text,
    'sweepstakePaid' : IDL.Bool,
    'accountBalance' : IDL.Nat64,
    'activeSeasonId' : IDL.Nat16,
    'activeSeasonName' : IDL.Text,
    'fixtures' : IDL.Vec(FixtureDTO),
  });
  const ProfileDTO = IDL.Record({
    'balance' : IDL.Nat64,
    'displayName' : IDL.Text,
    'walletAddress' : IDL.Text,
    'depositAddress' : IDL.Vec(IDL.Nat8),
    'principalName' : IDL.Text,
  });
  List.fill(IDL.Opt(IDL.Tuple(Gameweek, List)));
  const Season = IDL.Record({
    'id' : IDL.Nat16,
    'name' : IDL.Text,
    'year' : IDL.Nat16,
    'gameweeks' : List,
  });
  const Team = IDL.Record({ 'id' : IDL.Nat16, 'name' : IDL.Text });
  const UserBalanceDTO = IDL.Record({
    'balance' : IDL.Nat64,
    'displayName' : IDL.Text,
    'principalName' : IDL.Text,
  });
  const BalancesDTO = IDL.Record({
    'totalEntries' : IDL.Nat64,
    'potAccountBalance' : IDL.Nat64,
    'userBalances' : IDL.Vec(UserBalanceDTO),
  });
  const ViewPredictionDTO = IDL.Record({
    'totalFixtures' : IDL.Nat8,
    'correctScores' : IDL.Nat8,
    'playerName' : IDL.Text,
    'seasonName' : IDL.Text,
    'fixtures' : IDL.Vec(FixtureDTO),
  });
  const SubmitPlayDTO = IDL.Record({
    'enterSweepstake' : IDL.Bool,
    'fixtures' : IDL.Vec(FixtureDTO),
  });
  return IDL.Service({
    'addFixtureToGameweek' : IDL.Func(
        [IDL.Nat16, IDL.Nat8, IDL.Nat16, IDL.Nat16],
        [Result],
        [],
      ),
    'createSeason' : IDL.Func([IDL.Text, IDL.Nat16], [Result], []),
    'createTeam' : IDL.Func([IDL.Text], [Result], []),
    'deleteFixture' : IDL.Func([IDL.Nat16, IDL.Nat8, IDL.Nat32], [Result], []),
    'deleteSeason' : IDL.Func([IDL.Nat16], [Result], []),
    'deleteTeam' : IDL.Func([IDL.Nat16], [Result], []),
    'getAdminDTO' : IDL.Func([], [AdminDTO], []),
    'getCorrectPredictionsDTO' : IDL.Func(
        [IDL.Nat16, IDL.Nat8, IDL.Nat32, IDL.Nat, IDL.Nat],
        [CorrectPredictionsDTO],
        [],
      ),
    'getFixture' : IDL.Func(
        [IDL.Nat16, IDL.Nat8, IDL.Nat32],
        [IDL.Opt(Fixture)],
        ['query'],
      ),
    'getFixtures' : IDL.Func(
        [IDL.Nat16, IDL.Nat8],
        [IDL.Vec(Fixture)],
        ['query'],
      ),
    'getGameweeks' : IDL.Func([IDL.Nat16], [IDL.Vec(Gameweek)], ['query']),
    'getHistoryDTO' : IDL.Func([IDL.Nat16], [HistoryDTO], []),
    'getHomeDTO' : IDL.Func([], [HomeDTO], []),
    'getLeaderboardDTO' : IDL.Func(
        [IDL.Nat16, IDL.Nat8, IDL.Nat, IDL.Nat],
        [LeaderBoardDTO],
        [],
      ),
    'getPayoutDTO' : IDL.Func([], [PayoutDTO], []),
    'getPlayDTO' : IDL.Func([], [PlayDTO], []),
    'getProfileDTO' : IDL.Func([], [ProfileDTO], []),
    'getSeason' : IDL.Func([IDL.Nat16], [IDL.Opt(Season)], ['query']),
    'getSeasons' : IDL.Func([], [IDL.Vec(Season)], ['query']),
    'getTeams' : IDL.Func([], [IDL.Vec(Team)], ['query']),
    'getUserBalancesDTO' : IDL.Func([IDL.Nat, IDL.Nat], [BalancesDTO], []),
    'getViewPredictionDTO' : IDL.Func(
        [IDL.Text, IDL.Nat16, IDL.Nat8],
        [ViewPredictionDTO],
        [],
      ),
    'isAdmin' : IDL.Func([], [IDL.Bool], ['query']),
    'isDisplayNameValid' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'isWalletValid' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'payoutSweepstake' : IDL.Func([], [Result], []),
    'setSystemState' : IDL.Func([IDL.Nat16, IDL.Nat8], [Result], []),
    'submitPlayDTO' : IDL.Func([SubmitPlayDTO], [Result], []),
    'unsetActiveState' : IDL.Func([], [Result], []),
    'updateDisplayName' : IDL.Func([IDL.Text], [Result], []),
    'updateFixture' : IDL.Func(
        [
          IDL.Nat16,
          IDL.Nat8,
          IDL.Nat32,
          IDL.Nat16,
          IDL.Nat16,
          IDL.Nat8,
          IDL.Nat8,
          IDL.Nat8,
        ],
        [Result],
        [],
      ),
    'updateGameweekStatus' : IDL.Func(
        [IDL.Nat16, IDL.Nat8, IDL.Nat8],
        [Result],
        [],
      ),
    'updateSeason' : IDL.Func([IDL.Nat16, IDL.Text, IDL.Nat16], [Result], []),
    'updateTeam' : IDL.Func([IDL.Nat16, IDL.Text], [Result], []),
    'updateWalletAddress' : IDL.Func([IDL.Text], [Result], []),
    'withdrawICP' : IDL.Func([IDL.Float64], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
