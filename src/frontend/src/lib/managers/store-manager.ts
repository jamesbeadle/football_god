import { countryStore } from "../stores/country-store";
import { betSlipStore } from "../stores/bet-slip-store";
import { playerStore } from "../stores/player-store";
import { clubStore } from "../stores/club-store";
import { leagueStore } from "../stores/league-store";
import { fixtureStore } from "../stores/fixture-store";
import { seasonStore } from "../stores/season-store";
import { playerEventsStore } from "../stores/player-events-store";

import { DataHashService } from "../services/data-hash-service";
import { CountryService } from "../services/country-service";
import { LeagueService } from "../services/league-service";
import { FixtureService } from "../services/fixture-service";
import { ClubService } from "../services/club-service";
import { PlayerService } from "../services/player-service";
import { SeasonService } from "../services/season-service";
import { PlayerEventsService } from "../services/player-events-service";
import {
  isError,
  replacer,
  serializeData,
  deserializeData,
} from "../utils/helpers";
import { MAX_CACHED_LEAGUES } from "../constants/app.constants";

class StoreManager {
  private dataHashService: DataHashService;
  private countryService: CountryService;
  private leagueService: LeagueService;
  private fixtureService: FixtureService;
  private clubService: ClubService;
  private playerService: PlayerService;
  private seasonService: SeasonService;
  private playerEventsService: PlayerEventsService;

  private categories: string[] = [
    "leagues",
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
  }

  async syncStores(leagueId: number) {
    const newHashes = await this.dataHashService.getDataHashes();
    if (newHashes == undefined) {
      return;
    }
    await leagueStore.syncLeagues(leagueId);

    for (const category of this.categories) {
      await this.syncCategory(category, leagueId);
    }
    const countriesHash = newHashes.find(
      (hash) => hash.category === "countries",
    );
    if (countriesHash?.hash !== localStorage.getItem(`countries_hash`)) {
      await this.syncCountries();
      localStorage.setItem(`countries_hash`, countriesHash?.hash || "");
    } else {
      console.log("Loading Countries from cache");
      this.loadFromCache();
    }
  }

  private async syncCategory(
    category: string,
    leagueId: number,
  ): Promise<void> {
    switch (category) {
      case "fixtures":
        await fixtureStore.syncFixtures(leagueId);
        break;
      case "clubs":
        await clubStore.syncClubs(leagueId);
        break;
      case "players":
        await playerStore.syncPlayers(leagueId);
        break;
      case "league_status":
        await leagueStore.syncLeagueStatus(leagueId);
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
        await seasonStore.syncSeasons(leagueId);
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

  private loadFromCache(): void {
    const cachedData = localStorage.getItem("countries");

    const cachedCountries = JSON.parse(cachedData || "[]");
    countryStore.setCountries(cachedCountries);
  }
}

export const storeManager = new StoreManager();
