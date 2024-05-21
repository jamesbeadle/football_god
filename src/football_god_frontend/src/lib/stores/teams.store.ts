import { writable } from "svelte/store";
import { idlFactory } from "../../../../declarations/football_god_backend";
import type { DataCacheDTO, InternationalTeam } from "../../../../declarations/football_god_backend/football_god_backend.did";
import { ActorFactory } from "../../utils/ActorFactory";
import { isError, replacer } from "$lib/utils/helpers";

function createTeamStore() {
  const { subscribe, set } = writable<InternationalTeam[]>([]);

  let actor: any = ActorFactory.createActor(
    idlFactory,
    process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
  );

  async function sync() {
    const category = "teams";
    const newHashValues = await actor.getDataHashes();

    let error = isError(newHashValues);
    if (error) {
      console.error("Error syncing team store");
      return;
    }

    let dataCacheValues: DataCacheDTO[] = newHashValues.ok;

    let categoryHash =
      dataCacheValues.find((x: DataCacheDTO) => x.category === category) ?? null;

    const localHash = localStorage.getItem(`${category}_hash`);

    if (categoryHash?.hash != localHash) {
      const updatedTeamsData = await actor.getEuro2024Teams();

      if (isError(updatedTeamsData)) {
        return [];
      }

      localStorage.setItem(
        category,
        JSON.stringify(updatedTeamsData.ok, replacer),
      );
      localStorage.setItem(`${category}_hash`, categoryHash?.hash ?? "");
      set(updatedTeamsData.ok);
    } else {
      const cachedTeamsData = localStorage.getItem(category);
      let cachedTeams: InternationalTeam[] = [];
      try {
        cachedTeams = JSON.parse(cachedTeamsData || "[]");
      } catch (e) {
        cachedTeams = [];
      }
      set(cachedTeams);
    }
  }

  return {
    subscribe,
    sync,
  };
}

export const teamStore = createTeamStore();
