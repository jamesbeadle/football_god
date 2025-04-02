import { writable } from "svelte/store";
import { CountryService } from "../services/country-service";
import type {
  Countries,
  Country,
} from "../../../../declarations/data_canister/data_canister.did";

function createCountryStore() {
  const { subscribe, set } = writable<Countries | undefined>(undefined);

  async function getCountries() {
    return new CountryService().getCountries();
  }

  return {
    getCountries,
    subscribe,
    setCountries: (countries: Countries) => set(countries),
  };
}

export const countryStore = createCountryStore();
