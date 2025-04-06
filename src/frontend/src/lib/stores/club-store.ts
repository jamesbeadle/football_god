import { writable } from "svelte/store";
import { ClubService } from "../services/club-service";
import type {
  Club,
  Clubs,
  LeagueId,
} from "../../../../declarations/data_canister/data_canister.did";

function createClubStore() {
  const { subscribe, set } = writable<Clubs | undefined>(undefined);

  async function getClubs(leagueId: LeagueId) {
    return new ClubService().getClubs(leagueId);
  }

  async function getClubValueLeaderboard() {
    return new ClubService().getClubValueLeaderboard();
  }

  return {
    getClubs,
    getClubValueLeaderboard,
    subscribe,
    setClubs: (clubs: Clubs) => set(clubs),
  };
}

export const clubStore = createClubStore();
