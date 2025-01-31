import type { Selection } from "../../../../declarations/backend/backend.did";

export interface ExtendedSelection extends Selection {
  uiDescription?: string;
  fixtureDetails?: string;
  leagueName?: string;
}
