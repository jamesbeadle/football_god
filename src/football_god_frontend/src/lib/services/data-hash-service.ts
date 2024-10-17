import { ActorFactory } from "../../utils/ActorFactory";
import { isError } from "../utils/helpers";
import { idlFactory } from "../../../../declarations/football_god_backend";

export class DataHashService {
  private actor: any;

  constructor() {
    this.actor = ActorFactory.createActor(
      idlFactory,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID,
    );
  }

  async getDataHashes(): Promise<DataHashDTO[]> {
    const result = await this.actor.getDataHashes();
    if (isError(result)) throw new Error("Failed to fetch data hashes");
    return result.ok;
  }
}
