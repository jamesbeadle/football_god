import { writable } from "svelte/store";
import { AdminService } from "../services/admin-service";
import type {
  ClubDTO,
  CreateLeagueDTO,
  CreatePlayerDTO,
  LeagueId,
  LoanPlayerDTO,
  TransferPlayerDTO,
  UpdateLeagueDTO,
  UpdatePlayerDTO,
} from "../../../../declarations/football_god_backend/football_god_backend.did";

function createAdminStore() {
  //TODO: Create functions that call the governance endpoints directly

  async function transferPlayer(
    leagueId: LeagueId,
    dto: TransferPlayerDTO,
  ): Promise<any> {
    return new AdminService().transferPlayer(leagueId, dto);
  }

  async function loanPlayer(
    leagueId: LeagueId,
    dto: LoanPlayerDTO,
  ): Promise<any> {
    return new AdminService().loanPlayer(leagueId, dto);
  }

  async function createPlayer(
    leagueId: LeagueId,
    dto: CreatePlayerDTO,
  ): Promise<any> {
    return new AdminService().createPlayer(leagueId, dto);
  }

  async function updatePlayer(
    leagueId: LeagueId,
    dto: UpdatePlayerDTO,
  ): Promise<any> {
    return new AdminService().updatePlayer(leagueId, dto);
  }

  async function createLeague(dto: CreateLeagueDTO): Promise<any> {
    return new AdminService().createLeague(dto);
  }

  async function updateLeague(dto: UpdateLeagueDTO): Promise<any> {
    return new AdminService().updateLeague(dto);
  }

  return {
    createLeague,
    updateLeague,
    transferPlayer,
    loanPlayer,
    createPlayer,
    updatePlayer,
  };
}

export const adminStore = createAdminStore();
