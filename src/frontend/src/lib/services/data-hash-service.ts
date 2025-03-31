import { ActorFactory } from "../utils/ActorFactory";
import { isError } from "../utils/helpers";
import type {
  DataHash,
  LeagueId,
} from "../../../../declarations/data_canister/data_canister.did";
import { authStore } from "$lib/stores/auth-store";

export class DataHashService {
  constructor() {}

  async getDataHashes(leagueId: LeagueId): Promise<DataHash[]> {
    const identityActor: any =
      await ActorFactory.createIdentityActor(
        authStore,
        process.env.BACKEND_CANISTER_ID ?? "",
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
