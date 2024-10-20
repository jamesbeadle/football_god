import { writable } from "svelte/store";
import type { CountryDTO } from "../../../../declarations/football_god_backend/football_god_backend.did";
import { CountryService } from "$lib/services/country-service";

function createCountryStore() {
  async function getCountries() {
    return new CountryService().getCountries();
  }

  return {
    getCountries,
  };
}

export const countryStore = createCountryStore();
