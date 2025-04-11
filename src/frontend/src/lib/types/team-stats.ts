import type { Club } from "../../../../declarations/backend/backend.did";

export interface TeamStats extends Club {
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}
