import { writable } from "svelte/store";
import { SeasonService } from "$lib/services/season-service";
import type {
  Season,
  Seasons,
} from "../../../../declarations/backend/backend.did";

function createSeasonStore() {
  const { subscribe, set } = writable<Seasons | undefined>(undefined);

  async function getSeasons(leagueId: number): Promise<Seasons | undefined> {
    const seasons = await new SeasonService().getSeasons(leagueId);
    return seasons;
  }

  async function getSeasonName(seasonId: number): Promise<string | undefined> {
    let seasons: Season[] = [];
    await subscribe((value) => {
      seasons = value?.seasons!;
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
    setSeasons: (seasons: Seasons) => set(seasons),
    getSeasons,
    getSeasonName,
  };
}

export const seasonStore = createSeasonStore();
