import { writable } from "svelte/store";
import { FixtureService } from "$lib/services/fixture-service";
import type {
  FixtureDTO,
  GetFixturesDTO,
} from "../../../../declarations/football_god_backend/football_god_backend.did";

function createFixtureStore() {
  async function getFixtures(dto: GetFixturesDTO): Promise<FixtureDTO[]> {
    return new FixtureService().getFixtures(dto);
  }

  async function getPostponedFixtures(): Promise<FixtureDTO[]> {
    return new FixtureService().getPostponedFixtures();
  }
  return {
    getFixtures,
    getPostponedFixtures,
  };
}

export const fixtureStore = createFixtureStore();
