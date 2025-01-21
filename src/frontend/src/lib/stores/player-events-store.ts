import { writable } from "svelte/store";
import type {
  PlayerDetailDTO,
  PlayerPointsDTO,
  PlayerDTO,
  LeagueStatus,
  FixtureDTO,
} from "../../../../declarations/data_canister/data_canister.did";
import { PlayerEventsService } from "../services/player-events-service";
import { playerStore } from "./player-store";
import { fixtureStore } from "./fixture-store";
import { leagueStore } from "./league-store";

function createPlayerEventsStore() {
  const { subscribe, set } = writable<PlayerPointsDTO[]>([]);

  async function getPlayerDetails(
    playerId: number,
    seasonId: number,
  ): Promise<PlayerDetailDTO | undefined> {
    return new PlayerEventsService().getPlayerDetails(playerId, seasonId);
  }

  async function getPlayerEventsFromBackend(
    seasonId: number,
    gameweek: number,
  ): Promise<PlayerPointsDTO[] | undefined> {
    return new PlayerEventsService().getPlayerEvents(seasonId, gameweek);
  }

  return {
    subscribe,
    setPlayerEvents: (players: PlayerPointsDTO[]) => set(players),
    getPlayerDetails,
    getPlayerEventsFromBackend,
  };
}

export const playerEventsStore = createPlayerEventsStore();
