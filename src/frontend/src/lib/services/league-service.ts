import { authStore } from "../stores/auth-store";
import { idlFactory } from "../../../../declarations/backend";
import type {
  CreateLeagueDTO,
  FootballLeagueDTO,
  UpdateLeagueDTO,
} from "../../../../declarations/backend/backend.did";
import { ActorFactory } from "../utils/ActorFactory";
import { isError } from "../utils/helpers";

export class LeagueService {
  private actor: any;

  constructor() {
    this.actor = ActorFactory.createActor(
      idlFactory,
      process.env.BACKEND_CANISTER_ID,
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
      process.env.BACKEND_CANISTER_ID ?? "",
    );

    const result = await identityActor.executeCreateLeague(dto);
    if (isError(result)) throw new Error("Failed to create league");
  }

  async updateLeague(dto: UpdateLeagueDTO): Promise<void> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.BACKEND_CANISTER_ID ?? "",
    );

    const result = await identityActor.executeUpdateLeague(dto);
    if (isError(result)) throw new Error("Failed to update league");
  }
}
