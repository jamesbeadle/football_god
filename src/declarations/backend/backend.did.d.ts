import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";

export interface AddInitialFixturesDTO {
  seasonFixtures: Array<FixtureDTO>;
}
export type BetResult = { Won: null } | { Lost: null } | { Open: null };
export interface BetSlip {
  id: bigint;
  status: SelectionStatus;
  result: BetResult;
  betType: BetType;
  totalWinnings: bigint;
  totalStake: bigint;
  placedBy: PrincipalId;
  placedOn: bigint;
  selections: Array<Selection>;
  expectedReturns: bigint;
  settledOn: bigint;
}
export type BetType =
  | { SevenFold: null }
  | { Patent: null }
  | { FiveFold: null }
  | { FourFold: null }
  | { Goliath: null }
  | { Double: null }
  | { Lucky15: null }
  | { Lucky31: null }
  | { Lucky63: null }
  | { SuperHeinz: null }
  | { Treble: null }
  | { Trixie: null }
  | { TenFold: null }
  | { EightFold: null }
  | { Heinz: null }
  | { Yankee: null }
  | { SixFold: null }
  | { NineFold: null }
  | { Canadian: null }
  | { Single: null };
export interface BothTeamsToScoreAndWinnerDetail {
  bothTeamsToScore: boolean;
  matchResult: MatchResult;
}
export interface BothTeamsToScoreDetail {
  bothTeamsToScore: boolean;
}
export type CalendarMonth = number;
export type Category =
  | { MissPenalty: null }
  | { LastAssist: null }
  | { PenaltyMissed: null }
  | { FirstAssist: null }
  | { AnytimeGoalscorer: null }
  | { CorrectResult: null }
  | { HalfTimeScore: null }
  | { BothTeamsToScore: null }
  | { HalfTimeFullTimeResult: null }
  | { LastGoalscorer: null }
  | { RedCard: null }
  | { ScoreHatrick: null }
  | { CorrectScore: null }
  | { AnytimeAssist: null }
  | { YellowCard: null }
  | { BothTeamsToScoreAndWinner: null }
  | { FirstGoalscorer: null }
  | { ScoreBrace: null };
export interface ClubDTO {
  id: ClubId;
  secondaryColourHex: string;
  name: string;
  friendlyName: string;
  thirdColourHex: string;
  abbreviatedName: string;
  shirtType: ShirtType;
  primaryColourHex: string;
}
export interface ClubEventDetail {
  clubId: ClubId;
}
export type ClubId = number;
export interface CorrectResultDetail {
  matchResult: MatchResult;
}
export interface CountryDTO {
  id: CountryId;
  code: string;
  name: string;
}
export type CountryId = number;
export interface CreateClubDTO {
  secondaryColourHex: string;
  name: string;
  friendlyName: string;
  thirdColourHex: string;
  abbreviatedName: string;
  shirtType: ShirtType;
  primaryColourHex: string;
  leagueId: LeagueId;
}
export interface CreateLeagueDTO {
  logo: Uint8Array | number[];
  name: string;
  teamCount: number;
  relatedGender: Gender;
  countryId: CountryId;
  abbreviation: string;
  governingBody: string;
  formed: bigint;
}
export interface CreatePlayerDTO {
  clubId: ClubId;
  valueQuarterMillions: number;
  dateOfBirth: bigint;
  nationality: CountryId;
  shirtNumber: number;
  position: PlayerPosition;
  lastName: string;
  firstName: string;
}
export interface DataHash {
  hash: string;
  category: string;
}
export interface DataHashDTO {
  hash: string;
  category: string;
}
export type Error =
  | { DecodeError: null }
  | { NotAllowed: null }
  | { NotFound: null }
  | { NotAuthorized: null }
  | { InvalidData: null }
  | { AlreadyExists: null }
  | { CanisterCreateError: null }
  | { CanisterFull: null };
