import { LeagueService } from "../services/league-service";
import type {
  CreateLeagueDTO,
  UpdateLeagueDTO,
} from "../../../../declarations/backend/backend.did";
import type { LeagueStatus } from "../../../../declarations/data_canister/data_canister.did";

function createLeagueStore() {
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
    getLeagues,
    createLeague,
    updateLeague,
    getLeagueStatus,
  };
}

export const leagueStore = createLeagueStore();
