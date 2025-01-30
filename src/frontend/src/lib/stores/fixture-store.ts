import { writable } from "svelte/store";
import { FixtureService } from "../services/fixture-service";
import { DataHashService } from "../services/data-hash-service";
import { serializeData, deserializeData } from "../utils/helpers";
import { MAX_CACHED_LEAGUES } from "../constants/app.constants";
import type {
  FixtureDTO,
  MoveFixtureDTO,
  PostponeFixtureDTO,
  SubmitFixtureDataDTO,
} from "../../../../declarations/data_canister/data_canister.did";

function createFixtureStore() {
  const { subscribe, update } = writable<Record<number, FixtureDTO[]>>({});

  let leagueCacheOrder: number[] = [];

  async function syncFixtures(leagueId: number) {
    try {
      const localHashKey = `fixtures_hash_${leagueId}`;
      const localFixturesKey = `fixtures_${leagueId}`;

      const localHash = localStorage.getItem(localHashKey);
      const fixtureHash = await new DataHashService().getCategoryHash(
        "fixtures",
        leagueId,
      );

      let fixtures: FixtureDTO[];

      if (!localHash || fixtureHash !== localHash) {
        fixtures = await getFixtures(leagueId);
        localStorage.setItem(localFixturesKey, serializeData(fixtures));
        localStorage.setItem(localHashKey, fixtureHash || "");
      } else {
        const cached = localStorage.getItem(localFixturesKey);
        if (cached) {
          fixtures = deserializeData(cached) as FixtureDTO[];
        } else {
          fixtures = await getFixtures(leagueId);
          localStorage.setItem(localFixturesKey, serializeData(fixtures));
        }
      }

      update((current: Record<number, FixtureDTO[]>) => ({
        ...current,
        [leagueId]: fixtures,
      }));

      if (!leagueCacheOrder.includes(leagueId)) {
        leagueCacheOrder.push(leagueId);
      } else {
        leagueCacheOrder = leagueCacheOrder.filter((id) => id !== leagueId);
        leagueCacheOrder.push(leagueId);
      }

      if (leagueCacheOrder.length > MAX_CACHED_LEAGUES) {
        const leastUsedLeagueId = leagueCacheOrder.shift();
        if (leastUsedLeagueId !== undefined) {
          localStorage.removeItem(`fixtures_${leastUsedLeagueId}`);
          localStorage.removeItem(`fixtures_hash_${leastUsedLeagueId}`);
        }
      }
    } catch (error) {
      console.error(`Error syncing fixtures for league ${leagueId}:`, error);
      const cached = localStorage.getItem(`fixtures_${leagueId}`);
      if (cached) {
        const fixtures = deserializeData(cached) as FixtureDTO[];
        update((current: Record<number, FixtureDTO[]>) => ({
          ...current,
          [leagueId]: fixtures,
        }));
      }
    }
  }

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
    syncFixtures,
    getFixtures,
    getPostponedFixtures,
    moveFixture,
    postponeFixture,
    submitFixtureData,
    getFixturesByLeagueId,
  };
}

export const fixtureStore = createFixtureStore();
