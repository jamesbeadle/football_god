import { writable } from "svelte/store";
import type {
  ClubDTO,
  CreateClubDTO,
  LeagueId,
  RemoveClubDTO,
} from "../../../../declarations/backend/backend.did";
import { ClubService } from "../services/club-service";
import { DataHashService } from "../services/data-hash-service";
import { serializeData, deserializeData } from "../utils/helpers";
import { MAX_CACHED_LEAGUES } from "../constants/app.constants";
import { dev } from '$app/environment';
import { mockData } from "../local/mock-data";

function createClubStore() {
  const { subscribe, update } = writable<Record<number, ClubDTO[]>>({});

  async function getClubs(leagueId: LeagueId) {

    const cached = localStorage.getItem(`clubs_${leagueId}`);
    if (cached) {
      return deserializeData(cached) as ClubDTO[];
    }
    if (dev) {
      const clubData = mockData.clubs[leagueId];
      return clubData?.ok || clubData as ClubDTO[];
    }
    return new ClubService().getClubs(leagueId);
  }

  async function createClub(dto: CreateClubDTO): Promise<any> {
    return new ClubService().createClub(dto);
  }

  async function removeClub(dto: RemoveClubDTO): Promise<any> {
    return new ClubService().removeClub(dto);
  }

  return {
    subscribe,
    update,
    getClubs,
    createClub,
    removeClub,
  };
}

export const clubStore = createClubStore();
