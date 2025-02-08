import { writable } from "svelte/store";
import type {
  PlayerDTO,
  CreatePlayerDTO,
  LeagueId,
  LoanPlayerDTO,
  SetFreeAgentDTO,
  TransferPlayerDTO,
  UpdatePlayerDTO,
  RecallPlayerDTO,
} from "../../../../declarations/data_canister/data_canister.did";
import { PlayerService } from "../services/player-service";
import { DataHashService } from "../services/data-hash-service";
import { serializeData, deserializeData } from "../utils/helpers";
import { MAX_CACHED_LEAGUES } from "../constants/app.constants";

function createPlayerStore() {
  const { subscribe, update } = writable<Record<number, PlayerDTO[]>>({});

  let leagueCacheOrder: number[] = [];

  async function syncPlayers(leagueId: number) {
    try {
      const localHashKey = `players_hash_${leagueId}`;
      const localPlayersKey = `players_${leagueId}`;

      const localHash = localStorage.getItem(localHashKey);
      const playersHash = await new DataHashService().getCategoryHash(
        "players",
        leagueId,
      );
      let players: PlayerDTO[];

      if (!localHash || playersHash !== localHash) {
        players = await getPlayers(leagueId);
        localStorage.setItem(localPlayersKey, serializeData(players));
        localStorage.setItem(localHashKey, playersHash || "");
      } else {
        const cached = localStorage.getItem(localPlayersKey);
        if (cached) {
          players = deserializeData(cached) as PlayerDTO[];
        } else {
          players = await getPlayers(leagueId);
          localStorage.setItem(localPlayersKey, serializeData(players));
        }
      }

      update((current: Record<number, PlayerDTO[]>) => ({
        ...current,
        [leagueId]: players,
      }));

      if (!leagueCacheOrder.includes(leagueId)) {
        leagueCacheOrder.push(leagueId);
      } else {
        leagueCacheOrder = leagueCacheOrder.filter((id) => id !== leagueId);
        leagueCacheOrder.push(leagueId);
      }

      if (leagueCacheOrder.length > MAX_CACHED_LEAGUES) {
        const leastUsedLeagueId = leagueCacheOrder.shift();
        if (leastUsedLeagueId !== undefined) {
          localStorage.removeItem(`players_${leastUsedLeagueId}`);
          localStorage.removeItem(`players_hash_${leastUsedLeagueId}`);
        }
      }
    } catch (error) {
      console.error(`Error syncing players for league ${leagueId}:`, error);
      const cached = localStorage.getItem(`players_${leagueId}`);
      if (cached) {
        const players = deserializeData(cached) as PlayerDTO[];
        update((current: Record<number, PlayerDTO[]>) => ({
          ...current,
          [leagueId]: players,
        }));
      }
    }
  }

  async function getPlayers(leagueId: LeagueId) {
    return new PlayerService().getPlayers(leagueId);
  }

  async function getLoanedPlayers(leagueId: LeagueId) {
    return new PlayerService().getLoanedPlayers(leagueId);
  }

  return {
    getPlayers,
    syncPlayers,
    getLoanedPlayers,
  };
}

export const playerStore = createPlayerStore();
