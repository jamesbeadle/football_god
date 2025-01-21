import { idlFactory } from "../../../../declarations/backend";
import { ActorFactory } from "$lib/utils/ActorFactory";
import { isError } from "$lib/utils/helpers";
import type { SeasonDTO } from "../../../../declarations/backend/backend.did";

export class SeasonService {
  private actor: any;

  constructor() {
    this.actor = ActorFactory.createActor(
      idlFactory,
      process.env.BACKEND_CANISTER_ID,
    );
  }

  async getSeasons(leagueId: number): Promise<SeasonDTO[] | undefined> {
    const result = await this.actor.getSeasons(leagueId);
    if (isError(result)) throw new Error("Failed to fetch seasons");
    return result.ok;
  }
}
