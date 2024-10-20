import { authStore } from "$lib/stores/auth-store";
import { idlFactory } from "../../../../declarations/football_god_backend";
import type {
  CreateLeagueDTO,
  FootballLeagueDTO,
  Gender,
  LeagueId,
  UpdateLeagueDTO,
} from "../../../../declarations/football_god_backend/football_god_backend.did";
import { ActorFactory } from "../../utils/ActorFactory";
import { isError } from "../utils/helpers";

export class LeagueService {
  private actor: any;

  constructor() {
    this.actor = ActorFactory.createActor(
      idlFactory,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID,
    );
  }

  async getLeagues(): Promise<FootballLeagueDTO[]> {
    const result = await this.actor.getLeagues();
    if (isError(result)) throw new Error("Failed to fetch leagues");
    return result.ok;
  }

  async createLeague(dto: CreateLeagueDTO): Promise<void> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
    );

    const result = await identityActor.createLeague(dto);
    if (isError(result)) throw new Error("Failed to create league");
  }

  async updateLeague(dto: UpdateLeagueDTO): Promise<void> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
    );

    const result = await identityActor.updateLeague(dto);
    if (isError(result)) throw new Error("Failed to update league");
  }
}
