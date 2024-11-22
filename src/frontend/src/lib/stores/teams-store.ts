import { writable } from "svelte/store";
import { idlFactory } from "../../../../declarations/backend";
import { ActorFactory } from "../utils/ActorFactory";
import { isError, replacer } from "../utils/helpers";
import type { ClubDTO } from "../../../../declarations/backend/backend.did";

function createTeamStore() {
  const { subscribe, set } = writable<ClubDTO[]>([]);

  let actor: any = ActorFactory.createActor(
    idlFactory,
    process.env.BACKEND_CANISTER_ID ?? "",
  ); //TODO REPLACE WITH CLUB STORE

  async function sync() {}

  return {
    subscribe,
    sync,
  };
}

export const teamStore = createTeamStore();
