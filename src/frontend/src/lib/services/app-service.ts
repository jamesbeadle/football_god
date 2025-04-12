import { isError } from "../utils/helpers";
import { idlFactory as backend_canister } from "../../../../declarations/backend";
import { ActorFactory } from "$lib/utils/ActorFactory";
import type {
  AppStatus,
  DataTotals,
  GetDataTotals,
} from "../../../../declarations/backend/backend.did";

export class AppService {
  constructor() {}

  async getAppStatus(): Promise<AppStatus | undefined> {
    const identityActor: any = await ActorFactory.createActor(
      backend_canister,
      process.env.BACKEND_CANISTER_ID,
    );

    const result = await identityActor.getAppStatus();
    if (isError(result)) throw new Error("Failed to get app status");
    return result.ok;
  }

  async getDataTotals(): Promise<DataTotals | undefined> {
    const identityActor: any = await ActorFactory.createActor(
      backend_canister,
      process.env.BACKEND_CANISTER_ID,
    );

    let dto: GetDataTotals = {};
    const result = await identityActor.getDataTotals(dto);
    if (isError(result)) throw new Error("Failed to get data totals");
    return result.ok;
  }
}
