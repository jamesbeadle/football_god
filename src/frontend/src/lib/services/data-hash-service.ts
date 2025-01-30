import { idlFactory } from "../../../../declarations/data_canister";
import { ActorFactory } from "../utils/ActorFactory";
import type { DataHashDTO } from "../../../../declarations/backend/backend.did";
import { isError } from "../utils/helpers";
import type { LeagueId } from "../../../../declarations/data_canister/data_canister.did";
import { authStore } from "$lib/stores/auth-store";

export class DataHashService {
  constructor() {}

  async getDataHashes(leagueId: LeagueId): Promise<DataHashDTO[]> {
    const identityActor: any =
      await ActorFactory.createDataCanisterIdentityActor(
        authStore,
        process.env.DATA_CANISTER_CANISTER_ID ?? "",
      );
    const result = await identityActor.getDataHashes(leagueId);
    if (isError(result)) throw new Error("Failed to fetch data hashes");
    return result.ok;
  }

  async getLeaguesHash(leagueId: LeagueId): Promise<string | null> {
    try {
      const allHashes = await this.getDataHashes(leagueId);
      const leagueEntry = allHashes.find(
        (entry) => entry.category === "leagues",
      );
      return leagueEntry?.hash ?? null;
    } catch (error) {
      console.error("Failed to get leagues hash:", error);
      return null;
    }
  }

  async getCategoryHash(
    category: string,
    leagueId: number,
  ): Promise<string | null> {
    try {
      const allHashes = await this.getDataHashes(leagueId);
      const entry = allHashes.find(
        (hash) => hash.category === `${category}_${leagueId}`,
      );
      return entry?.hash ?? null;
    } catch (error) {
      console.error(
        `Failed to get ${category} hash for league ${leagueId}:`,
        error,
      );
      return null;
    }
  }
}
