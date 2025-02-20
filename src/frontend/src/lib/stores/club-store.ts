import { writable } from "svelte/store";
import { ClubService } from "../services/club-service";
import type {
  ClubDTO,
  LeagueId,
} from "../../../../declarations/data_canister/data_canister.did";

function createClubStore() {
  const { subscribe, set } = writable<ClubDTO[]>([]);

  async function getClubs(leagueId: LeagueId) {
    return new ClubService().getClubs(leagueId);
  }
  return {
    getClubs,
    subscribe,
    setClubs: (clubs: ClubDTO[]) =>
      set(clubs.sort((a, b) => a.friendlyName.localeCompare(b.friendlyName))),
  };
}

export const clubStore = createClubStore();
