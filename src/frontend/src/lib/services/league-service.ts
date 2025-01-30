import { authStore } from "../stores/auth-store";
import { ActorFactory } from "../utils/ActorFactory";
import { isError } from "../utils/helpers";
import type {
  CreateLeagueDTO,
  FootballLeagueDTO,
  LeagueStatus,
  UpdateLeagueDTO,
} from "../../../../declarations/data_canister/data_canister.did";

export class LeagueService {
  constructor() {}

  async getLeagues(): Promise<FootballLeagueDTO[]> {
    const identityActor: any =
      await ActorFactory.createDataCanisterIdentityActor(
        authStore,
        process.env.DATA_CANISTER_CANISTER_ID ?? "",
      );
    console.log(identityActor);
    const result = await identityActor.getLeagues();
    if (isError(result)) throw new Error("Failed to fetch leagues");
    return result.ok;
  }

  async createLeague(dto: CreateLeagueDTO): Promise<void> {
    const identityActor: any =
      await ActorFactory.createDataCanisterIdentityActor(
        authStore,
        process.env.DATA_CANISTER_CANISTER_ID ?? "",
      );

    const result = await identityActor.executeCreateLeague(dto);
    if (isError(result)) throw new Error("Failed to create league");
  }

  async updateLeague(dto: UpdateLeagueDTO): Promise<void> {
    const identityActor: any =
      await ActorFactory.createDataCanisterIdentityActor(
        authStore,
        process.env.BACKEND_CANISTER_ID ?? "",
      );

    const result = await identityActor.executeUpdateLeague(dto);
    if (isError(result)) throw new Error("Failed to update league");
  }

  async getLeagueStatus(leagueId: number): Promise<LeagueStatus> {
    const identityActor: any =
      await ActorFactory.createDataCanisterIdentityActor(
        authStore,
        process.env.DATA_CANISTER_CANISTER_ID ?? "",
      );
    const result = await identityActor.getLeagueStatus(leagueId);
    if (isError(result)) throw new Error("Failed to fetch league status");
    return result.ok;
  }
}
