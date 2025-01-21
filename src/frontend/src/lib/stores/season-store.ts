import { writable } from "svelte/store";
import type { SeasonDTO } from "../../../../declarations/backend/backend.did";
import { SeasonService } from "$lib/services/season-service";
import { DataHashService } from "$lib/services/data-hash-service";
import { serializeData, deserializeData } from "$lib/utils/helpers";
import { MAX_CACHED_LEAGUES } from "$lib/constants/app.constants";

function createSeasonStore() {
  const { subscribe, update } = writable<Record<number, SeasonDTO[]>>({});

  let leagueCacheOrder: number[] = [];

  async function getSeasons(leagueId: number): Promise<SeasonDTO[]> {
    const seasons = await new SeasonService().getSeasons(leagueId);
    return seasons ?? [];
  }

  async function syncSeasons(leagueId: number) {
    try {
      const localHashKey = `seasons_hash_${leagueId}`;
      const localSeasonsKey = `seasons_${leagueId}`;

      const localHash = localStorage.getItem(localHashKey);
      const seasonHash = await new DataHashService().getCategoryHash(
        "seasons",
        leagueId,
      );

      let seasons: SeasonDTO[];

      if (!localHash || seasonHash !== localHash) {
        seasons = await getSeasons(leagueId);
        localStorage.setItem(localSeasonsKey, serializeData(seasons));
        localStorage.setItem(localHashKey, seasonHash || "");
      } else {
        const cached = localStorage.getItem(localSeasonsKey);
        if (cached) {
          seasons = deserializeData(cached) as SeasonDTO[];
        } else {
          seasons = await getSeasons(leagueId);
          localStorage.setItem(localSeasonsKey, serializeData(seasons));
        }
      }

      update((current: Record<number, SeasonDTO[]>) => ({
        ...current,
        [leagueId]: seasons,
      }));

      if (!leagueCacheOrder.includes(leagueId)) {
        leagueCacheOrder.push(leagueId);
      } else {
        leagueCacheOrder = leagueCacheOrder.filter((id) => id !== leagueId);
        leagueCacheOrder.push(leagueId);
      }

      if (leagueCacheOrder.length > MAX_CACHED_LEAGUES) {
        const leastUsedLeagueId = leagueCacheOrder.shift();
        if (leastUsedLeagueId !== undefined) {
          localStorage.removeItem(`seasons_${leastUsedLeagueId}`);
          localStorage.removeItem(`seasons_hash_${leastUsedLeagueId}`);
        }
      }
    } catch (error) {
      console.error(`Error syncing seasons for league ${leagueId}:`, error);
      const cached = localStorage.getItem(`seasons_${leagueId}`);
      if (cached) {
        const seasons = deserializeData(cached) as SeasonDTO[];
        update((current: Record<number, SeasonDTO[]>) => ({
          ...current,
          [leagueId]: seasons,
        }));
      }
    }
  }

  return {
    subscribe,
    getSeasons,
    syncSeasons,
  };
}

export const seasonStore = createSeasonStore();
