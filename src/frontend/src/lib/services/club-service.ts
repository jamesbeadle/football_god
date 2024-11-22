import type {
  ClubDTO,
  LeagueId,
} from "../../../../declarations/backend/backend.did";
import { idlFactory } from "../../../../declarations/backend";
import { ActorFactory } from "../utils/ActorFactory";
import { isError } from "../utils/helpers";

export class ClubService {
  private actor: any;

  constructor() {
    this.actor = ActorFactory.createActor(
      idlFactory,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID,
    );
  }

  async getClubs(leagueId: LeagueId): Promise<ClubDTO[]> {
    const result = await this.actor.getLeagueClubs(leagueId);
    console.log(result);
    if (isError(result)) throw new Error("Failed to fetch clubs");
    return result.ok;
  }
}
