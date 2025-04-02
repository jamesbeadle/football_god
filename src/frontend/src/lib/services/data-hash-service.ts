import { ActorFactory } from "../utils/ActorFactory";
import { isError } from "../utils/helpers";
import type {
  DataHash,
  DataHashes,
  GetDataHashes,
  LeagueId,
} from "../../../../declarations/data_canister/data_canister.did";
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
