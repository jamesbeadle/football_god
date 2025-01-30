import { writable } from "svelte/store";
import { FixtureService } from "../services/fixture-service";
import { DataHashService } from "../services/data-hash-service";
import type {
  ClubDTO,
  FixtureDTO,
  MoveFixtureDTO,
  PostponeFixtureDTO,
  SubmitFixtureDataDTO,
} from "../../../../declarations/backend/backend.did";
import { serializeData, deserializeData } from "../utils/helpers";
import { MAX_CACHED_LEAGUES } from "../constants/app.constants";
import { dev } from '$app/environment';
import { mockData } from "../local/mock-data";

function createFixtureStore() {
  const { subscribe, update } = writable<Record<number, FixtureDTO[]>>({});

  async function getFixtures(leagueId: number): Promise<FixtureDTO[]> {
    
    const cached = localStorage.getItem(`fixtures_${leagueId}`);
    if (cached) {
      return deserializeData(cached) as FixtureDTO[];
    }
    if (dev) {
      const fixtureData = mockData.fixtures[leagueId];
      return fixtureData?.ok || fixtureData as FixtureDTO[];
    }
    // If not in cache, fetch from service
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
