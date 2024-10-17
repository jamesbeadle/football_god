import type { LeagueId } from "../../../../declarations/football_god_backend/football_god_backend.did";
import { ClubService } from "$lib/services/club-service";

function createClubStore() {
  async function getClubs(leagueId: LeagueId) {
    return new ClubService().getClubs(leagueId);
  }

  return {
    getClubs,
  };
}

export const clubStore = createClubStore();
