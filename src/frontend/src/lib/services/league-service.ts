import { authStore } from "../stores/auth-store";
import { ActorFactory } from "../utils/ActorFactory";
import { isError } from "../utils/helpers";
import type {
  GetLeagues,
  GetLeagueStatus,
  Leagues,
  LeagueId,
  LeagueStatus,
} from "../../../../declarations/data_canister/data_canister.did";

export class LeagueService {
  constructor() {}

  async getLeagues(): Promise<Leagues> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.BACKEND_CANISTER_ID ?? "",
    );
    let dto: GetLeagues = {};
    const result = await identityActor.getLeagues(dto);
    if (isError(result)) throw new Error("Failed to fetch leagues");
    return result.ok;
  }

  async getLeagueStatus(leagueId: LeagueId): Promise<LeagueStatus> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.BACKEND_CANISTER_ID ?? "",
    );
    let dto: GetLeagueStatus = { leagueId };
    const result = await identityActor.getLeagueStatus(dto);
    if (isError(result)) throw new Error("Failed to fetch league status");
    return result.ok;
  }
}
