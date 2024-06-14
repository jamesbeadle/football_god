import { writable } from "svelte/store";
import { idlFactory } from "../../../../declarations/football_god_backend";
import type {
  DataCacheDTO,
  Euro2024DTO,
  Euro2024EventDTO,
  Euro2024Fixture,
  Euro2024LeaderBoardDTO,
  Euro2024PredictionDTO,
  GetLeaderboardDTO,
  InternationalPlayer,
  InternationalTeam,
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

  async function getEuro2024State() {
    let result = await actor.getEuro2024State();
    return result;
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

  async function getPrediction(
    principalId: string,
  ): Promise<Euro2024PredictionDTO> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
    );
    let result = await identityActor.getPublicEuro2024DTO(principalId);
    if (isError(result)) {
      console.error("error fetching prediction");
    }
    return result.ok;
  }

  async function getFixtures(): Promise<Euro2024Fixture[]> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
    );
    let result = await identityActor.getEuro2024Fixtures();
    if (isError(result)) {
      console.error("error fetching euro 2024 fixtures", result);
      return [];
    }
    return result.ok;
  }

  async function getLeaderboard(
    offset: bigint,
    limit: bigint,
  ): Promise<Euro2024LeaderBoardDTO> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
    );

    let dto: GetLeaderboardDTO = {
      totalEntries: 0n,
      offset: offset,
      limit: limit,
      entries: [],
    };

    let result = await identityActor.getLeaderboard(dto);
    if (isError(result)) {
      console.error("error fetching euro 2024 fixtures", result);
    }
    return result.ok;
  }

  async function getEvents(): Promise<Euro2024EventDTO[]> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
    );
    let entries = await identityActor.getEuro2024Events();
    return entries;
  }

  return {
    subscribe,
    sync,
    getEuro2024State,
    getPotBalance,
    getTotalEntries,
    getFixtures,
    getLeaderboard,
    getPrediction,
    getEvents,
  };
}

export const euro2024Store = createEuro2024Store();
