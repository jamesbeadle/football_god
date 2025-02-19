import { writable } from "svelte/store";
import { FixtureService } from "../services/fixture-service";
import type { FixtureDTO} from "../../../../declarations/data_canister/data_canister.did";

function createFixtureStore() {
  const { subscribe, set } = writable<FixtureDTO[]>([]);

  async function getFixtures(leagueId: number, seasonId: number): Promise<FixtureDTO[]> {
    return new FixtureService().getFixtures(leagueId, seasonId);
  }

  async function getPostponedFixtures(leagueId: number): Promise<FixtureDTO[]> {
    return new FixtureService().getPostponedFixtures(leagueId);
  }

  async function getNextFixture(): Promise<FixtureDTO | undefined> {
    let fixtures: FixtureDTO[] = [];
    await subscribe((value) => {
      fixtures = value;
    })();

    if (fixtures.length == 0) {
      return;
    }

    fixtures.sort((a, b) => {
      return (
        new Date(Number(a.kickOff) / 1000000).getTime() -
        new Date(Number(b.kickOff) / 1000000).getTime()
      );
    });

    const now = new Date();
    return fixtures.find(
      (fixture) => new Date(Number(fixture.kickOff) / 1000000) > now,
    );
  }

  return {
    subscribe,
    setFixtures: (fixtures: FixtureDTO[]) => set(fixtures),
    getFixtures,
    getPostponedFixtures,
    getNextFixture,
  };
}

export const fixtureStore = createFixtureStore();
