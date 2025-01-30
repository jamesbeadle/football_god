import { idlFactory } from "../../../../declarations/backend";
import { ActorFactory } from "../utils/ActorFactory";
import type { DataHashDTO } from "../../../../declarations/backend/backend.did";
import { isError } from "../utils/helpers";

export class DataHashService {
  private readonly actor: any;

  constructor() {
    const canisterId = process.env.DATA_CANISTER_CANISTER_ID;
    if (!canisterId) {
      throw new Error("Backend canister ID not found in environment variables");
    }

    this.actor = ActorFactory.createActor(idlFactory, canisterId);
  }

  async refreshLeagueHashes(): Promise<void> {
    const response = await this.actor.refreshLeagueHashes();
    if (isError(response)) {
      console.error("Error refreshing hashes:", response.err);
      throw new Error("Failed to refresh league hashes");
    }
  }

  async getDataHashes(): Promise<DataHashDTO[]> {
    const result = await this.actor.getDataHashes();
    if (isError(result)) throw new Error("Failed to fetch data hashes");
    return result.ok;
  }

  async getLeaguesHash(): Promise<string | null> {
    try {
      await this.refreshLeagueHashes();
      const allHashes = await this.getDataHashes();
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
      await this.refreshLeagueHashes();
      const allHashes = await this.getDataHashes();
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
