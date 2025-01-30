import { countryStore } from "../stores/country-store";
import { betSlipStore } from "../stores/bet-slip-store";
import { playerStore } from "../stores/player-store";
import { clubStore } from "../stores/club-store";
import { leagueStore } from "../stores/league-store";
import { fixtureStore } from "../stores/fixture-store";
import { seasonStore } from "../stores/season-store";
import { playerEventsStore } from "../stores/player-events-store";
import type { MockData } from "../local/mock-data";
import { mockData } from "../local/mock-data";

import { DataHashService } from "../services/data-hash-service";
import { CountryService } from "../services/country-service";
import { LeagueService } from "../services/league-service";
import { FixtureService } from "../services/fixture-service";
import { ClubService } from "../services/club-service";
import { PlayerService } from "../services/player-service";
import { SeasonService } from "../services/season-service";
import { PlayerEventsService } from "../services/player-events-service";
import { MockService } from "../local/mock-service";
import {
  isError,
  replacer,
  serializeData,
  deserializeData,
} from "../utils/helpers";
import { MAX_CACHED_LEAGUES } from "../constants/app.constants";
import { dev } from '$app/environment';  // Import dev flag from SvelteKit
import type { FootballLeagueDTO} from "../../../../declarations/backend/backend.did";

type StoreType = {
  subscribe: (run: (value: any) => void) => () => void;
  [key: string]: any;
};

interface SyncConfig {
  category: string;
  store: StoreType;
  getData: (leagueId: number) => Promise<any>;
}

export class StoreManager {
  private leagueCacheOrder: number[] = [];
  private dataHashService: DataHashService;
  private countryService: CountryService;
  private leagueService: LeagueService;
  private fixtureService: FixtureService;
  private clubService: ClubService;
  private playerService: PlayerService;
  private seasonService: SeasonService;
  private playerEventsService: PlayerEventsService;
  private mockService: MockService;
  private isDevEnvironment: boolean;

  private getCategoryStore(category: string): StoreType {
    switch (category) {
      case "fixtures":
        return fixtureStore;
      case "clubs":
        return clubStore;
      case "players":
        return playerStore;
      case "league_status":
        return leagueStore;
      case "seasons":
        return seasonStore;
      default:
        throw new Error(`Unknown category: ${category}`);
    }
  }

  private getCategoryData(category: string, leagueId: number) {
    switch (category) {
      case "fixtures":
        return fixtureStore.getFixtures(leagueId);
      case "clubs":
        return clubStore.getClubs(leagueId);
      case "players":
        return playerStore.getPlayers(leagueId);
      case "league_status":
        return leagueStore.getLeagueStatus(leagueId);
      case "seasons":
        return seasonStore.getSeasons(leagueId);
      default:
        throw new Error(`Unknown category: ${category}`);
    }
  }

  private categories: string[] = [
    "players",
    "clubs",
    "fixtures",
    "league_status",
    "seasons",
    //"player_events",
  ];

  constructor() {
    this.dataHashService = new DataHashService();
    this.countryService = new CountryService();
    this.leagueService = new LeagueService();
    this.fixtureService = new FixtureService();
    this.clubService = new ClubService();
    this.playerService = new PlayerService();
    this.seasonService = new SeasonService();
    this.playerEventsService = new PlayerEventsService();
    this.mockService = new MockService();
    this.isDevEnvironment = dev;
  }

