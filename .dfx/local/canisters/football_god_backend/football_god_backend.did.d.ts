import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type Error = { 'NotAllowed' : null } |
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
  'fixtures' : List_1,
}
export type List = [] | [[Gameweek, List]];
export type List_1 = [] | [[Fixture, List_1]];
export interface Prediction {
  'fixtureId' : number,
  'homeGoals' : number,
  'awayGoals' : number,
}
export type Result = { 'ok' : null } |
  { 'err' : Error };
export interface Season {
  'id' : number,
  'name' : string,
  'year' : number,
  'gameweeks' : List,
}
export interface Team { 'id' : number, 'name' : string }
export interface _SERVICE {
  'addFixtureToGameweek' : ActorMethod<
    [number, number, number, number],
    Result
  >,
  'createSeason' : ActorMethod<[string, number], Result>,
  'createTeam' : ActorMethod<[string], Result>,
  'deleteFixture' : ActorMethod<[number, number, number], Result>,
  'deleteSeason' : ActorMethod<[number], Result>,
  'deleteTeam' : ActorMethod<[number], Result>,
  'getActiveGameweekInfo' : ActorMethod<[], [] | [Gameweek]>,
  'getActiveSeasonInfo' : ActorMethod<[], [] | [Season]>,
  'getFixture' : ActorMethod<[number, number, number], [] | [Fixture]>,
  'getFixtures' : ActorMethod<[number, number], Array<Fixture>>,
  'getGameweekPot' : ActorMethod<[], number>,
  'getGameweeksInfo' : ActorMethod<[number], Array<Gameweek>>,
  'getSeasonInfo' : ActorMethod<[number], [] | [Season]>,
  'getSeasonsInfo' : ActorMethod<[], Array<Season>>,
  'getTeams' : ActorMethod<[], Array<Team>>,
  'isAdmin' : ActorMethod<[], boolean>,
  'setActiveGameweek' : ActorMethod<[number], Result>,
  'setActiveSeason' : ActorMethod<[number], Result>,
  'submitPredictions' : ActorMethod<
    [number, number, Array<Prediction>],
    Result
  >,
  'updateFixture' : ActorMethod<
    [number, number, number, number, number, number, number, number],
    Result
  >,
  'updateGameweekStatus' : ActorMethod<[number, number, number], Result>,
  'updateSeason' : ActorMethod<[number, string, number], Result>,
  'updateTeam' : ActorMethod<[number, string], Result>,
}
