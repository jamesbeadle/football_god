import { authStore } from "../stores/auth-store";
import { idlFactory } from "../../../../declarations/backend";
import { ActorFactory } from "../utils/ActorFactory";
import { isError } from "../utils/helpers";
import type {
  SystemStateDTO,
  UpdateSystemStateDTO,
} from "../../../../declarations/backend/backend.did";

export class AdminService {
  private actor: any;

  constructor() {
    this.actor = ActorFactory.createActor(
      idlFactory,
      process.env.BACKEND_CANISTER_ID,
    );
  }

  async isDataManager(): Promise<boolean> {
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
    dto: UpdateSystemStateDTO,
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
}
