import { idlFactory } from "../../../../declarations/backend";
import { ActorFactory } from "../utils/ActorFactory";
import type { DataHashDTO } from "../../../../declarations/backend/backend.did";
import { isError } from "../utils/helpers";

export class DataHashService {
  private readonly actor: any;

  constructor() {
    const canisterId = process.env.BACKEND_CANISTER_ID;
    if (!canisterId) {
      throw new Error("Backend canister ID not found in environment variables");
    }

    this.actor = ActorFactory.createActor(idlFactory, canisterId);
  }

  async getDataHashes(): Promise<DataHashDTO[]> {
    const result = await this.actor.getDataHashes();
    if (isError(result)) throw new Error("Failed to fetch data hashes");
    return result.ok;
  }

  async getLeaguesHash(): Promise<string | undefined> {
    try {
      const allHashes = await this.getDataHashes();
      const leagueEntry = allHashes.find((entry) => entry.category === "leagues");
      return leagueEntry?.hash;
    } catch (error) {
      console.error("Failed to get leagues hash:", error);
      return undefined;
    }
  }
}
