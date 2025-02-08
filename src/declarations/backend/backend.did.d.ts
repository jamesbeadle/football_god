import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";

export type ClubId = number;
export type CountryId = number;
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
export interface InjuryHistory {
  description: string;
  injuryStartDate: bigint;
  expectedEndDate: bigint;
}
export type LeagueId = number;
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
export type PrincipalId = string;
export interface ProfileDTO {
  username: string;
  withdrawalAddress: string;
  profilePictureExtension: string;
  joinedDate: bigint;
  termsAcceptedDate: bigint;
  profilePicture: [] | [Uint8Array | number[]];
  principalId: PrincipalId;
}
export type Result = { ok: null } | { err: Error };
export type Result_1 = { ok: ProfileDTO } | { err: Error };
export type Result_2 = { ok: PlayerDetailDTO } | { err: Error };
export type SeasonId = number;
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
export interface ValueHistory {
  oldValue: number;
  changedOn: bigint;
  newValue: number;
}
export interface _SERVICE {
  agreeTerms: ActorMethod<[], Result>;
  getPlayerDetailsForGameweek: ActorMethod<
    [LeagueId, GameweekFiltersDTO],
    Result_2
  >;
  getProfile: ActorMethod<[], Result_1>;
  pauseAccount: ActorMethod<[PauseAccountDTO], Result>;
  updateProfilePicture: ActorMethod<[UpdateProfilePictureDTO], Result>;
  updateUsername: ActorMethod<[UpdateUsernameDTO], Result>;
  updateWithdrawalAddress: ActorMethod<[UpdateWithdrawalAddressDTO], Result>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
