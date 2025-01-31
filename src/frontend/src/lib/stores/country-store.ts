import { writable } from "svelte/store";
import { CountryService } from "../services/country-service";
import type { CountryDTO } from "../../../../declarations/data_canister/data_canister.did";

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
