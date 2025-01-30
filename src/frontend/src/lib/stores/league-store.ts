import { writable } from "svelte/store";
import { LeagueService } from "../services/league-service";
import type {
  CreateLeagueDTO,
  UpdateLeagueDTO,
  FootballLeagueDTO,
  LeagueStatus,
} from "../../../../declarations/backend/backend.did";

import { mockData } from "../local/mock-data";
import { dev } from '$app/environment';
import { deserializeData } from "../utils/helpers";

function createLeagueStore() {
  const { subscribe, update } = writable<Record<number, FootballLeagueDTO>>({});
  const { subscribe: subscribeLeagueStatus, update: updateLeagueStatus } =
    writable<Record<number, LeagueStatus>>({});

  async function getLeagues() {
    if (dev) {
      return mockData.leagues as FootballLeagueDTO[];
    }
    return new LeagueService().getLeagues();
  }

  async function createLeague(dto: CreateLeagueDTO): Promise<any> {
    return new LeagueService().createLeague(dto);
  }

  async function updateLeague(dto: UpdateLeagueDTO): Promise<any> {
    return new LeagueService().updateLeague(dto);
  }

  async function getLeagueStatus(leagueId: number): Promise<LeagueStatus> {
    const cached = localStorage.getItem(`league_status_${leagueId}`);
    if (cached) {
      return deserializeData(cached) as LeagueStatus;
    }
    if (dev) {
      const leagueStatusData = mockData.league_status[leagueId];
      return leagueStatusData?.ok || leagueStatusData as LeagueStatus;
    }
    return new LeagueService().getLeagueStatus(leagueId);
  }

  function getLeagueById(leagueId: number): FootballLeagueDTO | undefined {
    if (dev) {
      return mockData.leagues[leagueId-1];
    }
    
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
