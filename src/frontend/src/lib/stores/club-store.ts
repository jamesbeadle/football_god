import { writable } from "svelte/store";
import { ClubService } from "../services/club-service";
import type {
  ClubDTO,
  CreateClubDTO,
  LeagueId,
} from "../../../../declarations/data_canister/data_canister.did";

function createClubStore() {
  const { subscribe, update } = writable<Record<number, ClubDTO[]>>({});

  async function getClubs(leagueId: LeagueId) {
    return new ClubService().getClubs(leagueId);
  }

  async function createClub(dto: CreateClubDTO): Promise<any> {
    return new ClubService().createClub(dto);
  }

  return {
    subscribe,
    update,
    getClubs,
    createClub,
  };
}

export const clubStore = createClubStore();
