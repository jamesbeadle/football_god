import type { LeagueId } from "../../../../declarations/backend/backend.did";
import { ClubService } from "../services/club-service";

function createClubStore() {
  async function getClubs(leagueId: LeagueId) {
    return new ClubService().getClubs(leagueId);
  }

  return {
    getClubs,
  };
}

export const clubStore = createClubStore();
