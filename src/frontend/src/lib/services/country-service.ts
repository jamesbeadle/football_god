import { ActorFactory } from "../utils/ActorFactory";
import { isError } from "../utils/helpers";
import { authStore } from "$lib/stores/auth-store";
import type {
  Countries,
  GetCountries,
} from "../../../../declarations/backend/backend.did";

export class CountryService {
  constructor() {}

  async getCountries(): Promise<Countries | undefined> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.BACKEND_CANISTER_ID ?? "",
    );
    let dto: GetCountries = {};
    const result = await identityActor.getCountries(dto);
    if (isError(result)) throw new Error("Failed to fetch countries");
    return result.ok;
  }
}
