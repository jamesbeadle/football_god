import { writable } from "svelte/store";
import { idlFactory } from "../../../../declarations/football_god_backend";
import { ActorFactory } from "../../utils/ActorFactory";
import { isError, replacer } from "$lib/utils/helpers";
import type { ClubDTO } from "../../../../declarations/football_god_backend/football_god_backend.did";

function createTeamStore() {
  const { subscribe, set } = writable<ClubDTO[]>([]);

  let actor: any = ActorFactory.createActor(
    idlFactory,
    process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
  );

  async function sync() {}

  return {
    subscribe,
    sync,
  };
}

export const teamStore = createTeamStore();
