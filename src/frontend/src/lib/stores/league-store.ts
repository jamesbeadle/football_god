import { LeagueService } from "../services/league-service";
import type {
  CreateLeagueDTO,
  UpdateLeagueDTO,
} from "../../../../declarations/backend/backend.did";

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

  return {
    getLeagues,
    createLeague,
    updateLeague,
  };
}

export const leagueStore = createLeagueStore();
