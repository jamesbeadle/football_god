import { writable } from "svelte/store";
import { LeagueService } from "../services/league-service";
import type {
  CreateLeagueDTO,
  FootballLeagueDTO,
  LeagueStatus,
  UpdateLeagueDTO,
} from "../../../../declarations/data_canister/data_canister.did";

function createLeagueStore() {
  const { subscribe, update } = writable<Record<number, FootballLeagueDTO>>({});
  const { subscribe: subscribeLeagueStatus, update: updateLeagueStatus } =
    writable<Record<number, LeagueStatus>>({});

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
    return data[leagueId];
  }

  return {
    subscribe,
    update,
    getLeagues,
    createLeague,
    updateLeague,
    getLeagueStatus,
    getLeagueById,
    subscribeLeagueStatus,
    updateLeagueStatus,
  };
}

export const leagueStore = createLeagueStore();
