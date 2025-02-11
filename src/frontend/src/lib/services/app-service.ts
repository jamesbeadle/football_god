import type { AppStatusDTO } from "../../../../declarations/backend/backend.did";
import { authStore } from "../stores/auth-store";
import { ActorFactory } from "../utils/ActorFactory";
import { isError } from "../utils/helpers";

export class AppService {
  constructor() {}

  async getAppStatus(): Promise<AppStatusDTO | undefined> {
    const identityActor: any = await ActorFactory.createBackendIdentityActor(
      authStore,
      process.env.BACKEND_CANISTER_ID ?? "",
    );

    const result = await identityActor.getAppStatus();
    if (isError(result)) throw new Error("Failed to get app status");
    return result.ok;
  }
}
