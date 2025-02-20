import { writable } from "svelte/store";
import { SeasonService } from "$lib/services/season-service";
import type { SeasonDTO } from "../../../../declarations/data_canister/data_canister.did";

function createSeasonStore() {
  const { subscribe, set } = writable<SeasonDTO[]>([]);

  async function getSeasons(leagueId: number): Promise<SeasonDTO[]> {
    const seasons = await new SeasonService().getSeasons(leagueId);
    return seasons ?? [];
  }

  async function getSeasonName(seasonId: number): Promise<string | undefined> {
    let seasons: SeasonDTO[] = [];
    await subscribe((value) => {
      seasons = value;
    })();

    if (seasons.length == 0) {
      return;
    }

    let season = seasons.find((x) => x.id == seasonId);
    if (season == null) {
      return;
    }
    return season.name;
  }

  return {
    subscribe,
    setSeasons: (seasons: SeasonDTO[]) => set(seasons),
    getSeasons,
    getSeasonName,
  };
}

export const seasonStore = createSeasonStore();
