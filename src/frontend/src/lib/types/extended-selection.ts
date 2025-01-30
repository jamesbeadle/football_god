import type { Selection } from "../../../../declarations/data_canister/data_canister.did";

export interface ExtendedSelection extends Selection {
  uiDescription?: string;
  fixtureDetails?: string;
  leagueName?: string;
}
