export const idlFactory = ({ IDL }) => {
  const List = IDL.Rec();
  const List_1 = IDL.Rec();
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
  const Team = IDL.Record({ 'id' : IDL.Nat16, 'name' : IDL.Text });
  const Prediction = IDL.Record({
    'fixtureId' : IDL.Nat16,
    'homeGoals' : IDL.Nat8,
    'awayGoals' : IDL.Nat8,
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
    'getActiveGameweekInfo' : IDL.Func([], [IDL.Opt(Gameweek)], ['query']),
    'getActiveSeasonInfo' : IDL.Func([], [IDL.Opt(Season)], ['query']),
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
    'getGameweekPot' : IDL.Func([], [IDL.Nat32], ['query']),
    'getGameweeksInfo' : IDL.Func([IDL.Nat16], [IDL.Vec(Gameweek)], ['query']),
    'getSeasonInfo' : IDL.Func([IDL.Nat16], [IDL.Opt(Season)], ['query']),
    'getSeasonsInfo' : IDL.Func([], [IDL.Vec(Season)], ['query']),
    'getTeams' : IDL.Func([], [IDL.Vec(Team)], ['query']),
    'isAdmin' : IDL.Func([], [IDL.Bool], ['query']),
    'setActiveGameweek' : IDL.Func([IDL.Nat8], [Result], []),
    'setActiveSeason' : IDL.Func([IDL.Nat16], [Result], []),
    'submitPredictions' : IDL.Func(
        [IDL.Nat16, IDL.Nat8, IDL.Vec(Prediction)],
        [Result],
        [],
      ),
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
  });
};
export const init = ({ IDL }) => { return []; };
