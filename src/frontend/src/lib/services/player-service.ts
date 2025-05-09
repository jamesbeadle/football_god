import { ActorFactory } from "../utils/ActorFactory";
import { isError } from "../utils/helpers";
import { authStore } from "$lib/stores/auth-store";
import type {
  GetLoanedPlayers,
  GetPlayers,
  LeagueId,
  LoanedPlayers,
  Players,
  PlayerValueLeaderboard,
  GetPlayerValueLeaderboard,
} from "../../../../declarations/backend/backend.did";

export class PlayerService {
  constructor() {}

  async getPlayers(leagueId: LeagueId): Promise<Players | undefined> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.BACKEND_CANISTER_ID ?? "",
    );
    let dto: GetPlayers = { leagueId };
    const result = await identityActor.getPlayers(dto);
    if (isError(result)) throw new Error("Failed to fetch players");
    return result.ok;
  }

  async getLoanedPlayers(
    leagueId: LeagueId,
  ): Promise<LoanedPlayers | undefined> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.BACKEND_CANISTER_ID ?? "",
    );
    let dto: GetLoanedPlayers = { leagueId };
    const result = await identityActor.getLoanedPlayers(dto);
    if (isError(result)) throw new Error("Failed to fetch loaned players");
    return result.ok;
  }

  async getPlayerValueLeaderboard(): Promise<
    PlayerValueLeaderboard | undefined
  > {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.BACKEND_CANISTER_ID ?? "",
    );
    let dto: GetPlayerValueLeaderboard = {};
    const result = await identityActor.getPlayerValueLeaderboard(dto);
    if (isError(result)) throw new Error("Failed to fetch loaned players");
    return result.ok;
  }
}
