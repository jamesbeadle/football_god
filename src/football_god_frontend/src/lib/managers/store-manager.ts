import { countryStore } from "$lib/stores/country-store";
import { leagueStore } from "$lib/stores/league-store";

import { DataHashService } from "$lib/services/data-hash-service";
import { CountryService } from "$lib/services/country-service";
import { LeagueService } from "$lib/services/league-service";

import { isError, replacer } from "$lib/utils/helpers";

class StoreManager {
  private dataHashService: DataHashService;
  private countryService: CountryService;
  private leagueService: LeagueService;

  private categories: string[] = ["countries", "leagues"];

  constructor() {
    this.dataHashService = new DataHashService();
    this.countryService = new CountryService();
    this.leagueService = new LeagueService();
  }

  async syncStores(): Promise<void> {
    const newHashes = await this.dataHashService.getDataHashes();

    let error = isError(newHashes);
    if (error) {
      console.error("Error fetching data hashes.");
      return;
    }

    for (const category of this.categories) {
      console.log(`syncing ${category}`);
      const categoryHash = newHashes.find((hash) => hash.category === category);

      if (categoryHash?.hash !== localStorage.getItem(`${category}_hash`)) {
        await this.syncCategory(category);
        localStorage.setItem(`${category}_hash`, categoryHash?.hash || "");
      } else {
        this.loadFromCache(category);
      }
    }
  }

  private async syncCategory(category: string): Promise<void> {
    switch (category) {
      case "countries":
        const updatedCountries = await this.countryService.getCountries();
        countryStore.setCountries(updatedCountries);
        localStorage.setItem(
          "countries",
          JSON.stringify(updatedCountries, replacer),
        );
        break;
      case "leagues":
        const updatedLeagues = await this.leagueService.getLeagues();
        leagueStore.setLeagues(updatedLeagues);
        localStorage.setItem(
          "leagues",
          JSON.stringify(updatedLeagues, replacer),
        );
        break;
    }
  }

  private loadFromCache(category: string): void {
    const cachedData = localStorage.getItem(category);

    switch (category) {
      case "countries":
        const cachedCountries = JSON.parse(cachedData || "[]");
        countryStore.setCountries(cachedCountries);
        break;
      case "leagues":
        const cachedLeagues = JSON.parse(cachedData || "[]");
        leagueStore.setLeagues(cachedLeagues);
        break;
    }
  }
}

export const storeManager = new StoreManager();
