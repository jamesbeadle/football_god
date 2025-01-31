import { writable } from "svelte/store";
import type {
  PlayerDetailDTO,
  PlayerPointsDTO,
} from "../../../../declarations/data_canister/data_canister.did";
import { PlayerEventsService } from "../services/player-events-service";

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
