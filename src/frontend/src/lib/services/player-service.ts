import { ActorFactory } from "../utils/ActorFactory";
import { isError } from "../utils/helpers";
import { authStore } from "$lib/stores/auth-store";
import type {
  GetLoanedPlayers,
  GetPlayers,
  LoanedPlayers,
  Player,
} from "../../../../declarations/data_canister/data_canister.did";

export class PlayerService {
  constructor() {}

  async getPlayers(dto: GetPlayers): Promise<Player[]> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.BACKEND_CANISTER_ID ?? "",
    );

    const result = await identityActor.getPlayers(dto);
    if (isError(result)) throw new Error("Failed to fetch players");
    return result.ok;
  }

  async getLoanedPlayers(dto: GetLoanedPlayers): Promise<LoanedPlayers> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.BACKEND_CANISTER_ID ?? "",
    );
    const result = await identityActor.getLoanedPlayers(dto);
    if (isError(result)) throw new Error("Failed to fetch loaned players");
    return result.ok;
  }
}
