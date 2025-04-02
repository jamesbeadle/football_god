import { ActorFactory } from "$lib/utils/ActorFactory";
import { isError } from "$lib/utils/helpers";
import type {
  GetSeasons,
  Season,
  Seasons,
} from "../../../../declarations/data_canister/data_canister.did";
import { authStore } from "$lib/stores/auth-store";

export class SeasonService {
  constructor() {}

  async getSeasons(leagueId: number): Promise<Seasons | undefined> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.BACKEND_CANISTER_ID ?? "",
    );
    let dto: GetSeasons = { leagueId };
    const result = await identityActor.getSeasons(dto);
    if (isError(result)) throw new Error("Failed to fetch seasons");
    return result.ok;
  }
}
