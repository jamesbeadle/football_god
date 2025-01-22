import { writable } from "svelte/store";
import { LeagueService } from "../services/league-service";
import { DataHashService } from "$lib/services/data-hash-service";
import type {
  CreateLeagueDTO,
  UpdateLeagueDTO,
  FootballLeagueDTO,
  LeagueStatus,
} from "../../../../declarations/backend/backend.did";
import { serializeData, deserializeData } from "../utils/helpers";
import { MAX_CACHED_LEAGUES } from "../constants/app.constants";

function createLeagueStore() {
  const { subscribe, update } = writable<Record<number, FootballLeagueDTO>>({});
  const { subscribe: subscribeLeagueStatus, update: updateLeagueStatus } =
    writable<Record<number, LeagueStatus>>({});

  let leagueCacheOrder: number[] = [];

  async function syncLeagues(toggledLeagueId?: number) {
    try {
      const localHashKey = "leagues_hash";
      const localLeaguesKey = "leagues";

      const localHash = localStorage.getItem(localHashKey);
      const leagueHash = await new DataHashService().getLeaguesHash();

      let leagues: FootballLeagueDTO[];

      if (!localHash || leagueHash !== localHash) {
        leagues = await getLeagues();
        localStorage.setItem(localLeaguesKey, serializeData(leagues));
        localStorage.setItem(localHashKey, leagueHash || "");
      } else {
        const cached = localStorage.getItem(localLeaguesKey);
        if (cached) {
          const cachedLeagues = deserializeData(cached) as FootballLeagueDTO[];
          const serverLeagues = await getLeagues();

          const cachedLeagueMap = new Map(
            cachedLeagues.map((league) => [league.id, league]),
          );
          serverLeagues.forEach((serverLeague) => {
            cachedLeagueMap.set(serverLeague.id, serverLeague);
          });
          leagues = Array.from(
            new Map(
              serverLeagues.map((league) => [league.id, league]),
            ).values(),
          );
        } else {
          leagues = await getLeagues();
          localStorage.setItem(localLeaguesKey, serializeData(leagues));
        }
      }

      if (toggledLeagueId !== undefined) {
        if (!leagueCacheOrder.includes(toggledLeagueId)) {
          leagueCacheOrder.push(toggledLeagueId);
        } else {
          leagueCacheOrder = leagueCacheOrder.filter(
            (id) => id !== toggledLeagueId,
          );
          leagueCacheOrder.push(toggledLeagueId);
        }
      }

      const excessLeagues = leagueCacheOrder.slice(
        0,
        leagueCacheOrder.length - MAX_CACHED_LEAGUES,
      );
      const filteredLeagues = leagueCacheOrder
        .slice(-MAX_CACHED_LEAGUES)
        .map((id) => leagues.find((league) => league.id === id))
        .filter((league): league is FootballLeagueDTO => league !== undefined);

      localStorage.setItem(localLeaguesKey, serializeData(filteredLeagues));

      excessLeagues.forEach((excessLeagueId) => {
        leagueCacheOrder = leagueCacheOrder.filter(
          (id) => id !== excessLeagueId,
        );
      });

      update((current) =>
        filteredLeagues.reduce(
          (acc, league) => {
            acc[league.id] = league;
            return acc;
          },
          {} as Record<number, FootballLeagueDTO>,
        ),
      );
    } catch (error) {
      console.error("Error syncing leagues:", error);

      const cached = localStorage.getItem("leagues");
      if (cached) {
        const leagues = deserializeData(cached) as FootballLeagueDTO[];
        update((current) =>
          leagues.reduce(
            (acc, league) => {
              acc[league.id] = league;
              return acc;
            },
            {} as Record<number, FootballLeagueDTO>,
          ),
        );
      }
    }
  }

  async function syncLeagueStatus(leagueId: number) {
    try {
      const localHashKey = `league_status_hash_${leagueId}`;
      const localLeagueStatusKey = `league_status_${leagueId}`;

      const localHash = localStorage.getItem(localHashKey);
      const leagueStatusHash = await new DataHashService().getCategoryHash(
        "league_status",
        leagueId,
      );

      let leagueStatus: LeagueStatus;

      if (!localHash || leagueStatusHash !== localHash) {
        leagueStatus = await getLeagueStatus(leagueId);
        localStorage.setItem(localLeagueStatusKey, serializeData(leagueStatus));
        localStorage.setItem(localHashKey, leagueStatusHash || "");
      } else {
        const cached = localStorage.getItem(localLeagueStatusKey);
        if (cached) {
          leagueStatus = deserializeData(cached) as LeagueStatus;
        } else {
          leagueStatus = await getLeagueStatus(leagueId);
          localStorage.setItem(
            localLeagueStatusKey,
            serializeData(leagueStatus),
          );
        }
      }

      let currentStatuses: Record<number, LeagueStatus> = {};
      const unsubscribe = subscribeLeagueStatus((value) => {
        currentStatuses = value;
      });
      unsubscribe();

      updateLeagueStatus((currentStatuses) => ({
        ...currentStatuses,
        [leagueId]: leagueStatus,
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
          localStorage.removeItem(`league_status_${leastUsedLeagueId}`);
          localStorage.removeItem(`league_status_hash_${leastUsedLeagueId}`);
        }
      }
    } catch (error) {
      console.error(
        `Error syncing league status for league ${leagueId}:`,
        error,
      );
      const cached = localStorage.getItem(`league_status_${leagueId}`);
      if (cached) {
        const leagueStatus = deserializeData(cached) as LeagueStatus;
        updateLeagueStatus((currentStatuses) => ({
          ...currentStatuses,
          [leagueId]: leagueStatus,
        }));
      }
    }
  }

  async function getLeagues() {
    return new LeagueService().getLeagues();
  }

  async function createLeague(dto: CreateLeagueDTO): Promise<any> {
    return new LeagueService().createLeague(dto);
  }

  async function updateLeague(dto: UpdateLeagueDTO): Promise<any> {
    return new LeagueService().updateLeague(dto);
  }

  async function getLeagueStatus(leagueId: number): Promise<LeagueStatus> {
    return new LeagueService().getLeagueStatus(leagueId);
  }

  function getLeagueById(leagueId: number): FootballLeagueDTO | undefined {
    let data: Record<number, FootballLeagueDTO> = {};
    const unsubscribe = subscribe((value) => {
      data = value;
    });
    unsubscribe();

    return data[leagueId]; // Directly access the league by its id
  }

  return {
    subscribe,
    syncLeagues,
    getLeagues,
    createLeague,
    updateLeague,
    getLeagueStatus,
    getLeagueById,
    syncLeagueStatus,
    subscribeLeagueStatus,
  };
}

export const leagueStore = createLeagueStore();
