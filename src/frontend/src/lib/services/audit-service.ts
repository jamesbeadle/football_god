import { authStore } from "../stores/auth-store";
import { idlFactory } from "../../../../declarations/backend";
import { ActorFactory } from "../utils/ActorFactory";
import { isError } from "../utils/helpers";
import type { UserAuditDTO } from "../../../../declarations/backend/backend.did";

export class AuditService {
  constructor() {}

  async getUserAudit(page: number): Promise<UserAuditDTO | undefined> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.BACKEND_CANISTER_ID ?? "",
    );

    const result = await identityActor.getUserAudit(page);
    if (isError(result)) throw new Error("Failed to get user audit");
    return result.ok;
  }
}
