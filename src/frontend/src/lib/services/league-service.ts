import type {
  GetLeagues,
  GetLeagueStatus,
  Leagues,
  LeagueId,
  LeagueStatus,
} from "../../../../declarations/backend/backend.did";
import { authStore } from "../stores/auth-store";
import { ActorFactory } from "../utils/ActorFactory";
import { isError } from "../utils/helpers";

export class LeagueService {
  constructor() {}

  async getLeagues(): Promise<Leagues | undefined> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.BACKEND_CANISTER_ID ?? "",
    );
    let dto: GetLeagues = {};
    const result = await identityActor.getLeagues(dto);
    if (isError(result)) throw new Error("Failed to fetch leagues");
    return result.ok;
  }

  async getLeagueStatus(leagueId: LeagueId): Promise<LeagueStatus | undefined> {
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
