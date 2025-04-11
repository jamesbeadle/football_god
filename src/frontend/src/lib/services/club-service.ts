import { ActorFactory } from "../utils/ActorFactory";
import { isError } from "../utils/helpers";
import type {
  Clubs,
  ClubValueLeaderboard,
  GetClubs,
  GetClubValueLeaderboard,
  LeagueId,
} from "../../../../declarations/backend/backend.did";
import { authStore } from "$lib/stores/auth-store";

export class ClubService {
  constructor() {}

  async getClubs(leagueId: LeagueId): Promise<Clubs | undefined> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.BACKEND_CANISTER_ID ?? "",
    );

    let dto: GetClubs = { leagueId };

    const result = await identityActor.getClubs(dto);
    if (isError(result)) throw new Error("Failed to fetch clubs");
    return result.ok;
  }

  async getClubValueLeaderboard(): Promise<ClubValueLeaderboard | undefined> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.BACKEND_CANISTER_ID ?? "",
    );
    let dto: GetClubValueLeaderboard = {};
    const result = await identityActor.getClubValueLeaderboard(dto);
    if (isError(result))
      throw new Error("Failed to fetch club value leaderboard");
    return result.ok;
  }
}
