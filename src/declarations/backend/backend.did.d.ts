import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";

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
export interface ClubEventDetail {
  clubId: ClubId;
}
export type ClubId = number;
export interface CorrectResultDetail {
  matchResult: MatchResult;
}
export type CountryId = number;
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
export type FixtureId = number;
export interface GameweekFiltersDTO {
  seasonId: SeasonId;
  gameweek: GameweekNumber;
}
export type GameweekNumber = number;
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
export type Result = { ok: null } | { err: Error };
export interface ResultAndYesNoSelectionOdds {
  result: MatchResult;
  odds: number;
  isYes: boolean;
}
export type Result_1 = { ok: BetSlip } | { err: Error };
export type Result_2 = { ok: boolean } | { err: Error };
export type Result_3 = { ok: UserAuditDTO } | { err: Error };
export type Result_4 = { ok: ProfileDTO } | { err: Error };
export type Result_5 = { ok: PlayerDetailDTO } | { err: Error };
export type Result_6 = { ok: MatchOddsDTO } | { err: Error };
export type Result_7 = { ok: Array<DataHashDTO> } | { err: Error };
export type Result_8 = { ok: Array<HomePageFixtureDTO> } | { err: Error };
export type Result_9 = { ok: Array<BetSlip> } | { err: Error };
export interface ScoreDetail {
  homeGoals: number;
  awayGoals: number;
}
export interface ScoreSelectionOdds {
  odds: number;
  homeGoals: number;
  awayGoals: number;
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
export interface SetMaxBetLimit {
  maxBetLimit: bigint;
  principalId: PrincipalId;
}
export interface SetMonthlyBetLimitDTO {
  monthlyBetLimit: bigint;
  principalId: PrincipalId;
}
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
export interface TeamSelectionOdds {
  homeOdds: number;
  drawOdds: number;
  awayOdds: number;
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
  getBets: ActorMethod<[GetBetsDTO], Result_9>;
  getBettableHomepageFixtures: ActorMethod<[LeagueId], Result_8>;
  getDataHashes: ActorMethod<[], Result_7>;
  getMatchOdds: ActorMethod<[LeagueId, FixtureId], Result_6>;
  getPlayerDetailsForGameweek: ActorMethod<
    [LeagueId, GameweekFiltersDTO],
    Result_5
  >;
  getProfile: ActorMethod<[], Result_4>;
  getUserAudit: ActorMethod<[bigint], Result_3>;
  isAuditor: ActorMethod<[], Result_2>;
  kycVerificationCallback: ActorMethod<[ShuftiResponse], Result>;
  pauseAccount: ActorMethod<[PauseAccountDTO], Result>;
  placeBet: ActorMethod<[SubmitBetslipDTO], Result_1>;
  setMaxBetLimit: ActorMethod<[SetMaxBetLimit], Result>;
  setMonthlyBetLimit: ActorMethod<[SetMonthlyBetLimitDTO], Result>;
  storeKYCReference: ActorMethod<[string], undefined>;
  updateBettingOdds: ActorMethod<[LeagueId], Result>;
  updateProfilePicture: ActorMethod<[UpdateProfilePictureDTO], Result>;
  updateUsername: ActorMethod<[UpdateUsernameDTO], Result>;
  updateWithdrawalAddress: ActorMethod<[UpdateWithdrawalAddressDTO], Result>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
