import {expect, test} from "vitest";
import { data_canister } from "./actor";


test("1. Get Countries", async () => { 
    const countries = await data_canister.getCountries();
    console.log(countries);
    expect(countries).toBeDefined();
});