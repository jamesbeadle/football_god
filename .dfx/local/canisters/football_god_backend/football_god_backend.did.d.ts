import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type Error = { 'DecodeError' : null } |
  { 'NotAllowed' : null } |
  { 'NotFound' : null } |
  { 'NotAuthorized' : null } |
  { 'AlreadyExists' : null };
export interface Fixture {
  'id' : number,
  'status' : number,
  'awayTeamId' : number,
  'homeTeamId' : number,
  'homeGoals' : number,
  'awayGoals' : number,
}
export interface Gameweek {
  'status' : number,
  'number' : number,
  'fixtureCount' : number,
  'fixtures' : List_2,
}
export interface Leaderboard {
  'totalEntries' : number,
  'entries' : Array<LeaderboardEntry>,
}
export interface LeaderboardEntry {
  'correctScores' : number,
  'displayName' : string,
  'predictionCount' : number,
  'enteredSweepstake' : boolean,
  'principalName' : string,
}
export type List = [] | [[Prediction, List]];
export type List_1 = [] | [[Gameweek, List_1]];
export type List_2 = [] | [[Fixture, List_2]];
export interface PayoutData { 'totalPot' : bigint, 'winners' : bigint }
export interface Prediction {
  'fixtureId' : number,
  'homeGoals' : number,
  'awayGoals' : number,
}
export interface Profile {
  'balance' : bigint,
  'displayName' : string,
  'depositAddress' : Uint8Array | number[],
  'principalName' : string,
  'wallet' : string,
}
export type Result = { 'ok' : null } |
  { 'err' : Error };
export interface Season {
  'id' : number,
  'name' : string,
  'year' : number,
  'gameweeks' : List_1,
}
export interface Team { 'id' : number, 'name' : string }
export interface UserGameweek {
  'correctScores' : number,
  'predictionCount' : number,
  'winnings' : bigint,
  'predictions' : List,
  'seasonId' : number,
  'enteredSweepstake' : boolean,
  'gameweekNumber' : number,
}
export interface _SERVICE {
  'addFixtureToGameweek' : ActorMethod<
    [number, number, number, number],
    Result
  >,
  'checkSweepstakePaid' : ActorMethod<[number, number], boolean>,
  'createSeason' : ActorMethod<[string, number], Result>,
  'createTeam' : ActorMethod<[string], Result>,
  'deleteFixture' : ActorMethod<[number, number, number], Result>,
  'deleteSeason' : ActorMethod<[number], Result>,
  'deleteTeam' : ActorMethod<[number], Result>,
  'enterSweepstake' : ActorMethod<[number, number], Result>,
  'getActiveGameweek' : ActorMethod<[], [] | [Gameweek]>,
  'getActiveSeason' : ActorMethod<[], [] | [Season]>,
  'getFixture' : ActorMethod<[number, number, number], [] | [Fixture]>,
  'getFixtures' : ActorMethod<[number, number], Array<Fixture>>,
  'getGameweekPot' : ActorMethod<[], bigint>,
  'getGameweeks' : ActorMethod<[number], Array<Gameweek>>,
  'getLeaderboard' : ActorMethod<[number, number, bigint, bigint], Leaderboard>,
  'getPayoutData' : ActorMethod<[number, number], [] | [PayoutData]>,
  'getPredictions' : ActorMethod<[number, number], Array<Prediction>>,
  'getProfile' : ActorMethod<[], [] | [Profile]>,
  'getPublicProfile' : ActorMethod<[string], [] | [Profile]>,
  'getSeason' : ActorMethod<[number], [] | [Season]>,
  'getSeasons' : ActorMethod<[], Array<Season>>,
  'getTeams' : ActorMethod<[], Array<Team>>,
  'getUserAccountBalance' : ActorMethod<[], bigint>,
  'getUserHistory' : ActorMethod<[number], Array<UserGameweek>>,
  'getUserPredictions' : ActorMethod<
    [string, number, number],
    Array<Prediction>
  >,
  'getUsersWithBalances' : ActorMethod<[bigint, bigint], Array<Profile>>,
  'isAdmin' : ActorMethod<[], boolean>,
  'isDisplayNameValid' : ActorMethod<[string], boolean>,
  'isWalletValid' : ActorMethod<[string], boolean>,
  'payoutSweepstake' : ActorMethod<[number, number], Result>,
  'setActiveGameweek' : ActorMethod<[number], Result>,
  'setActiveSeason' : ActorMethod<[number], Result>,
  'submitPredictions' : ActorMethod<
    [number, number, Array<Prediction>],
    Result
  >,
  'unsetActiveState' : ActorMethod<[], Result>,
  'updateDisplayName' : ActorMethod<[string], Result>,
  'updateFixture' : ActorMethod<
    [number, number, number, number, number, number, number, number],
    Result
  >,
  'updateGameweekStatus' : ActorMethod<[number, number, number], Result>,
  'updateSeason' : ActorMethod<[number, string, number], Result>,
  'updateTeam' : ActorMethod<[number, string], Result>,
  'updateWalletAddress' : ActorMethod<[string], Result>,
  'withdrawICP' : ActorMethod<[number], Result>,
}
