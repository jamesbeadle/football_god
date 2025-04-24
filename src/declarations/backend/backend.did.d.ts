import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";

export interface AddController {
  app: WaterwayLabsApp;
  controller: PrincipalId;
  canisterId: CanisterId;
}
export interface AppStatus {
  version: string;
  onHold: boolean;
}
export type CalendarMonth = number;
export interface Canister {
  app: WaterwayLabsApp;
  canisterName: string;
  canisterType: CanisterType;
  canisterId: CanisterId;
}
export type CanisterId = string;
export type CanisterType = { SNS: null } | { Dynamic: null } | { Static: null };
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
  totalMFValue: bigint;
  totalGKValue: bigint;
  totalPlayers: number;
  totalValue: bigint;
  totalDefenders: number;
  totalForwards: number;
  positionText: string;
  primaryColour: string;
  totalGoalkeepers: number;
  gender: Gender;
  shirtType: ShirtType;
  totalDFValue: bigint;
  thirdColour: string;
  secondaryColour: string;
  totalFWValue: bigint;
  position: bigint;
  priorValue: bigint;
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
export interface DataTotals {
  totalGovernanceRewards: bigint;
  totalPlayers: bigint;
  totalClubs: bigint;
  totalNeurons: bigint;
  totalProposals: bigint;
  totalLeagues: bigint;
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
export type GetDataTotals = {};
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
export type GetPlayerValueLeaderboard = {};
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
export interface PlayerSummary {
  clubId: ClubId;
  totalValue: number;
  playerId: PlayerId;
  positionText: string;
  position: bigint;
  priorValue: number;
  leagueId: LeagueId;
}
export interface PlayerValueLeaderboard {
  players: Array<PlayerSummary>;
}
export interface Players {
  players: Array<Player>;
}
export interface PostponedFixtures {
  seasonId: SeasonId;
  fixtures: Array<Fixture>;
  leagueId: LeagueId;
}
export type PrincipalId = string;
export interface ProjectCanisters {
  entries: Array<Canister>;
}
export interface RemoveController {
  app: WaterwayLabsApp;
  controller: PrincipalId;
  canisterId: CanisterId;
}
export type Result = { ok: null } | { err: Error };
export type Result_1 = { ok: Seasons } | { err: Error };
export type Result_10 = { ok: DataTotals } | { err: Error };
export type Result_11 = { ok: DataHashes } | { err: Error };
export type Result_12 = { ok: Countries } | { err: Error };
export type Result_13 = { ok: Clubs } | { err: Error };
export type Result_14 = { ok: ClubValueLeaderboard } | { err: Error };
export type Result_15 = { ok: AppStatus } | { err: Error };
export type Result_2 = { ok: ProjectCanisters } | { err: Error };
export type Result_3 = { ok: PostponedFixtures } | { err: Error };
export type Result_4 = { ok: Players } | { err: Error };
export type Result_5 = { ok: PlayerValueLeaderboard } | { err: Error };
export type Result_6 = { ok: LoanedPlayers } | { err: Error };
export type Result_7 = { ok: Leagues } | { err: Error };
export type Result_8 = { ok: LeagueStatus } | { err: Error };
export type Result_9 = { ok: Fixtures } | { err: Error };
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
export interface TopupCanister {
  app: WaterwayLabsApp;
  cycles: bigint;
  canisterId: CanisterId;
}
export type WaterwayLabsApp =
  | { OpenFPL: null }
  | { OpenWSL: null }
  | { ICPCasino: null }
  | { FootballGod: null }
  | { ICF1: null }
  | { ICFC: null }
  | { ICGC: null }
  | { ICPFA: null }
  | { TransferKings: null }
  | { JeffBets: null }
  | { OpenBook: null }
  | { OpenCare: null }
  | { OpenChef: null }
  | { OpenBeats: null }
  | { WaterwayLabs: null };
export interface _SERVICE {
  addController: ActorMethod<[AddController], Result>;
  getAppStatus: ActorMethod<[], Result_15>;
  getClubValueLeaderboard: ActorMethod<[GetClubValueLeaderboard], Result_14>;
  getClubs: ActorMethod<[GetClubs], Result_13>;
  getCountries: ActorMethod<[GetCountries], Result_12>;
  getDataHashes: ActorMethod<[GetDataHashes], Result_11>;
  getDataTotals: ActorMethod<[GetDataTotals], Result_10>;
  getFixtures: ActorMethod<[GetFixtures], Result_9>;
  getLeagueStatus: ActorMethod<[GetLeagueStatus], Result_8>;
  getLeagues: ActorMethod<[GetLeagues], Result_7>;
  getLoanedPlayers: ActorMethod<[GetLoanedPlayers], Result_6>;
  getPlayerValueLeaderboard: ActorMethod<[GetPlayerValueLeaderboard], Result_5>;
  getPlayers: ActorMethod<[GetPlayers], Result_4>;
  getPostponedFixtures: ActorMethod<[GetPostponedFixtures], Result_3>;
  getProjectCanisters: ActorMethod<[], Result_2>;
  getSeasons: ActorMethod<[GetSeasons], Result_1>;
  removeController: ActorMethod<[RemoveController], Result>;
  transferCycles: ActorMethod<[TopupCanister], Result>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
