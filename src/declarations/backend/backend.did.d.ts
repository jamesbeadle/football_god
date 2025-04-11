import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";

export interface AppStatus {
  version: string;
  onHold: boolean;
}
export type CalendarMonth = number;
export interface Club {
  id: ClubId;
  secondaryColourHex: string;
  name: string;
  friendlyName: string;
  thirdColourHex: string;
  abbreviatedName: string;
  shirtType: ShirtType;
  primaryColourHex: string;
}
export type ClubId = number;
export interface ClubSummary {
  mvp: MostValuablePlayer;
  clubId: ClubId;
  clubName: string;
  totalMFValue: number;
  totalGKValue: number;
  totalPlayers: number;
  totalValue: number;
  totalDefenders: number;
  totalForwards: number;
  positionText: string;
  primaryColour: string;
  totalGoalkeepers: number;
  gender: Gender;
  shirtType: ShirtType;
  totalDFValue: number;
  thirdColour: string;
  secondaryColour: string;
  totalFWValue: number;
  position: bigint;
  priorValue: number;
  leagueId: LeagueId;
  totalMidfielders: number;
}
export interface ClubValueLeaderboard {
  clubs: Array<ClubSummary>;
}
export interface Clubs {
  clubs: Array<Club>;
  leagueId: LeagueId;
}
export interface Countries {
  countries: Array<Country>;
}
export interface Country {
  id: CountryId;
  code: string;
  name: string;
}
export type CountryId = number;
export interface DataHash {
  hash: string;
  category: string;
}
export interface DataHashes {
  dataHashes: Array<DataHash>;
}
export type Error =
  | { InvalidProfilePicture: null }
  | { DecodeError: null }
  | { TooLong: null }
  | { NotAllowed: null }
  | { DuplicateData: null }
  | { InvalidProperty: null }
  | { NotFound: null }
  | { IncorrectSetup: null }
  | { AlreadyClaimed: null }
  | { NotAuthorized: null }
  | { MaxDataExceeded: null }
  | { InvalidData: null }
  | { SystemOnHold: null }
  | { AlreadyExists: null }
  | { NoPacketsRemaining: null }
  | { UpdateFailed: null }
  | { CanisterCreateError: null }
  | { NeuronAlreadyUsed: null }
  | { FailedInterCanisterCall: null }
  | { InsufficientPacketsRemaining: null }
  | { InsufficientFunds: null }
  | { InEligible: null };
export interface Fixture {
  id: FixtureId;
  status: FixtureStatusType;
  highestScoringPlayerId: PlayerId;
  seasonId: SeasonId;
  awayClubId: ClubId;
  events: Array<PlayerEventData>;
  homeClubId: ClubId;
  kickOff: bigint;
  homeGoals: number;
  gameweek: GameweekNumber;
  awayGoals: number;
}
export type FixtureId = number;
export type FixtureStatusType =
  | { Unplayed: null }
  | { Finalised: null }
  | { Active: null }
  | { Complete: null };
