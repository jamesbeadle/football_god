import type {
  ClubDTO,
  LeagueId,
} from "../../../../declarations/football_god_backend/football_god_backend.did";
import { idlFactory } from "../../../../declarations/football_god_backend";
import { ActorFactory } from "../../utils/ActorFactory";
import { isError } from "../utils/helpers";

export class ClubService {
  private actor: any;

  constructor() {
    this.actor = ActorFactory.createActor(
      idlFactory,
      process.env.OPENFPL_BACKEND_CANISTER_ID,
    );
  }

  async getClubs(leagueId: LeagueId): Promise<ClubDTO[]> {
    const result = await this.actor.getLeagueClubs(leagueId);
    if (isError(result)) throw new Error("Failed to fetch clubs");
    return result.ok;
  }
}
