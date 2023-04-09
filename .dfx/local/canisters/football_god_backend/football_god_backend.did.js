export const idlFactory = ({ IDL }) => {
  const List = IDL.Rec();
  const List_1 = IDL.Rec();
  const List_2 = IDL.Rec();
  const Error = IDL.Variant({
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
  List_2.fill(IDL.Opt(IDL.Tuple(Fixture, List_2)));
  const Gameweek = IDL.Record({
    'status' : IDL.Nat8,
    'number' : IDL.Nat8,
    'fixtureCount' : IDL.Nat8,
    'fixtures' : List_2,
  });
  List_1.fill(IDL.Opt(IDL.Tuple(Gameweek, List_1)));
  const Season = IDL.Record({
    'id' : IDL.Nat16,
    'name' : IDL.Text,
    'year' : IDL.Nat16,
    'gameweeks' : List_1,
  });
  const PayoutData = IDL.Record({
    'totalPot' : IDL.Float64,
    'winners' : IDL.Nat,
  });
  const Prediction = IDL.Record({
    'fixtureId' : IDL.Nat32,
    'homeGoals' : IDL.Nat8,
    'awayGoals' : IDL.Nat8,
  });
  const Profile = IDL.Record({
    'balance' : IDL.Nat64,
    'displayName' : IDL.Text,
    'depositAddress' : IDL.Vec(IDL.Nat8),
    'principalName' : IDL.Text,
    'wallet' : IDL.Text,
  });
  const Team = IDL.Record({ 'id' : IDL.Nat16, 'name' : IDL.Text });
  List.fill(IDL.Opt(IDL.Tuple(Prediction, List)));
  const UserGameweek = IDL.Record({
    'correctScores' : IDL.Nat8,
    'predictionCount' : IDL.Nat8,
    'winnings' : IDL.Nat,
    'predictions' : List,
    'seasonId' : IDL.Nat16,
    'enteredSweepstake' : IDL.Bool,
    'gameweekNumber' : IDL.Nat8,
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
    'enterSweepstake' : IDL.Func([IDL.Nat16, IDL.Nat8], [Result], []),
    'getActiveGameweek' : IDL.Func([], [IDL.Opt(Gameweek)], ['query']),
    'getActiveSeason' : IDL.Func([], [IDL.Opt(Season)], ['query']),
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
    'getGameweekPot' : IDL.Func([], [IDL.Int64], []),
    'getGameweeks' : IDL.Func([IDL.Nat16], [IDL.Vec(Gameweek)], ['query']),
    'getPayoutData' : IDL.Func(
        [IDL.Nat16, IDL.Nat8],
        [IDL.Opt(PayoutData)],
        [],
      ),
    'getPredictions' : IDL.Func(
        [IDL.Nat16, IDL.Nat8],
        [IDL.Vec(Prediction)],
        [],
      ),
    'getProfile' : IDL.Func([], [IDL.Opt(Profile)], []),
    'getSeason' : IDL.Func([IDL.Nat16], [IDL.Opt(Season)], ['query']),
    'getSeasons' : IDL.Func([], [IDL.Vec(Season)], ['query']),
    'getTeams' : IDL.Func([], [IDL.Vec(Team)], ['query']),
    'getUserAccountBalance' : IDL.Func([], [IDL.Nat64], []),
    'getUserHistory' : IDL.Func([IDL.Nat16], [IDL.Vec(UserGameweek)], []),
    'getUsersWithBalances' : IDL.Func(
        [IDL.Nat, IDL.Nat],
        [IDL.Vec(Profile)],
        [],
      ),
    'isAdmin' : IDL.Func([], [IDL.Bool], ['query']),
    'isDisplayNameValid' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'payoutSweepstake' : IDL.Func([IDL.Nat16, IDL.Nat8], [Result], []),
    'setActiveGameweek' : IDL.Func([IDL.Nat8], [Result], []),
    'setActiveSeason' : IDL.Func([IDL.Nat16], [Result], []),
    'submitPredictions' : IDL.Func(
        [IDL.Nat16, IDL.Nat8, IDL.Vec(Prediction)],
        [Result],
        [],
      ),
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
