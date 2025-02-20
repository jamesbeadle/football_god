import type { FixtureDTO, ClubDTO} from "../../../../declarations/data_canister/data_canister.did";

export type FixtureWithClubs = {
  fixture: FixtureDTO;
  homeClub: ClubDTO | undefined;
  awayClub: ClubDTO | undefined;
};
