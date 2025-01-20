import { writable } from "svelte/store";
import { LeagueService } from "../services/league-service";
import { DataHashService } from "$lib/services/data-hash-service";
import type {
  CreateLeagueDTO,
  UpdateLeagueDTO,
  FootballLeagueDTO,
} from "../../../../declarations/backend/backend.did";
import type { LeagueStatus } from "../../../../declarations/data_canister/data_canister.did";
import { serializeData, deserializeData } from "../utils/helpers";
function createLeagueStore() {
  const { subscribe, set } = writable<Record<number, FootballLeagueDTO>>({});

  async function syncLeagues() {
    try {
      await new DataHashService().refreshLeagueHashes();
      const localHash = localStorage.getItem("leagues_hash");
      console.log("Current local hash:", localHash);

      const leagueHash = await new DataHashService().getLeaguesHash();
      console.log("Server hash:", leagueHash);

      let leagues;

      if (!localHash || leagueHash !== localHash) {
        console.log("Fetching fresh data from server");
        leagues = await new LeagueService().getLeagues();
        localStorage.setItem("leagues", serializeData(leagues));
        localStorage.setItem("leagues_hash", leagueHash || "");
      } else {
        console.log("Using cached data");
        const cached = localStorage.getItem("leagues");
        if (cached) {
          leagues = deserializeData(cached) as FootballLeagueDTO[];
        } else {
          leagues = await new LeagueService().getLeagues();
          localStorage.setItem("leagues", serializeData(leagues));
        }
      }
      const leaguesDict: Record<number, FootballLeagueDTO> = leagues.reduce(
        (acc, league) => {
          acc[Number(league.id)] = league;
          return acc;
        },
        {} as Record<number, FootballLeagueDTO>,
      );
      set(leaguesDict);
    } catch (error) {
      console.error("Error syncing leagues:", error);
      const cached = localStorage.getItem("leagues");
      if (cached) {
        const leagues = deserializeData(cached) as FootballLeagueDTO[];
        const leaguesDict: Record<number, FootballLeagueDTO> = leagues.reduce(
          (acc, league) => {
            acc[Number(league.id)] = league;
            return acc;
          },
          {} as Record<number, FootballLeagueDTO>,
        );
        set(leaguesDict);
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
    return await new LeagueService().getLeagueStatus(leagueId);
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
  };
}

export const leagueStore = createLeagueStore();
