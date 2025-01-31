import { ActorFactory } from "../utils/ActorFactory";
import { isError } from "../utils/helpers";
import type {
  ClubDTO,
  CreateClubDTO,
  LeagueId,
} from "../../../../declarations/data_canister/data_canister.did";
import { governanceStore } from "$lib/stores/governance-store";
import { authStore } from "$lib/stores/auth-store";

export class ClubService {
  constructor() {}

  async getClubs(leagueId: LeagueId): Promise<ClubDTO[]> {
    const identityActor: any =
      await ActorFactory.createDataCanisterIdentityActor(
        authStore,
        process.env.DATA_CANISTER_ID ?? "",
      );

    const result = await identityActor.getClubs(leagueId);
    if (isError(result)) throw new Error("Failed to fetch clubs");
    return result.ok;
  }

  async createClub(dto: CreateClubDTO): Promise<void> {
    const result = await governanceStore.createClub(dto);
    if (isError(result)) throw new Error("Failed to create club");
  }
}
