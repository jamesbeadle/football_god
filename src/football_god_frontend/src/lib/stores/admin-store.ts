import { writable } from "svelte/store";
import { AdminService } from "../services/admin-service";
import type {
  CalculateGameweekScoresDTO,
  CalculateLeaderboardsDTO,
  ClubDTO,
  CreateClubDTO,
  CreateLeagueDTO,
  CreatePlayerDTO,
  LeagueId,
  LoanPlayerDTO,
  SnapshotManagersDTO,
  SystemStateDTO,
  TransferPlayerDTO,
  UpdateLeagueDTO,
  UpdatePlayerDTO,
  UpdateSystemStateDTO,
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

  async function getSystemState(
    applicationName: string,
  ): Promise<SystemStateDTO | undefined> {
    return new AdminService().getSystemState(applicationName);
  }

  async function updateSystemState(
    applicaitonName: string,
    dto: UpdateSystemStateDTO,
  ): Promise<any> {
    return new AdminService().updateSystemState(applicaitonName, dto);
  }

  async function snapshotManagers(dto: SnapshotManagersDTO): Promise<any> {
    return new AdminService().snapshotManagers(dto);
  }

  async function calculateGameweekScores(
    dto: CalculateGameweekScoresDTO,
  ): Promise<any> {
    return new AdminService().calculateGameweekScores(dto);
  }

  async function calculateLeaderboards(
    dto: CalculateLeaderboardsDTO,
  ): Promise<any> {
    return new AdminService().calculateLeaderboards(dto);
  }

  async function createClub(dto: CreateClubDTO): Promise<any> {
    console.log("dto");
    console.log(dto);
    return new AdminService().createClub(dto);
  }

  return {
    createLeague,
    updateLeague,
    transferPlayer,
    loanPlayer,
    createPlayer,
    updatePlayer,
    updateSystemState,
    snapshotManagers,
    calculateGameweekScores,
    calculateLeaderboards,
    createClub,
    getSystemState,
  };
}

export const adminStore = createAdminStore();
