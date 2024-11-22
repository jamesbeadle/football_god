import type {
  PlayerDTO,
  LeagueId,
} from "../../../../declarations/backend/backend.did";
import { idlFactory } from "../../../../declarations/backend";
import { ActorFactory } from "../utils/ActorFactory";
import { isError } from "../utils/helpers";

export class PlayerService {
  private actor: any;

  constructor() {
    this.actor = ActorFactory.createActor(
      idlFactory,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID,
    );
  }

  async getPlayers(leagueId: LeagueId): Promise<PlayerDTO[]> {
    console.log("using actor to get players");
    console.log(`league id is ${leagueId}`);
    const result = await this.actor.getLeaguePlayers(leagueId);
    console.log(result);
    if (isError(result)) throw new Error("Failed to fetch players");
    return result.ok;
  }
}
