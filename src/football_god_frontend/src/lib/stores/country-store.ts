import { writable } from "svelte/store";
import type { CountryDTO } from "../../../../declarations/football_god_backend/football_god_backend.did";

function createCountryStore() {
  const { subscribe, set } = writable<CountryDTO[]>([]);

  return {
    subscribe,
    setCountries: (countries: CountryDTO[]) => set(countries),
  };
}

export const countryStore = createCountryStore();
