import { writable } from "svelte/store";
import { idlFactory } from "../../../../declarations/football_god_backend";
import type { DataCacheDTO, InternationalPlayer } from "../../../../declarations/football_god_backend/football_god_backend.did";
import { ActorFactory } from "../../utils/ActorFactory";
import { isError, replacer } from "$lib/utils/helpers";

function createPlayerStore() {
  const { subscribe, set } = writable<InternationalPlayer[]>([]);

  let actor: any = ActorFactory.createActor(
    idlFactory,
    process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
  );

  async function sync() {
    const category = "players";
    const newHashValues = await actor.getDataHashes();

    let error = isError(newHashValues);
    if (error) {
      console.error("Error syncing player store");
      return;
    }

    let dataCacheValues: DataCacheDTO[] = newHashValues.ok;

    let categoryHash =
      dataCacheValues.find((x: DataCacheDTO) => x.category === category) ?? null;

    const localHash = localStorage.getItem(`${category}_hash`);

    if (categoryHash?.hash != localHash) {
      const updatedPlayersData = await actor.getEuro2024Players();

      if (isError(updatedPlayersData)) {
        return [];
      }

      localStorage.setItem(
        category,
        JSON.stringify(updatedPlayersData.ok, replacer),
      );
      localStorage.setItem(`${category}_hash`, categoryHash?.hash ?? "");
      set(updatedPlayersData.ok);
    } else {
      const cachedPlayersData = localStorage.getItem(category);
      let cachedPlayers: InternationalPlayer[] = [];
      try {
        cachedPlayers = JSON.parse(cachedPlayersData || "[]");
      } catch (e) {
        cachedPlayers = [];
      }
      set(cachedPlayers);
    }
  }

  return {
    subscribe,
    sync,
  };
}

export const playerStore = createPlayerStore();
