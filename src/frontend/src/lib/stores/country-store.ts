import { writable } from "svelte/store";
import type { CountryDTO } from "../../../../declarations/backend/backend.did";
import { CountryService } from "../services/country-service";

function createCountryStore() {
  const { subscribe, set } = writable<CountryDTO[]>([]);

  async function getCountries() {
    return new CountryService().getCountries();
  }

  return {
    getCountries,
    subscribe,
    setCountries: (countries: CountryDTO[]) => set(countries),
  };
}

export const countryStore = createCountryStore();
