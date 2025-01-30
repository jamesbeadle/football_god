import type {
  ClubDTO,
  LeagueId,
} from "../../../../declarations/backend/backend.did";
import { idlFactory } from "../../../../declarations/backend";
import { ActorFactory } from "../utils/ActorFactory";
import { isError } from "../utils/helpers";
import { authStore } from "$lib/stores/auth-store";
import type { CreateClubDTO } from "../../../../declarations/data_canister/data_canister.did";
import { governanceStore } from "$lib/stores/governance-store";

export class ClubService {
  private actor: any;

  constructor() {
    this.actor = ActorFactory.createActor(
      idlFactory,
      process.env.BACKEND_CANISTER_ID,
    );
  }

  async getClubs(leagueId: LeagueId): Promise<ClubDTO[]> {
    const result = await this.actor.getLeagueClubs(leagueId);
    if (isError(result)) throw new Error("Failed to fetch clubs");
    return result.ok;
  }

  async createClub(dto: CreateClubDTO): Promise<void> {
    const result = await governanceStore.createClub(dto);
    if (isError(result)) throw new Error("Failed to create club");
  }
}
