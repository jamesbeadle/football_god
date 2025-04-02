import { writable } from "svelte/store";
import { FixtureService } from "../services/fixture-service";
import type { Fixture, Fixtures, PostponedFixtures } from "../../../../declarations/data_canister/data_canister.did";

function createFixtureStore() {
  const { subscribe, set } = writable<Fixtures | undefined>(undefined);

  async function getFixtures(
    leagueId: number,
    seasonId: number,
  ): Promise<Fixtures | undefined> {
    return new FixtureService().getFixtures(leagueId, seasonId);
  }

  async function getPostponedFixtures(leagueId: number): Promise<PostponedFixtures | undefined> {
    return new FixtureService().getPostponedFixtures(leagueId);
  }

  async function getNextFixture(): Promise<Fixture | undefined> {
    let fixtures: Fixture[] = [];
    await subscribe((value) => {
      fixtures = value?.fixtures!;
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
    setFixtures: (fixtures: Fixtures) => set(fixtures),
    getFixtures,
    getPostponedFixtures,
    getNextFixture,
  };
}

export const fixtureStore = createFixtureStore();