  private async syncLeagues(leagueId?: number) {
    try {
      const localHashKey = "leagues_hash";
      const localLeaguesKey = "leagues";

      const cachedOrder = localStorage.getItem('leagueCacheOrder');
      if (cachedOrder) {
        this.leagueCacheOrder = JSON.parse(cachedOrder);
      }

      let leagues: FootballLeagueDTO[];
      if (dev) {
        leagues = mockData.leagues;
      } else {
        const localHash = localStorage.getItem(localHashKey);
        const leagueHash = await this.dataHashService.getLeaguesHash();

        if (!localHash || leagueHash !== localHash) {
          leagues = await leagueStore.getLeagues();
          localStorage.setItem(localLeaguesKey, serializeData(leagues));
          localStorage.setItem(localHashKey, leagueHash || "");
        } else {
          const cached = localStorage.getItem(localLeaguesKey);
          if (cached) {
            leagues = deserializeData(cached) as FootballLeagueDTO[];
          } else {
            leagues = await  leagueStore.getLeagues();
            localStorage.setItem(localLeaguesKey, serializeData(leagues));
          }
        }
      }

      if (leagueId !== undefined) {
        this.updateCacheOrder(leagueId, 'leagues');
      }

      const filteredLeagues = this.leagueCacheOrder.length > 0 
        ? this.leagueCacheOrder
        .slice(-MAX_CACHED_LEAGUES)
        .map((id) => leagues.find((league) => league.id === id))
        .filter((league): league is FootballLeagueDTO => league !== undefined)
        : leagues;

      localStorage.setItem(localLeaguesKey, serializeData(filteredLeagues));
      localStorage.setItem('leagueCacheOrder', JSON.stringify(this.leagueCacheOrder));

      leagueStore.update((current) =>
        filteredLeagues.reduce(
          (acc, league) => {
            acc[league.id] = league;
            return acc;
          },
          {} as Record<number, FootballLeagueDTO>,
        ),
      );
    } catch (error) {
      console.error("Error syncing leagues:", error);
      this.loadFromCache(leagueId || 0, {
        category: 'leagues',
        store: leagueStore,
        getData: () =>  leagueStore.getLeagues()
      });
    }
  }

  async syncStores(leagueId: number) {
    const newHashes = await this.dataHashService.getDataHashes();
    if (newHashes == undefined) {
      return;
    }
    await this.syncLeagues(leagueId);

    for (const category of this.categories) {
      const categoryHash = newHashes.find(hash => hash.category === category);
      const localHash = localStorage.getItem(`${category}_hash_${leagueId}`);
      
      if (categoryHash?.hash !== localHash) {
        await this.syncCategory(category, leagueId);
        localStorage.setItem(`${category}_hash_${leagueId}`, categoryHash?.hash || "");
      } else {
        this.loadFromCache(leagueId, {
          category,
          store: this.getCategoryStore(category),
          getData: (id) => this.getCategoryData(category, id)
        });
      }
    }
    const countriesHash = newHashes.find(
      (hash) => hash.category === "countries",
    );
    if (countriesHash?.hash !== localStorage.getItem(`countries_hash`)) {
      await this.syncCountries();
      localStorage.setItem(`countries_hash`, countriesHash?.hash || "");
    } else {
      this.loadCountryFromCache();
    }
  }

  private async syncData(leagueId: number, config: SyncConfig) {
    try {
      const { category, store, getData } = config;
      const localHashKey = `${category}_hash_${leagueId}`;
      const localDataKey = `${category}_${leagueId}`;

      const localHash = localStorage.getItem(localHashKey);
      const dataHash = await this.dataHashService.getCategoryHash(category, leagueId);

      let data;
      if (!localHash || dataHash !== localHash) {
        data = await getData(leagueId);
        localStorage.setItem(localDataKey, serializeData(data));
        localStorage.setItem(localHashKey, dataHash || "");
      } else {
        const cached = localStorage.getItem(localDataKey);
        if (cached) {
          data = deserializeData(cached);
        } else {
          data = await getData(leagueId);
          localStorage.setItem(localDataKey, serializeData(data));
        }
      }

      store.update((current: Record<number, any>) => ({
        ...current,
        [leagueId]: data,
      }));

      this.updateCacheOrder(leagueId, category);
    } catch (error) {
      console.error(`Error syncing ${config.category} for league ${leagueId}:`, error);
      this.loadFromCache(leagueId, config);
    }
  }

