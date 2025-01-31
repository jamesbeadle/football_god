import { writable } from "svelte/store";
import { FixtureService } from "../services/fixture-service";
import type {
  FixtureDTO,
  MoveFixtureDTO,
  PostponeFixtureDTO,
  SubmitFixtureDataDTO,
} from "../../../../declarations/data_canister/data_canister.did";

function createFixtureStore() {
  const { subscribe, update } = writable<Record<number, FixtureDTO[]>>({});

  async function getFixtures(leagueId: number): Promise<FixtureDTO[]> {
    return new FixtureService().getFixtures(leagueId);
  }

  async function moveFixture(dto: MoveFixtureDTO): Promise<any> {
    return new FixtureService().moveFixture(dto);
  }

  async function postponeFixture(dto: PostponeFixtureDTO): Promise<any> {
    return new FixtureService().postponeFixture(dto);
  }

  async function submitFixtureData(dto: SubmitFixtureDataDTO): Promise<any> {
    return new FixtureService().submitFixtureData(dto);
  }

  async function getPostponedFixtures(): Promise<FixtureDTO[]> {
    return new FixtureService().getPostponedFixtures();
  }

  function getFixturesByLeagueId(leagueId: number): FixtureDTO[] | undefined {
    let data: Record<number, FixtureDTO[]> = {};
    const unsubscribe = subscribe((value) => {
      data = value;
    });
    unsubscribe();

    return data[leagueId];
  }

  return {
    subscribe,
    update,
    getFixtures,
    getPostponedFixtures,
    moveFixture,
    postponeFixture,
    submitFixtureData,
    getFixturesByLeagueId,
  };
}

export const fixtureStore = createFixtureStore();
