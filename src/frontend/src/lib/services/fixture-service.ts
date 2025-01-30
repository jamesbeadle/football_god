import { ActorFactory } from "../utils/ActorFactory";
import { isError } from "../utils/helpers";
import { idlFactory } from "../../../../declarations/backend";
import { authStore } from "$lib/stores/auth-store";
import type {
  FixtureDTO,
  MoveFixtureDTO,
  PostponeFixtureDTO,
  SubmitFixtureDataDTO,
} from "../../../../declarations/data_canister/data_canister.did";

export class FixtureService {
  constructor() {}

  async getFixturesHash(leagueId: number): Promise<string> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.DATA_CANISTER_CANISTER_ID ?? "",
    );
    const result = await identityActor.getFixturesHash(leagueId);
    if (isError(result)) throw new Error("Failed to fetch fixtures hash");
    return result.ok;
  }

  async getPostponedFixtures(): Promise<FixtureDTO[]> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.DATA_CANISTER_CANISTER_ID ?? "",
    );
    const result = await identityActor.getPostponedFixtures();
    if (isError(result)) throw new Error("Failed to fetch postponed fixtures");
    return result.ok;
  }

  async getFixtures(leagueId: number): Promise<FixtureDTO[]> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.DATA_CANISTER_CANISTER_ID ?? "",
    );
    const result = await identityActor.getFixtures(leagueId);
    if (isError(result)) throw new Error("Failed to fetch fixtures");
    return result.ok;
  }

  async moveFixture(dto: MoveFixtureDTO): Promise<void> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.DATA_CANISTER_CANISTER_ID ?? "",
    );

    const result = await identityActor.executeMoveFixture(dto);
    if (isError(result)) throw new Error("Failed to move fixture");
  }

  async postponeFixture(dto: PostponeFixtureDTO): Promise<void> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.DATA_CANISTER_CANISTER_ID ?? "",
    );

    const result = await identityActor.executePostponeFixture(dto);
    if (isError(result)) throw new Error("Failed to postpone fixture");
  }

  async submitFixtureData(dto: SubmitFixtureDataDTO): Promise<void> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.DATA_CANISTER_CANISTER_ID ?? "",
    );

    const result = await identityActor.executeSubmitFixtureData(dto);
    if (isError(result)) throw new Error("Failed to submit fixture data");
  }
}
