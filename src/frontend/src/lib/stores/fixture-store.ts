import { FixtureService } from "../services/fixture-service";
import type {
  FixtureDTO,
  GetFixturesDTO,
  MoveFixtureDTO,
  PostponeFixtureDTO,
  SubmitFixtureDataDTO,
} from "../../../../declarations/backend/backend.did";

function createFixtureStore() {
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

  return {
    getFixtures,
    getPostponedFixtures,
    moveFixture,
    postponeFixture,
    submitFixtureData,
  };
}

export const fixtureStore = createFixtureStore();
