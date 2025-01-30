import { derived } from "svelte/store";
import { fixtureStore } from "../stores/fixture-store";
import { clubStore } from "../stores/club-store";
import type {
  FixtureDTO,
  ClubDTO,
} from "../../../../declarations/backend/backend.did";

export interface FixtureWithClubs extends FixtureDTO {
  homeClub?: ClubDTO;
  awayClub?: ClubDTO;
  leagueId: number;
}

export const fixtureWithClubsStore = derived(
  [fixtureStore, clubStore],
  ([$fixtureStore, $clubStore]) => {
    const allFixtures = Object.values($fixtureStore).flat();
    const allClubs = Object.values($clubStore).flat();

    if (!allFixtures.length || !allClubs.length) {
      return [];
    }

    return Object.entries($fixtureStore).flatMap(([leagueId, fixtures]) =>
      fixtures.map((fixture) => ({
        ...fixture,
        leagueId: Number(leagueId),
        homeClub: allClubs.find(
          (club) => Number(club.id) === Number(fixture.homeClubId),
        ),
        awayClub: allClubs.find(
          (club) => Number(club.id) === Number(fixture.awayClubId),
        ),
      })),
    );
  },
);
