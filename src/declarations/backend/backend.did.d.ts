import type { Principal } from "@dfinity/principal";
import type { ActorMethod } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";

export interface AppStatus {
  version: string;
  onHold: boolean;
}
export type Error =
  | { DecodeError: null }
  | { NotAllowed: null }
  | { DuplicateData: null }
  | { InvalidProperty: null }
  | { NotFound: null }
  | { IncorrectSetup: null }
  | { NotAuthorized: null }
  | { MaxDataExceeded: null }
  | { InvalidData: null }
  | { SystemOnHold: null }
  | { AlreadyExists: null }
  | { CanisterCreateError: null }
  | { FailedInterCanisterCall: null }
  | { InsufficientFunds: null };
export type GetAppStatus = {};
export type Result = { ok: AppStatus } | { err: Error };
export interface _SERVICE {
  getAppStatus: ActorMethod<[GetAppStatus], Result>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