  private updateCacheOrder(leagueId: number, category: string) {
    if (!this.leagueCacheOrder.includes(leagueId)) {
      this.leagueCacheOrder.push(leagueId);
    } else {
      this.leagueCacheOrder = this.leagueCacheOrder.filter(id => id !== leagueId);
      this.leagueCacheOrder.push(leagueId);
    }

    if (this.leagueCacheOrder.length > MAX_CACHED_LEAGUES) {
      const leastUsedLeagueId = this.leagueCacheOrder.shift();
      if (leastUsedLeagueId !== undefined) {
        const categoriesToRemove = [
          'leagues',
          'fixtures',
          'players',
          'clubs',
          'league_status'
        ];
        
        categoriesToRemove.forEach(cat => {
          localStorage.removeItem(`${cat}_${leastUsedLeagueId}`);
          localStorage.removeItem(`${cat}_hash_${leastUsedLeagueId}`);
        });
      }
    }
    localStorage.setItem('leagueCacheOrder', JSON.stringify(this.leagueCacheOrder));
  }

  private loadFromCache(leagueId: number, config: SyncConfig) {
    const cached = localStorage.getItem(`${config.category}_${leagueId}`);
    if (cached) {
      const data = deserializeData(cached);
      config.store.update((current: Record<number, any>) => ({
        ...current,
        [leagueId]: data,
      }));
    }
  }

  private async syncCategory(
    category: string,
    leagueId: number,
  ): Promise<void> {
    switch (category) {
      case "fixtures":
        await this.syncData(leagueId, {
          category: "fixtures",
          store: fixtureStore,
          getData: (id) => fixtureStore.getFixtures(id)
        });
        break;
      case "clubs":
        await this.syncData(leagueId, {
          category: "clubs",
          store: clubStore,
          getData: (id) => clubStore.getClubs(id)
        });
        break;
      case "players":
        await this.syncData(leagueId, {
          category: "players",
          store: playerStore,
          getData: (id) => playerStore.getPlayers(id)
        });
        break;
      case "league_status":
        await this.syncData(leagueId, {
          category: "league_status",
          store: leagueStore,
          getData: (id) => leagueStore.getLeagueStatus(id)
        });
        break;
      /* case "app_status":
        const updatedAppStatus = await this.appService.getAppStatus();
        if (!updatedAppStatus) {
          return;
        }
        appStore.setAppStatus(updatedAppStatus);
        localStorage.setItem(
          "app_status",
          JSON.stringify(updatedAppStatus, replacer),
        );
        break; */
      case "seasons":
       // await seasonStore.syncSeasons(leagueId);
        break;
      /* case "player_events":
        const leagueStatus = await this.leagueService.getLeagueStatus(leagueId);
        if (!leagueStatus) {
          return;
        }
        const updatedPlayerEvents =
          await this.playerEventsService.getPlayerDetailsForGameweek(
            leagueId,
            leagueStatus.activeSeasonId,
            leagueStatus.activeGameweek == 0
              ? leagueStatus.unplayedGameweek
              : leagueStatus.activeGameweek,
          );
        if (!updatedPlayerEvents) {
          return;
        }
        playerEventsStore.setPlayerEvents(updatedPlayerEvents);
        localStorage.setItem(
          "player_events",
          JSON.stringify(updatedPlayerEvents, replacer),
        );
        break; */
    }
  }

  private async syncCountries(): Promise<void> {
    const updatedCountries = await this.countryService.getCountries();
    if (!updatedCountries) {
      return;
    }
    countryStore.setCountries(updatedCountries);
    localStorage.setItem(
      "countries",
      JSON.stringify(updatedCountries, replacer),
    );
  }

  private loadCountryFromCache(): void {
    const cachedData = localStorage.getItem("countries");

    const cachedCountries = JSON.parse(cachedData || "[]");
    countryStore.setCountries(cachedCountries);
  }
}

export const storeManager = new StoreManager();
