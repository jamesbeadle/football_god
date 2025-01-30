import { authStore } from "../stores/auth-store";
import { idlFactory } from "../../../../declarations/backend";
import { ActorFactory } from "../utils/ActorFactory";
import { isError } from "../utils/helpers";
import type {
  SystemStateDTO,
  UpdateAppStatusDTO,
} from "../../../../declarations/backend/backend.did";
import type { TimerInfo } from "../../../../declarations/data_canister/data_canister.did";

export class AdminService {
  constructor() {}

  async isDataManager(): Promise<boolean> {
    await authStore.sync();
    let isLoggedIn = false;
    authStore.subscribe((store) => {
      isLoggedIn = store.identity !== null && store.identity !== undefined;
    });
    if (!isLoggedIn) {
      return false;
    }
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      process.env.BACKEND_CANISTER_ID ?? "",
    );
    const result: any = await identityActor.isDataManager();
    if (isError(result)) {
      throw new Error("Failed to check is data manager");
    }
    return result.ok;
  }

  async isAdmin(): Promise<boolean> {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      process.env.BACKEND_CANISTER_ID ?? "",
    );
    const result: any = await identityActor.isAdmin();
    if (isError(result)) {
      throw new Error("Failed to check is admin");
    }
    return result.ok;
  }

  async isAuditor(): Promise<boolean> {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      process.env.BACKEND_CANISTER_ID ?? "",
    );
    const result: any = await identityActor.isAuditor();
    if (isError(result)) {
      throw new Error("Failed to check is auditor");
    }
    return result.ok;
  }

  async getSystemState(
    applicationName: string,
  ): Promise<SystemStateDTO | undefined> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.BACKEND_CANISTER_ID ?? "",
    );

    const result = await identityActor.getSystemState(applicationName);
    if (isError(result)) throw new Error("Failed to get system state");
    return result.ok;
  }

  async updateSystemState(
    applicationName: string,
    dto: UpdateAppStatusDTO,
  ): Promise<void> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.BACKEND_CANISTER_ID ?? "",
    );

    const result = await identityActor.updateSystemState(applicationName, dto);
    if (isError(result)) throw new Error("Failed to update system state");
  }

  async snapshotManagers(applicationName: string): Promise<void> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.BACKEND_CANISTER_ID ?? "",
    );

    const result = await identityActor.snapshotManagers(applicationName);
    if (isError(result)) throw new Error("Failed to snapshot managers");
  }

  async calculateGameweekScores(applicationName: string): Promise<void> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.BACKEND_CANISTER_ID ?? "",
    );

    const result = await identityActor.calculateGameweekScores(applicationName);
    if (isError(result)) throw new Error("Failed to calculate gameweek scores");
  }

  async calculateLeaderboards(applicationName: string): Promise<void> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.BACKEND_CANISTER_ID ?? "",
    );

    const result = await identityActor.calculateLeaderboards(applicationName);
    if (isError(result)) throw new Error("Failed to calculate leaderboards");
  }

  async calculateWeeklyRewards(
    applicationName: string,
    gameweek: number,
  ): Promise<void> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.BACKEND_CANISTER_ID ?? "",
    );

    const result = await identityActor.calculateWeeklyRewards(
      applicationName,
      gameweek,
    );
    if (isError(result)) throw new Error("Failed to calculate weekly rewards");
  }

  async payWeeklyRewards(
    applicationName: string,
    gameweek: number,
  ): Promise<void> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.BACKEND_CANISTER_ID ?? "",
    );

    const result = await identityActor.payWeeklyRewards(
      applicationName,
      gameweek,
    );

    if (isError(result)) throw new Error("Failed to pay weekly rewards");
  }

  async getTimers(): Promise<TimerInfo[]> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.BACKEND_CANISTER_ID ?? "",
    );

    const result = await identityActor.getTimers();
    if (isError(result)) throw new Error("Failed to fetch timers");
    return result.ok;
  }
}
