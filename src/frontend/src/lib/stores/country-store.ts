import { writable } from "svelte/store";
import { CountryService } from "../services/country-service";
import type { Countries } from "../../../../declarations/backend/backend.did";

function createCountryStore() {
  const { subscribe, set } = writable<Countries | undefined>(undefined);

  async function getCountries(): Promise<Countries | undefined> {
    return new CountryService().getCountries();
  }

  return {
    getCountries,
    subscribe,
    setCountries: (countries: Countries) => set(countries),
  };
}

export const countryStore = createCountryStore();