export interface FixtureDTO {
  id: number;
  status: FixtureStatusType;
  highestScoringPlayerId: number;
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
export interface FootballLeagueDTO {
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
export interface GameweekFiltersDTO {
  seasonId: SeasonId;
  gameweek: GameweekNumber;
}
export type GameweekNumber = number;
export type Gender = { Male: null } | { Female: null };
export interface GetBetsDTO {
  principalId: PrincipalId;
}
export interface HalfTimeFullTimeOdds {
  firstHalfResult: MatchResult;
  odds: number;
  secondHalfResult: MatchResult;
}
export interface HalfTimeFullTimeResultDetail {
  fullTimeResult: MatchResult;
  halfTimeResult: MatchResult;
}
export interface HomePageFixtureDTO {
  fixtureId: FixtureId;
  homeOdds: number;
  drawOdds: number;
  awayOdds: number;
  gameweek: GameweekNumber;
  leagueId: LeagueId;
}
export interface InjuryHistory {
  description: string;
  injuryStartDate: bigint;
  expectedEndDate: bigint;
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
export interface LoanPlayerDTO {
  loanEndDate: bigint;
  playerId: ClubId;
  loanClubId: ClubId;
  loanLeagueId: LeagueId;
}
export interface LoanedPlayerDTO {
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
export interface MatchOddsDTO {
  fixtureId: FixtureId;
  lastAssist: Array<PlayerSelectionOdds>;
  correctScores: Array<ScoreSelectionOdds>;
  bothTeamsToScore: YesNoSelectionOdds;
  yellowCards: Array<PlayerSelectionOdds>;
  lastGoalscorers: Array<PlayerSelectionOdds>;
  halfTimeScores: Array<ScoreSelectionOdds>;
  anytimeAssist: Array<PlayerSelectionOdds>;
  penaltyMissers: Array<PlayerSelectionOdds>;
  redCards: Array<PlayerSelectionOdds>;
  anytimeScorers: Array<PlayerSelectionOdds>;
  correctResults: TeamSelectionOdds;
  penaltyMissed: MissPenaltyOdds;
  scoresHatTrick: Array<PlayerSelectionOdds>;
  scoresBrace: Array<PlayerSelectionOdds>;
  goalsOverUnder: OverUnderSelectionOdds;
  firstAssisters: Array<PlayerSelectionOdds>;
  leagueId: LeagueId;
  firstGoalscorers: Array<PlayerSelectionOdds>;
  halfTimeFullTimeResult: Array<HalfTimeFullTimeOdds>;
  bothTeamsToScoreAndWinner: Array<ResultAndYesNoSelectionOdds>;
}
export type MatchResult =
  | { HomeWin: null }
  | { Draw: null }
  | { AwayWin: null };
export interface MissPenaltyOdds {
  homeTeam: number;
  awayTeam: number;
}
export interface MoveFixtureDTO {
  fixtureId: FixtureId;
  updatedFixtureGameweek: GameweekNumber;
  updatedFixtureDate: bigint;
  seasonId: SeasonId;
  leagueId: LeagueId;
}
export interface OverUnderSelection {
  odds: number;
  margin: number;
}
export interface OverUnderSelectionOdds {
  overOdds: Array<OverUnderSelection>;
  underOdds: Array<OverUnderSelection>;
}
export interface PauseAccountDTO {
  pauseDays: bigint;
  principalId: PrincipalId;
}
export interface PlayerDTO {
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
export interface PlayerDetailDTO {
  id: PlayerId;
  status: PlayerStatus;
  clubId: ClubId;
  parentClubId: ClubId;
  valueQuarterMillions: number;
  dateOfBirth: bigint;
  injuryHistory: Array<InjuryHistory>;
  seasonId: SeasonId;
  gameweeks: Array<PlayerGameweekDTO>;
  nationality: CountryId;
  retirementDate: bigint;
  valueHistory: Array<ValueHistory>;
  latestInjuryEndDate: bigint;
  shirtNumber: number;
  position: PlayerPosition;
  lastName: string;
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
export interface PlayerEventDetail {
  clubId: ClubId;
  playerId: PlayerId;
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
export interface PlayerGameweekDTO {
  fixtureId: FixtureId;
  events: Array<PlayerEventData>;
  number: number;
  points: number;
}
export interface PlayerGroupEventDetail {
  clubId: ClubId;
  playerId: PlayerId;
}
export type PlayerId = number;
export type PlayerPosition =
  | { Goalkeeper: null }
  | { Midfielder: null }
  | { Forward: null }
  | { Defender: null };
export interface PlayerSelectionOdds {
  playerId: PlayerId;
  odds: number;
}
export type PlayerStatus =
  | { OnLoan: null }
  | { Active: null }
  | { FreeAgent: null }
  | { Retired: null };
export interface PostponeFixtureDTO {
  fixtureId: FixtureId;
  seasonId: SeasonId;
  leagueId: LeagueId;
}
export type PrincipalId = string;
export interface ProfileDTO {
  username: string;
  maxBetLimit: bigint;
  monthlyBetLimit: bigint;
  withdrawalAddress: string;
  profilePictureExtension: string;
  accountBalance: bigint;
  kycApprovalDate: bigint;
  joinedDate: bigint;
  accountOnPause: boolean;
  termsAcceptedDate: bigint;
  kycComplete: boolean;
  kycRef: string;
  profilePicture: [] | [Uint8Array | number[]];
  kycSubmissionDate: bigint;
  principalId: PrincipalId;
  monthlyBetTotal: bigint;
}
export interface PromoteClubDTO {
  secondaryColourHex: string;
  name: string;
  friendlyName: string;
  thirdColourHex: string;
  abbreviatedName: string;
  shirtType: ShirtType;
  primaryColourHex: string;
}
export interface RecallPlayerDTO {
  recallFromLeagueId: LeagueId;
  playerId: ClubId;
}
export interface RemoveClubDTO {
  clubId: ClubId;
  leagueId: LeagueId;
}
export interface RescheduleFixtureDTO {
  postponedFixtureId: FixtureId;
  updatedFixtureGameweek: GameweekNumber;
  updatedFixtureDate: bigint;
}
export type Result = { ok: null } | { err: Error };
export interface ResultAndYesNoSelectionOdds {
  result: MatchResult;
  odds: number;
  isYes: boolean;
}
export type Result_1 = { ok: BetSlip } | { err: Error };
export type Result_10 = { ok: Array<LoanedPlayerDTO> } | { err: Error };
export type Result_11 = { ok: Array<FootballLeagueDTO> } | { err: Error };
export type Result_12 = { ok: LeagueStatus } | { err: Error };
export type Result_13 = { ok: Array<PlayerDTO> } | { err: Error };
export type Result_14 = { ok: Array<ClubDTO> } | { err: Error };
export type Result_15 = { ok: Array<DataHashDTO> } | { err: Error };
export type Result_16 = { ok: Array<FixtureDTO> } | { err: Error };
export type Result_17 = { ok: Array<DataHash> } | { err: Error };
export type Result_18 = { ok: Array<CountryDTO> } | { err: Error };
export type Result_19 = { ok: Array<HomePageFixtureDTO> } | { err: Error };
export type Result_2 = { ok: boolean } | { err: Error };
export type Result_20 = { ok: Array<BetSlip> } | { err: Error };
export type Result_3 = { ok: UserAuditDTO } | { err: Error };
export type Result_4 = { ok: Array<TimerInfo> } | { err: Error };
export type Result_5 = { ok: SystemStateDTO } | { err: Error };
export type Result_6 = { ok: Array<SeasonDTO> } | { err: Error };
export type Result_7 = { ok: ProfileDTO } | { err: Error };
export type Result_8 = { ok: PlayerDetailDTO } | { err: Error };
export type Result_9 = { ok: MatchOddsDTO } | { err: Error };
export interface RetirePlayerDTO {
  playerId: ClubId;
  retirementDate: bigint;
}
export interface RevaluePlayerDownDTO {
  playerId: ClubId;
  seasonId: SeasonId;
  gameweek: GameweekNumber;
}
export interface RevaluePlayerUpDTO {
  playerId: ClubId;
  seasonId: SeasonId;
  gameweek: GameweekNumber;
}
export type RustResult = { Ok: string } | { Err: string };
export interface ScoreDetail {
  homeGoals: number;
  awayGoals: number;
}
export interface ScoreSelectionOdds {
  odds: number;
  homeGoals: number;
  awayGoals: number;
}
export interface SeasonDTO {
  id: SeasonId;
  name: string;
  year: number;
}
export type SeasonId = number;
export interface Selection {
  status: SelectionStatus;
  result: BetResult;
  fixtureId: FixtureId;
  winnings: number;
  odds: number;
  stake: bigint;
  expectedReturns: bigint;
  selectionDetail: SelectionDetail;
  leagueId: LeagueId;
  selectionType: Category;
}
export type SelectionDetail =
  | { MissPenalty: PlayerEventDetail }
  | { LastAssist: PlayerEventDetail }
  | { PenaltyMissed: ClubEventDetail }
  | { FirstAssist: PlayerEventDetail }
  | { AnytimeGoalscorer: PlayerEventDetail }
  | { CorrectResult: CorrectResultDetail }
  | { HalfTimeScore: ScoreDetail }
  | { BothTeamsToScore: BothTeamsToScoreDetail }
  | { HalfTimeFullTimeResult: HalfTimeFullTimeResultDetail }
  | { LastGoalscorer: PlayerEventDetail }
  | { RedCard: PlayerEventDetail }
  | { ScoreHatrick: PlayerGroupEventDetail }
  | { CorrectScore: ScoreDetail }
  | { AnytimeAssist: PlayerEventDetail }
  | { YellowCard: PlayerEventDetail }
  | { BothTeamsToScoreAndWinner: BothTeamsToScoreAndWinnerDetail }
  | { FirstGoalscorer: PlayerEventDetail }
  | { ScoreBrace: PlayerGroupEventDetail };
export type SelectionStatus =
  | { Void: null }
  | { Unsettled: null }
  | { Settled: null };
export interface SetFreeAgentDTO {
  playerId: ClubId;
  leagueId: LeagueId;
}
export interface SetMaxBetLimit {
  maxBetLimit: bigint;
  principalId: PrincipalId;
}
export interface SetMonthlyBetLimitDTO {
  monthlyBetLimit: bigint;
  principalId: PrincipalId;
}
export interface SetPlayerInjuryDTO {
  playerId: ClubId;
  description: string;
  expectedEndDate: bigint;
}
export type ShirtType = { Filled: null } | { Striped: null };
export interface ShuftiAcceptedResponse {
  reference: string;
  event: string;
}
export interface ShuftiRejectedResponse {
  reference: string;
  event: string;
}
export type ShuftiResponse =
  | {
      ShuftiAcceptedResponse: ShuftiAcceptedResponse;
    }
  | { ShuftiRejectedResponse: ShuftiRejectedResponse };
export interface SubmitBetslipDTO {
  expectedReturn: bigint;
  seasonId: SeasonId;
  totalStake: bigint;
  principalId: PrincipalId;
  leagueId: LeagueId;
}
export interface SubmitFixtureDataDTO {
  fixtureId: FixtureId;
  seasonId: SeasonId;
  gameweek: GameweekNumber;
  playerEventData: Array<PlayerEventData>;
  leagueId: LeagueId;
}
export interface SystemStateDTO {
  version: string;
  onHold: boolean;
}
export interface TeamSelectionOdds {
  homeOdds: number;
  drawOdds: number;
  awayOdds: number;
}
export interface TimerInfo {
  id: bigint;
  callbackName: string;
  triggerTime: bigint;
}
export interface TransferPlayerDTO {
  clubId: ClubId;
  newLeagueId: LeagueId;
  playerId: ClubId;
  newShirtNumber: number;
  newClubId: ClubId;
  leagueId: LeagueId;
}
export interface UnretirePlayerDTO {
  playerId: ClubId;
  leagueId: LeagueId;
}
export interface UpdateAppStatusDTO {
  version: string;
  onHold: boolean;
}
export interface UpdateClubDTO {
  clubId: ClubId;
  secondaryColourHex: string;
  name: string;
  friendlyName: string;
  thirdColourHex: string;
  abbreviatedName: string;
  shirtType: ShirtType;
  primaryColourHex: string;
}
export interface UpdateLeagueDTO {
  logo: Uint8Array | number[];
  name: string;
  teamCount: number;
  relatedGender: Gender;
  countryId: CountryId;
  abbreviation: string;
  governingBody: string;
  leagueId: LeagueId;
  formed: bigint;
}
export interface UpdatePlayerDTO {
  dateOfBirth: bigint;
  playerId: ClubId;
  nationality: CountryId;
  shirtNumber: number;
  position: PlayerPosition;
  lastName: string;
  firstName: string;
}
export interface UpdateProfilePictureDTO {
  profilePictureExtension: string;
  profilePicture: Uint8Array | number[];
  principalId: PrincipalId;
}
export interface UpdateUsernameDTO {
  username: string;
  principalId: PrincipalId;
}
export interface UpdateWithdrawalAddressDTO {
  withdrawalAddress: string;
  principalId: PrincipalId;
}
export interface UserAuditDTO {
  date: bigint;
  offset: bigint;
  users: Array<UserDTO>;
}
export interface UserDTO {
  kycApprovalDate: bigint;
  joinedDate: bigint;
  termsAcceptedDate: bigint;
  kycComplete: boolean;
  kycRef: string;
  kycSubmissionDate: bigint;
  principalId: PrincipalId;
}
export interface ValueHistory {
  oldValue: number;
  changedOn: bigint;
  newValue: number;
}
export interface YesNoSelectionOdds {
  noOdds: number;
  yesOdds: number;
}
export interface _SERVICE {
  agreeTerms: ActorMethod<[], Result>;
  calculateGameweekScores: ActorMethod<[string], Result>;
  calculateLeaderboards: ActorMethod<[string], Result>;
  calculateWeeklyRewards: ActorMethod<[string, GameweekNumber], Result>;
  executeAddInitialFixtures: ActorMethod<
    [LeagueId, AddInitialFixturesDTO],
    undefined
  >;
  executeCreateClub: ActorMethod<[CreateClubDTO], undefined>;
  executeCreateLeague: ActorMethod<[CreateLeagueDTO], undefined>;
  executeCreatePlayer: ActorMethod<[LeagueId, CreatePlayerDTO], undefined>;
  executeLoanPlayer: ActorMethod<[LeagueId, LoanPlayerDTO], undefined>;
  executeMoveFixture: ActorMethod<[MoveFixtureDTO], undefined>;
  executePostponeFixture: ActorMethod<[PostponeFixtureDTO], undefined>;
  executePromoteClub: ActorMethod<[LeagueId, PromoteClubDTO], undefined>;
  executeRecallPlayer: ActorMethod<[RecallPlayerDTO], undefined>;
  executeRemoveClub: ActorMethod<[RemoveClubDTO], undefined>;
  executeRescheduleFixture: ActorMethod<
    [LeagueId, RescheduleFixtureDTO],
    undefined
  >;
  executeRetirePlayer: ActorMethod<[LeagueId, RetirePlayerDTO], undefined>;
  executeRevaluePlayerDown: ActorMethod<
    [LeagueId, RevaluePlayerDownDTO],
    undefined
  >;
  executeRevaluePlayerUp: ActorMethod<
    [LeagueId, RevaluePlayerUpDTO],
    undefined
  >;
  executeSetFreeAgent: ActorMethod<[LeagueId, SetFreeAgentDTO], undefined>;
  executeSetPlayerInjury: ActorMethod<
    [LeagueId, SetPlayerInjuryDTO],
    undefined
  >;
  executeSubmitFixtureData: ActorMethod<[SubmitFixtureDataDTO], undefined>;
  executeTransferPlayer: ActorMethod<[LeagueId, TransferPlayerDTO], undefined>;
  executeUnretirePlayer: ActorMethod<[LeagueId, UnretirePlayerDTO], undefined>;
  executeUpdateClub: ActorMethod<[LeagueId, UpdateClubDTO], undefined>;
  executeUpdateLeague: ActorMethod<[UpdateLeagueDTO], undefined>;
  executeUpdatePlayer: ActorMethod<[LeagueId, UpdatePlayerDTO], undefined>;
  getBets: ActorMethod<[GetBetsDTO], Result_20>;
  getBettableHomepageFixtures: ActorMethod<[LeagueId], Result_19>;
  getCountries: ActorMethod<[], Result_18>;
  getDataHashForCategory: ActorMethod<[LeagueId, string], Result_17>;
  getDataHashes: ActorMethod<[], Result_15>;
  getFixtures: ActorMethod<[LeagueId], Result_16>;
  getHashes: ActorMethod<[], Result_15>;
  getLeagueClubs: ActorMethod<[LeagueId], Result_14>;
  getLeaguePlayers: ActorMethod<[LeagueId], Result_13>;
  getLeagueStatus: ActorMethod<[LeagueId], Result_12>;
  getLeagues: ActorMethod<[], Result_11>;
  getLoanedPlayers: ActorMethod<[LeagueId], Result_10>;
  getMatchOdds: ActorMethod<[LeagueId, FixtureId], Result_9>;
  getPlayerDetailsForGameweek: ActorMethod<
    [LeagueId, GameweekFiltersDTO],
    Result_8
  >;
  getProfile: ActorMethod<[], Result_7>;
  getSeasons: ActorMethod<[LeagueId], Result_6>;
  getSystemState: ActorMethod<[string], Result_5>;
  getTimers: ActorMethod<[], Result_4>;
  getUserAudit: ActorMethod<[bigint], Result_3>;
  isAdmin: ActorMethod<[], Result_2>;
  isAuditor: ActorMethod<[], Result_2>;
  isDataManager: ActorMethod<[], Result_2>;
  kycVerificationCallback: ActorMethod<[ShuftiResponse], Result>;
  pauseAccount: ActorMethod<[PauseAccountDTO], Result>;
  payWeeklyRewards: ActorMethod<[string, GameweekNumber], Result>;
  placeBet: ActorMethod<[SubmitBetslipDTO], Result_1>;
  refreshLeagueHashes: ActorMethod<[], Result>;
  setMaxBetLimit: ActorMethod<[SetMaxBetLimit], Result>;
  setMonthlyBetLimit: ActorMethod<[SetMonthlyBetLimitDTO], Result>;
  snapshotManagers: ActorMethod<[string], Result>;
  storeKYCReference: ActorMethod<[string], undefined>;
  updateBettingOdds: ActorMethod<[LeagueId], Result>;
  updatePlayerValue: ActorMethod<[PlayerId, number], Result>;
  updateProfilePicture: ActorMethod<[UpdateProfilePictureDTO], Result>;
  updateSystemState: ActorMethod<[string, UpdateAppStatusDTO], Result>;
  updateUsername: ActorMethod<[UpdateUsernameDTO], Result>;
  updateWithdrawalAddress: ActorMethod<[UpdateWithdrawalAddressDTO], Result>;
  validateAddInitialFixtures: ActorMethod<[AddInitialFixturesDTO], RustResult>;
  validateCreateLeague: ActorMethod<[CreateLeagueDTO], RustResult>;
  validateCreatePlayer: ActorMethod<[CreatePlayerDTO], RustResult>;
  validateLoanPlayer: ActorMethod<[LoanPlayerDTO], RustResult>;
  validateMoveFixture: ActorMethod<[MoveFixtureDTO], RustResult>;
  validatePostponeFixture: ActorMethod<[PostponeFixtureDTO], RustResult>;
  validatePromoteClub: ActorMethod<[PromoteClubDTO], RustResult>;
  validateRecallPlayer: ActorMethod<[RecallPlayerDTO], RustResult>;
  validateRescheduleFixture: ActorMethod<[RescheduleFixtureDTO], RustResult>;
  validateRetirePlayer: ActorMethod<[RetirePlayerDTO], RustResult>;
  validateRevaluePlayerDown: ActorMethod<[RevaluePlayerDownDTO], RustResult>;
  validateRevaluePlayerUp: ActorMethod<[RevaluePlayerUpDTO], RustResult>;
  validateSetFreeAgent: ActorMethod<[TransferPlayerDTO], RustResult>;
  validateSetPlayerInjury: ActorMethod<[SetPlayerInjuryDTO], RustResult>;
  validateSubmitFixtureData: ActorMethod<[SubmitFixtureDataDTO], RustResult>;
  validateTransferPlayer: ActorMethod<[TransferPlayerDTO], RustResult>;
  validateUnretirePlayer: ActorMethod<[UnretirePlayerDTO], RustResult>;
  validateUpdateClub: ActorMethod<[UpdateClubDTO], RustResult>;
  validateUpdateLeague: ActorMethod<[UpdateLeagueDTO], RustResult>;
  validateUpdatePlayer: ActorMethod<[UpdatePlayerDTO], RustResult>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
