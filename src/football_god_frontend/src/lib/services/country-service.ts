import { ActorFactory } from "../../utils/ActorFactory";
import { isError } from "../utils/helpers";
import { idlFactory } from "../../../../declarations/football_god_backend";
import type { CountryDTO } from "../../../../declarations/football_god_backend/football_god_backend.did";

export class CountryService {
  private actor: any;

  constructor() {
    this.actor = ActorFactory.createActor(
      idlFactory,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID,
    );
  }

  async getCountries(): Promise<CountryDTO[]> {
    const result = await this.actor.getCountries();
    if (isError(result)) throw new Error("Failed to fetch countries");
    return result.ok;
  }
}
