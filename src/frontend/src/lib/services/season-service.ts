import { idlFactory } from "../../../../declarations/backend";
import { ActorFactory } from "$lib/utils/ActorFactory";
import { isError } from "$lib/utils/helpers";
import type { SeasonDTO } from "../../../../declarations/data_canister/data_canister.did";
import { authStore } from "$lib/stores/auth-store";

export class SeasonService {
  constructor() {}

  async getSeasons(leagueId: number): Promise<SeasonDTO[] | undefined> {
    const identityActor: any =
      await ActorFactory.createDataCanisterIdentityActor(
        authStore,
        process.env.DATA_CANISTER_CANISTER_ID ?? "",
      );
    const result = await identityActor.getSeasons(leagueId);
    if (isError(result)) throw new Error("Failed to fetch seasons");
    return result.ok;
  }
}
