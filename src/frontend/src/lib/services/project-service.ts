import { authStore } from "../stores/auth-store";
import { isError } from "../utils/helpers";
import { idlFactory } from "../../../../declarations/backend";
import type {
  CanisterDTO,
  ProjectDTO,
} from "../../../../declarations/backend/backend.did";
import { ActorFactory } from "../utils/ActorFactory";

export class ProjectService {
  private actor: any;

  constructor() {
    this.actor = ActorFactory.createActor(
      idlFactory,
      process.env.BACKEND_CANISTER_ID,
    );
  }

  async getProjects(): Promise<ProjectDTO[]> {
    const result = await this.actor.getProjects();
    if (isError(result)) throw new Error("Failed to fetch projects");
    return result.ok;
  }

  async getProjectCanisterInfo(projectId: number): Promise<CanisterDTO[]> {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      process.env.BACKEND_CANISTER_ID ?? "",
    );

    const result = (await identityActor.getProjectCanisterInfo(
      projectId,
    )) as any;
    if (isError(result))
      throw new Error("Failed to fetch project canister info");
    return result.ok;
  }

  async topupCanister(canisterId: string, cycles: bigint): Promise<any> {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      process.env.BACKEND_CANISTER_ID ?? "",
    );

    const result = (await identityActor.topupCanister(
      canisterId,
      cycles,
    )) as any;
    if (isError(result)) throw new Error("Failed to topup canister");
    return result.ok;
  }
}
