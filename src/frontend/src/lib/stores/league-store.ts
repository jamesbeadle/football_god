import { writable } from "svelte/store";
import { LeagueService } from "../services/league-service";
import { DataHashService } from "$lib/services/data-hash-service";
import type {
  CreateLeagueDTO,
  UpdateLeagueDTO,
} from "../../../../declarations/backend/backend.did";
import type { LeagueStatus } from "../../../../declarations/data_canister/data_canister.did";

function createLeagueStore() {
  const { subscribe, set } = writable<any[]>([]);

  // Helper function to handle BigInt serialization
  function serializeData(data: any): any {
    return JSON.stringify(data, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    );
  }

  // Helper function to deserialize data
  function deserializeData(data: string): any {
    return JSON.parse(data, (_, value) => {
      // Look for strings that might be BigInt
      if (typeof value === 'string' && /^\d+n$/.test(value)) {
        return BigInt(value.slice(0, -1));
      }
      return value;
    });
  }

  async function syncLeagues() {
    try {
      const localHash = localStorage.getItem("leagues_hash");
      console.log("Current local hash:", localHash);
      
      const leagueHash = await new DataHashService().getLeaguesHash();
      console.log("Server hash:", leagueHash);

      if (!localHash || leagueHash !== localHash) {
        console.log("Fetching fresh data from server");
        const leagues = await getLeagues();
        
        // Use the serialize helper
        localStorage.setItem("leagues", serializeData(leagues));
        localStorage.setItem("leagues_hash", leagueHash || "");
        set(leagues);
      } else {
        console.log("Using cached data");
        const cached = localStorage.getItem("leagues");
        if (cached) {
          // Use the deserialize helper
          set(deserializeData(cached));
        } else {
          const leagues = await getLeagues();
          localStorage.setItem("leagues", serializeData(leagues));
          set(leagues);
        }
      }
    } catch (error) {
      console.error("Error syncing leagues:", error);
      const cached = localStorage.getItem("leagues");
      if (cached) set(deserializeData(cached));
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

  return {
    subscribe,
    syncLeagues,
    getLeagues,
    createLeague,
    updateLeague,
    getLeagueStatus,
  };
}

export const leagueStore = createLeagueStore();
