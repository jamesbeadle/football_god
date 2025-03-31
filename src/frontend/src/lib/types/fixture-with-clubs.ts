import type {
  Fixture,
  Club,
} from "../../../../declarations/data_canister/data_canister.did";

export type FixtureWithClubs = {
  fixture: Fixture;
  homeClub: Club | undefined;
  awayClub: Club | undefined;
};
