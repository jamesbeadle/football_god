import { ActorFactory } from "../utils/ActorFactory";
import { isError } from "../utils/helpers";
import type {
  Country,
  GetCountries,
} from "../../../../declarations/data_canister/data_canister.did";
import { authStore } from "$lib/stores/auth-store";

export class CountryService {
  constructor() {}

  async getCountries(): Promise<Country[]> {
    const identityActor: any =
      await ActorFactory.createIdentityActor(
        authStore,
        process.env.BACKEND_CANISTER_ID ?? "",
      );
    let dto: GetCountries = {};
    const result = await identityActor.getCountries(dto);
    if (isError(result)) throw new Error("Failed to fetch countries");
    return result.ok;
  }
}
