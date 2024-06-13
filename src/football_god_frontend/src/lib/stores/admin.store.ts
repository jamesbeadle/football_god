import type {
  Euro2024Event,
  Euro2024EventDTO,
  Euro2024EventId,
  Euro2024PredictionDTO,
} from "../../../../declarations/football_god_backend/football_god_backend.did";
import { ActorFactory } from "../../utils/ActorFactory";
import { authStore } from "./auth.store";

function createAdminStore() {
  async function getEuro2024Entries(
    currentPage: number,
    itemsPerPage: number,
  ): Promise<Euro2024PredictionDTO[]> {
    const limit = itemsPerPage;
    const offset = (currentPage - 1) * limit;
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
    );
    let entries = await identityActor.adminGetEuro2024Entries(limit, offset);
    return entries;
  }

  async function getEuro2024Events(): Promise<Euro2024EventDTO[]> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
    );
    let entries = await identityActor.adminGetEuro2024Events();

    console.log("entries");
    console.log(entries);
    return entries;
  }

  async function deleteEuro2024Entry(principalId: string): Promise<boolean> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
    );
    let result = await identityActor.adminDelete2024Entry(principalId);
    return result;
  }

  async function deleteEuro2024Event(
    eventId: Euro2024EventId,
  ): Promise<boolean> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
    );
    let result = await identityActor.adminDelete2024Event(eventId);
    return result;
  }

  async function addEuro2024Event(eventDTO: Euro2024EventDTO) {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
    );

    let dto: Euro2024Event = {
      eventId: eventDTO.eventId,
      fixtureId: eventDTO.fixtureId,
      playerId: eventDTO.playerId,
      stage: eventDTO.stage,
      teamId: eventDTO.teamId,
      eventType: eventDTO.eventType,
    };

    let result = await identityActor.addEuro2024Event(dto);
    return result;
  }

  async function closeEuro2024Entries() {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
    );

    let result = await identityActor.closeEuro2024Entries();
    return result;
  }

  async function openEuro2024Entries() {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
    );

    let result = await identityActor.openEuro2024Entries();
    return result;
  }

  async function completeEuro2024Competition() {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
    );

    let result = await identityActor.completeEuro2024Competition();
    return result;
  }

  async function recalculateLeaderboard() {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
    );

    let result = await identityActor.recalculateLeaderboard();
    return result;
  }

  return {
    getEuro2024Entries,
    deleteEuro2024Entry,
    getEuro2024Events,
    deleteEuro2024Event,
    addEuro2024Event,
    openEuro2024Entries,
    closeEuro2024Entries,
    completeEuro2024Competition,
    recalculateLeaderboard,
  };
}

export const adminStore = createAdminStore();
