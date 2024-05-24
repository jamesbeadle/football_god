import { writable } from "svelte/store";
import { idlFactory } from "../../../../declarations/football_god_backend";
import type {
  DataCacheDTO,
  Euro2024DTO,
} from "../../../../declarations/football_god_backend/football_god_backend.did";
import { ActorFactory } from "../../utils/ActorFactory";
import { isError, replacer } from "../utils/helpers";

function createEuro2024Store() {
  const { subscribe, set } = writable<Euro2024DTO | null>(null);
  let actor: any = ActorFactory.createActor(
    idlFactory,
    process.env.OPENFPL_BACKEND_CANISTER_ID,
  );

  async function sync() {
    let category = "euro_2024_state";
    const newHashValues = await actor.getDataHashes();

    let error = isError(newHashValues);
    if (error) {
      console.error("Error syncing euro 2024 store");
      return;
    }

    let dataCacheValues: DataCacheDTO[] = newHashValues.ok;

    let categoryHash =
      dataCacheValues.find((x: DataCacheDTO) => x.category === category) ??
      null;

    const localHash = localStorage.getItem(`${category}_hash`);

    if (categoryHash?.hash != localHash) {
      let result = await actor.getEuro2024StateDTO();
      if (isError(result)) {
        console.error("Error syncing euro 2024 store");
        return;
      }

      let updatedEuro2024StateData = result.ok;

      localStorage.setItem(
        category,
        JSON.stringify(updatedEuro2024StateData, replacer),
      );
      localStorage.setItem(`${category}_hash`, categoryHash?.hash ?? "");
      set(updatedEuro2024StateData);
    } else {
      const cachedEuro2024StateData = localStorage.getItem(category);
      let cachedEuro2024State: Euro2024DTO | null = null;
      try {
        cachedEuro2024State = JSON.parse(cachedEuro2024StateData || "{}");
      } catch (e) {
        cachedEuro2024State = null;
      }
      set(cachedEuro2024State);
    }
  }

  async function getEuro2024State(): Promise<Euro2024DTO | undefined> {
    let euro2024State;
    subscribe((value) => {
      euro2024State = value!;
    })();
    return euro2024State;
  }

  return {
    subscribe,
    sync,
    getEuro2024State,
  };
}

export const euro2024Store = createEuro2024Store();
