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
  List.fill(IDL.Opt(IDL.Tuple(Gameweek, List)));
  const Season = IDL.Record({
    'id' : IDL.Nat16,
    'name' : IDL.Text,
    'year' : IDL.Nat16,
    'gameweeks' : List,
  });
  const GameweekSummary = IDL.Record({
    'displayName' : IDL.Text,
    'principalName' : IDL.Text,
  });
  const CorrectPredictions = IDL.Record({
    'totalEntries' : IDL.Nat32,
    'entries' : IDL.Vec(GameweekSummary),
  });
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
    'gameweekPot' : IDL.Nat64,
    'systemUpdating' : IDL.Bool,
    'gameweekStatus' : IDL.Nat8,
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
    'page' : IDL.Nat,
    'count' : IDL.Nat,
    'leaderboardEntries' : IDL.Vec(LeaderboardEntryDTO),
    'activeSeasonId' : IDL.Nat16,
    'activeSeasonName' : IDL.Text,
  });
  const PayoutData = IDL.Record({
    'totalPot' : IDL.Nat64,
    'winners' : IDL.Nat,
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
  const Prediction = IDL.Record({
    'fixtureId' : IDL.Nat32,
    'homeGoals' : IDL.Nat8,
    'awayGoals' : IDL.Nat8,
  });
  const ProfileDTO = IDL.Record({
    'balance' : IDL.Nat64,
    'displayName' : IDL.Text,
    'walletAddress' : IDL.Text,
    'depositAddress' : IDL.Vec(IDL.Nat8),
    'principalName' : IDL.Text,
  });
  const Profile = IDL.Record({
    'balance' : IDL.Nat64,
    'displayName' : IDL.Text,
    'depositAddress' : IDL.Vec(IDL.Nat8),
    'principalName' : IDL.Text,
    'wallet' : IDL.Text,
  });
  const Team = IDL.Record({ 'id' : IDL.Nat16, 'name' : IDL.Text });
  const UserBalances = IDL.Record({
    'totalEntries' : IDL.Nat32,
    'entries' : IDL.Vec(Profile),
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
    'checkSweepstakePaid' : IDL.Func([IDL.Nat16, IDL.Nat8], [IDL.Bool], []),
    'createSeason' : IDL.Func([IDL.Text, IDL.Nat16], [Result], []),
    'createTeam' : IDL.Func([IDL.Text], [Result], []),
    'deleteFixture' : IDL.Func([IDL.Nat16, IDL.Nat8, IDL.Nat32], [Result], []),
    'deleteSeason' : IDL.Func([IDL.Nat16], [Result], []),
    'deleteTeam' : IDL.Func([IDL.Nat16], [Result], []),
    'getActiveGameweek' : IDL.Func([], [IDL.Opt(Gameweek)], ['query']),
    'getActiveSeason' : IDL.Func([], [IDL.Opt(Season)], ['query']),
    'getCorrectPredictions' : IDL.Func(
        [IDL.Nat16, IDL.Nat8, IDL.Nat32, IDL.Nat, IDL.Nat],
        [IDL.Opt(CorrectPredictions)],
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
    'getPayoutData' : IDL.Func(
        [IDL.Nat16, IDL.Nat8],
        [IDL.Opt(PayoutData)],
        [],
      ),
    'getPlayDTO' : IDL.Func([], [PlayDTO], []),
    'getPredictions' : IDL.Func(
        [IDL.Nat16, IDL.Nat8],
        [IDL.Vec(Prediction)],
        [],
      ),
    'getProfileDTO' : IDL.Func([], [ProfileDTO], []),
    'getPublicProfile' : IDL.Func([IDL.Text], [IDL.Opt(Profile)], []),
    'getSeason' : IDL.Func([IDL.Nat16], [IDL.Opt(Season)], ['query']),
    'getSeasons' : IDL.Func([], [IDL.Vec(Season)], ['query']),
    'getTeams' : IDL.Func([], [IDL.Vec(Team)], ['query']),
    'getUserAccountBalance' : IDL.Func([], [IDL.Nat64], []),
    'getUserPredictions' : IDL.Func(
        [IDL.Text, IDL.Nat16, IDL.Nat8],
        [IDL.Vec(Prediction)],
        [],
      ),
    'getUsersWithBalances' : IDL.Func(
        [IDL.Nat, IDL.Nat],
        [IDL.Opt(UserBalances)],
        [],
      ),
    'getViewPredictionDTO' : IDL.Func(
        [IDL.Text, IDL.Nat16, IDL.Nat8],
        [ViewPredictionDTO],
        [],
      ),
    'isAdmin' : IDL.Func([], [IDL.Bool], ['query']),
    'isDisplayNameValid' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'isWalletValid' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'payoutSweepstake' : IDL.Func([IDL.Nat16, IDL.Nat8], [Result], []),
    'setActiveGameweek' : IDL.Func([IDL.Nat8], [Result], []),
    'setActiveSeason' : IDL.Func([IDL.Nat16], [Result], []),
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
