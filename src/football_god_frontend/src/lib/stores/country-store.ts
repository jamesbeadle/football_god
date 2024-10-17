import { writable } from "svelte/store";

function createCountryStore() {
  const { subscribe, set } = writable<CountryDTO[]>([]);

  return {
    subscribe,
    setCountries: (countries: CountryDTO[]) => set(countries),
  };
}

export const countryStore = createCountryStore();
