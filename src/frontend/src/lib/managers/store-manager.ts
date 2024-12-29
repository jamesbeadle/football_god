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
}

export const storeManager = new StoreManager();
