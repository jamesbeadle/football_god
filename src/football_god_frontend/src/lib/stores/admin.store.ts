import type { Euro2024PredictionDTO } from "../../../../declarations/football_god_backend/football_god_backend.did";
import { ActorFactory } from "../../utils/ActorFactory";
import { authStore } from "./auth.store";

function createAdminStore() {
  async function getEuro2024Entries(
    currentPage: number,
    itemsPerPage: number,
  ): Promise<Euro2024PredictionDTO[]> {
    const limit = itemsPerPage;
    const offset = (currentPage - 1) * limit;
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
    );
    let entries = await identityActor.adminGetEuro2024Entries(limit, offset);
    return entries;
  }

  async function deleteEuro2024Entry(principalId: string): Promise<boolean> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
    );
    let result = await identityActor.adminDelete2024Entry(principalId);
    return result;
  }

  return {
    getEuro2024Entries,
    deleteEuro2024Entry,
  };
}

export const adminStore = createAdminStore();
