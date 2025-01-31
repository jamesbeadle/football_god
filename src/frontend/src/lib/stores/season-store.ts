import { writable } from "svelte/store";
import { SeasonService } from "$lib/services/season-service";
import type { SeasonDTO } from "../../../../declarations/data_canister/data_canister.did";

function createSeasonStore() {
  const { subscribe, update } = writable<Record<number, SeasonDTO[]>>({});

  async function getSeasons(leagueId: number): Promise<SeasonDTO[]> {
    const seasons = await new SeasonService().getSeasons(leagueId);
    return seasons ?? [];
  }

  return {
    subscribe,
    getSeasons,
  };
}

export const seasonStore = createSeasonStore();
