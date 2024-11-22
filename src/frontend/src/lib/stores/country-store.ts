import { writable } from "svelte/store";
import type { CountryDTO } from "../../../../declarations/backend/backend.did";
import { CountryService } from "../services/country-service";

function createCountryStore() {
  //TODO: Can put into local storage
  async function getCountries() {
    return new CountryService().getCountries();
  }

  return {
    getCountries,
  };
}

export const countryStore = createCountryStore();
