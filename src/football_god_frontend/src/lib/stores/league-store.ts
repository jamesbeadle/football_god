import { writable } from "svelte/store";
import { LeagueService } from "$lib/services/league-service";
import type {
  FootballLeagueDTO,
  Gender,
  LeagueId,
} from "../../../../declarations/football_god_backend/football_god_backend.did";

function createLeagueStore() {
  const { subscribe, set } = writable<FootballLeagueDTO[]>([]);

  async function updateName(
    leagueId: LeagueId,
    leagueName: string,
  ): Promise<any> {
    return new LeagueService().setLeagueName(leagueId, leagueName);
  }

  async function updateAbbreviatedName(
    leagueId: LeagueId,
    abbreviatedName: string,
  ): Promise<any> {
    return new LeagueService().setAbbreviatedName(leagueId, abbreviatedName);
  }

  async function updateGoverningBody(
    leagueId: LeagueId,
    governingBody: string,
  ): Promise<any> {
    return new LeagueService().setGoverningBody(leagueId, governingBody);
  }

  async function updateGender(
    leagueId: LeagueId,
    gender: Gender,
  ): Promise<any> {
    return new LeagueService().setGender(leagueId, gender);
  }

  async function updateDateFormed(
    leagueId: LeagueId,
    dateFormed: bigint,
  ): Promise<any> {
    return new LeagueService().setDateFormed(leagueId, dateFormed);
  }

  async function updateCountryId(
    leagueId: LeagueId,
    countryId: number,
  ): Promise<any> {
    return new LeagueService().setCountryId(leagueId, countryId);
  }

  async function updateLogo(
    leagueId: LeagueId,
    logo: Uint8Array,
  ): Promise<any> {
    return new LeagueService().setLogo(leagueId, logo);
  }

  async function updateTeamCount(
    leagueId: LeagueId,
    teamCount: number,
  ): Promise<any> {
    return new LeagueService().setTeamCount(leagueId, teamCount);
  }

  return {
    subscribe,
    setLeagues: (leagues: FootballLeagueDTO[]) => set(leagues),
    updateName,
    updateAbbreviatedName,
    updateGoverningBody,
    updateGender,
    updateDateFormed,
    updateCountryId,
    updateLogo,
    updateTeamCount,
  };
}

export const leagueStore = createLeagueStore();
