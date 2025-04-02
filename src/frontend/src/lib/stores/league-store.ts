import { writable } from "svelte/store";
import type {
  League,
  LeagueId,
  Leagues,
  LeagueStatus,
} from "../../../../declarations/data_canister/data_canister.did";
import { LeagueService } from "$lib/services/league-service";

function createLeagueStore() {
  const { subscribe, set } = writable<Leagues | undefined>(undefined);
  const { subscribe: subscribeLeagueStatus, set: setLeagueStatus } = writable<
    LeagueStatus[] | null
  >(null);

  async function getLeagues() : Promise<Leagues | undefined> {
    return new LeagueService().getLeagues();
  }

  async function getLeagueStatus(leagueId: LeagueId): Promise<LeagueStatus | undefined> {
    return new LeagueService().getLeagueStatus(leagueId);
  }

  async function getActiveOrUnplayedGameweek(
    leagueId: number,
  ): Promise<number> {
    let leagueStatus: LeagueStatus | null = null;
    subscribeLeagueStatus((result) => {
      if (!result || !result[0]) {
        throw new Error("Failed to subscribe to league store");
      }
      leagueStatus = result[leagueId];
      if (!leagueStatus) {
        return 0;
      }
      return leagueStatus.activeGameweek === 0
        ? leagueStatus.unplayedGameweek
        : leagueStatus.activeGameweek;
    });
    return 0;
  }

  return {
    subscribe,
    setLeagues: (leagues: Leagues) => set(leagues),
    setLeagueStatus: (leagueStatus: LeagueStatus[]) =>
      setLeagueStatus(leagueStatus),
    getLeagues,
    getLeagueStatus,
    subscribeLeagueStatus,
    getActiveOrUnplayedGameweek,
  };
}

export const leagueStore = createLeagueStore();
