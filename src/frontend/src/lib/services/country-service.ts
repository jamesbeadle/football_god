import { ActorFactory } from "../utils/ActorFactory";
import { isError } from "../utils/helpers";
import type { CountryDTO } from "../../../../declarations/data_canister/data_canister.did";
import { authStore } from "$lib/stores/auth-store";

export class CountryService {
  constructor() {}

  async getCountries(): Promise<CountryDTO[]> {
    const identityActor: any =
      await ActorFactory.createDataCanisterIdentityActor(
        authStore,
        process.env.DATA_CANISTER_CANISTER_ID ?? "",
      );
    const result = await identityActor.getCountries();
    if (isError(result)) throw new Error("Failed to fetch countries");
    return result.ok;
  }
}
