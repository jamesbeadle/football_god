import { writable } from "svelte/store";
import { FixtureService } from "../services/fixture-service";
import type {
  FixtureDTO,
  GetFixturesDTO,
} from "../../../../declarations/backend/backend.did";

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
