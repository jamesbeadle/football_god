import { countryStore } from "../stores/country-store";

import { DataHashService } from "../services/data-hash-service";
import { CountryService } from "../services/country-service";

import { isError, replacer } from "../utils/helpers";

class StoreManager {
  private dataHashService: DataHashService;
  private countryService: CountryService;

  private categories: string[] = ["countries"];

  constructor() {
    this.dataHashService = new DataHashService();
    this.countryService = new CountryService();
  }

  async syncStores(): Promise<void> {
    const newHashes = await this.dataHashService.getDataHashes();

    let error = isError(newHashes);
    if (error) {
      console.error("Error fetching data hashes.");
      return;
    }

    for (const category of this.categories) {
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
    }
  }

  private loadFromCache(category: string): void {
    const cachedData = localStorage.getItem(category);

    switch (category) {
      case "countries":
        const cachedCountries = JSON.parse(cachedData || "[]");
        countryStore.setCountries(cachedCountries);
        break;
    }
  }
}

export const storeManager = new StoreManager();
