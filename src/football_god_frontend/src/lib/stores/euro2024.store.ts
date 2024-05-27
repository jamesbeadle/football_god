import { writable } from "svelte/store";
import { idlFactory } from "../../../../declarations/football_god_backend";
import type {
  DataCacheDTO,
  Euro2024DTO,
} from "../../../../declarations/football_god_backend/football_god_backend.did";
import { ActorFactory } from "../../utils/ActorFactory";
import { isError, replacer } from "../utils/helpers";
import { userStore } from "./user.store";
import { authStore } from "./auth.store";

function createEuro2024Store() {
  const { subscribe, set } = writable<Euro2024DTO | null>(null);
  let actor: any = ActorFactory.createActor(
    idlFactory,
    process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID,
  );

  async function sync() {
    
    let result = await actor.getEuro2024StateDTO();
    if (isError(result)) {
      console.error("Error syncing euro 2024 store");
      return;
    }

    let updatedEuro2024StateData = result.ok;
    set(updatedEuro2024StateData);
  }

  async function getEuro2024State(): Promise<Euro2024DTO | undefined> {
    let euro2024State;
    subscribe((value) => {
      euro2024State = value!;
    })();
    return euro2024State;
  }

  async function getPotBalance(): Promise<bigint> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
    );
    let result = await identityActor.getEuroPotBalance();
    return result;
  }

  async function getTotalEntries(): Promise<bigint> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
    );
    let result = await identityActor.getTotalEntries();
    return result;
  }

  return {
    subscribe,
    sync,
    getEuro2024State,
    getPotBalance,
    getTotalEntries,
  };
}

export const euro2024Store = createEuro2024Store();
