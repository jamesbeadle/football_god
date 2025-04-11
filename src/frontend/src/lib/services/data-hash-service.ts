import { ActorFactory } from "../utils/ActorFactory";
import { isError } from "../utils/helpers";
import type {
  DataHashes,
  GetDataHashes,
  LeagueId,
} from "../../../../declarations/backend/backend.did";
import { authStore } from "$lib/stores/auth-store";

export class DataHashService {
  constructor() {}

  async getDataHashes(leagueId: LeagueId): Promise<DataHashes | undefined> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.BACKEND_CANISTER_ID ?? "",
    );
    let dto: GetDataHashes = { leagueId };
    const result = await identityActor.getDataHashes(dto);
    if (isError(result)) throw new Error("Failed to fetch data hashes");
    return result.ok;
  }
}