export interface Fixtures {
  seasonId: SeasonId;
  fixtures: Array<Fixture>;
  leagueId: LeagueId;
}
export type GameweekNumber = number;
export type Gender = { Male: null } | { Female: null };
export type GetClubValueLeaderboard = {};
export interface GetClubs {
  leagueId: LeagueId;
}
export type GetCountries = {};
export interface GetDataHashes {
  leagueId: LeagueId;
}
export interface GetFixtures {
  seasonId: SeasonId;
  leagueId: LeagueId;
}
export interface GetLeagueStatus {
  leagueId: LeagueId;
}
export type GetLeagues = {};
export interface GetLoanedPlayers {
  leagueId: LeagueId;
}
export interface GetPlayers {
  leagueId: LeagueId;
}
export interface GetPostponedFixtures {
  leagueId: LeagueId;
}
export interface GetSeasons {
  leagueId: LeagueId;
}
export interface League {
  id: LeagueId;
  logo: Uint8Array | number[];
  name: string;
  teamCount: number;
  relatedGender: Gender;
  countryId: CountryId;
  abbreviation: string;
  governingBody: string;
  formed: bigint;
}
export type LeagueId = number;
export interface LeagueStatus {
  transferWindowEndMonth: number;
  transferWindowEndDay: number;
  transferWindowStartMonth: number;
  transferWindowActive: boolean;
  totalGameweeks: number;
  completedGameweek: GameweekNumber;
  transferWindowStartDay: number;
  unplayedGameweek: GameweekNumber;
  activeMonth: CalendarMonth;
  activeSeasonId: SeasonId;
  activeGameweek: GameweekNumber;
  leagueId: LeagueId;
  seasonActive: boolean;
}
export interface Leagues {
  leagues: Array<League>;
}
export interface LoanedPlayers {
  players: Array<Player>;
}
export interface MostValuablePlayer {
  id: PlayerId;
  value: number;
  lastName: string;
  firstName: string;
}
export interface Player {
  id: number;
  status: PlayerStatus;
  clubId: ClubId;
  parentClubId: ClubId;
  valueQuarterMillions: number;
  dateOfBirth: bigint;
  nationality: CountryId;
  currentLoanEndDate: bigint;
  shirtNumber: number;
  parentLeagueId: LeagueId;
  position: PlayerPosition;
  lastName: string;
  leagueId: LeagueId;
  firstName: string;
}
export interface PlayerEventData {
  fixtureId: FixtureId;
  clubId: ClubId;
  playerId: number;
  eventStartMinute: number;
  eventEndMinute: number;
  eventType: PlayerEventType;
}
export type PlayerEventType =
  | { PenaltyMissed: null }
  | { Goal: null }
  | { GoalConceded: null }
  | { Appearance: null }
  | { PenaltySaved: null }
  | { RedCard: null }
  | { KeeperSave: null }
  | { CleanSheet: null }
  | { YellowCard: null }
  | { GoalAssisted: null }
  | { OwnGoal: null }
  | { HighestScoringPlayer: null };
export type PlayerId = number;
export type PlayerPosition =
  | { Goalkeeper: null }
  | { Midfielder: null }
  | { Forward: null }
  | { Defender: null };
export type PlayerStatus =
  | { OnLoan: null }
  | { Active: null }
  | { FreeAgent: null }
  | { Retired: null };
export interface Players {
  players: Array<Player>;
}
export interface PostponedFixtures {
  seasonId: SeasonId;
  fixtures: Array<Fixture>;
  leagueId: LeagueId;
}
export type Result = { ok: Seasons } | { err: Error };
export type Result_1 = { ok: PostponedFixtures } | { err: Error };
export type Result_10 = { ok: ClubValueLeaderboard } | { err: Error };
export type Result_11 = { ok: AppStatus } | { err: Error };
export type Result_2 = { ok: Players } | { err: Error };
export type Result_3 = { ok: LoanedPlayers } | { err: Error };
export type Result_4 = { ok: Leagues } | { err: Error };
export type Result_5 = { ok: LeagueStatus } | { err: Error };
export type Result_6 = { ok: Fixtures } | { err: Error };
export type Result_7 = { ok: DataHashes } | { err: Error };
export type Result_8 = { ok: Countries } | { err: Error };
export type Result_9 = { ok: Clubs } | { err: Error };
export interface Season {
  id: number;
  name: string;
  year: number;
}
export type SeasonId = number;
export interface Seasons {
  seasons: Array<Season>;
}
export type ShirtType = { Filled: null } | { Striped: null };
export interface _SERVICE {
  getAppStatus: ActorMethod<[], Result_11>;
  getClubValueLeaderboard: ActorMethod<[GetClubValueLeaderboard], Result_10>;
  getClubs: ActorMethod<[GetClubs], Result_9>;
  getCountries: ActorMethod<[GetCountries], Result_8>;
  getDataHashes: ActorMethod<[GetDataHashes], Result_7>;
  getFixtures: ActorMethod<[GetFixtures], Result_6>;
  getLeagueStatus: ActorMethod<[GetLeagueStatus], Result_5>;
  getLeagues: ActorMethod<[GetLeagues], Result_4>;
  getLoanedPlayers: ActorMethod<[GetLoanedPlayers], Result_3>;
  getPlayers: ActorMethod<[GetPlayers], Result_2>;
  getPostponedFixtures: ActorMethod<[GetPostponedFixtures], Result_1>;
  getSeasons: ActorMethod<[GetSeasons], Result>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
