import { writable } from "svelte/store";
import { FixtureService } from "../services/fixture-service";
import { DataHashService } from "../services/data-hash-service";
import type {
  FixtureDTO,
  MoveFixtureDTO,
  PostponeFixtureDTO,
  SubmitFixtureDataDTO,
} from "../../../../declarations/backend/backend.did";
import { serializeData, deserializeData } from "../utils/helpers";

function createFixtureStore() {
  const { subscribe, update } = writable<Record<number, FixtureDTO[]>>({});

  async function syncFixtures(leagueId: number) {
    try {
      await new DataHashService().refreshLeagueHashes();
      const localHashKey = `fixtures_hash_${leagueId}`;
      const localFixturesKey = `fixtures_${leagueId}`;

      const localHash = localStorage.getItem(localHashKey);
      console.log(`Current local hash for league ${leagueId}:`, localHash);

      const fixtureHash = await new DataHashService().getFixturesHash(leagueId);
      console.log(`Server hash for league ${leagueId}:`, fixtureHash);

      let fixtures: FixtureDTO[];

      if (!localHash || fixtureHash !== localHash) {
        console.log(`Fetching fresh fixtures for league ${leagueId}`);
        fixtures = await getFixtures(leagueId);
        console.log(`Fetched fixtures for league ${leagueId}:`, fixtures);
        // Store fetched data in localStorage
        localStorage.setItem(localFixturesKey, serializeData(fixtures));
        localStorage.setItem(localHashKey, fixtureHash || "");
      } else {
        console.log(`Using cached fixtures for league ${leagueId}`);
        const cached = localStorage.getItem(localFixturesKey);
        if (cached) {
          fixtures = deserializeData(cached) as FixtureDTO[];
        } else {
          // Fallback to fetch from server if cached data is missing
          fixtures = await getFixtures(leagueId);
          console.log(
            `Fetched fixtures in else else for league ${leagueId}:`,
            fixtures,
          );
          localStorage.setItem(localFixturesKey, serializeData(fixtures));
        }
      }
      // Update the store
      update((current) => {
        const updated: Record<number, FixtureDTO[]> = {
          ...current,
          [leagueId]: fixtures,
        };
        console.log(`Updated fixtures for league ${leagueId}:`, updated);
        return updated;
      });
    } catch (error) {
      console.error(`Error syncing fixtures for league ${leagueId}:`, error);
      // Fallback to cached data if an error occurs
      const cached = localStorage.getItem(`fixtures_${leagueId}`);
      if (cached) {
        console.log(`Using cached fixtures for league ${leagueId}`);
        const fixtures = deserializeData(cached) as FixtureDTO[];
        update((current) => {
          const updated: Record<number, FixtureDTO[]> = {
            ...current,
            [leagueId]: fixtures,
          };
          console.log(
            `Updated fixtures for league ${leagueId} in fallback:`,
            updated,
          );
          return updated;
        });
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
