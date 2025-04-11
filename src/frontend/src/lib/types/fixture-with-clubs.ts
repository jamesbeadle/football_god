import type {
  Club,
  Fixture,
} from "../../../../declarations/backend/backend.did";

export type FixtureWithClubs = {
  fixture: Fixture;
  homeClub: Club | undefined;
  awayClub: Club | undefined;
};
