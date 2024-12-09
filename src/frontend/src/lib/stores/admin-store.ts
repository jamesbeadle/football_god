import { AdminService } from "../services/admin-service";
import type {
  UpdateSystemStateDTO,
  SystemStateDTO,
} from "../../../../declarations/backend/backend.did";

function createAdminStore() {
  async function getSystemState(
    applicationName: string,
  ): Promise<SystemStateDTO | undefined> {
    return new AdminService().getSystemState(applicationName);
  }

  async function updateSystemState(
    applicationName: string,
    dto: UpdateSystemStateDTO,
  ): Promise<any> {
    return new AdminService().updateSystemState(applicationName, dto);
  }

  async function snapshotManagers(applicationName: string): Promise<any> {
    return new AdminService().snapshotManagers(applicationName);
  }

  async function calculateGameweekScores(
    applicationName: string,
  ): Promise<any> {
    return new AdminService().calculateGameweekScores(applicationName);
  }

  async function calculateLeaderboards(applicationName: string): Promise<any> {
    return new AdminService().calculateLeaderboards(applicationName);
  }

  async function calculateWeeklyRewards(
    applicationName: string,
    gameweek: number,
  ): Promise<any> {
    return new AdminService().calculateWeeklyRewards(applicationName, gameweek);
  }

  async function payWeeklyRewards(
    applicationName: string,
    gameweek: number,
  ): Promise<any> {
    return new AdminService().payWeeklyRewards(applicationName, gameweek);
  }

  async function getTimers(): Promise<any> {
    return new AdminService().getTimers();
  }

  return {
    getSystemState,
    updateSystemState,
    calculateGameweekScores,
    calculateLeaderboards,
    calculateWeeklyRewards,
    snapshotManagers,
    payWeeklyRewards,
    getTimers,
  };
}

export const adminStore = createAdminStore();
