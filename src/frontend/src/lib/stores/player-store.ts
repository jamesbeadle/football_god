import { writable } from "svelte/store";
import type {
  PlayerDTO,
  CreatePlayerDTO,
  LeagueId,
  PlayerId,
  LoanPlayerDTO,
  SetFreeAgentDTO,
  TransferPlayerDTO,
  UpdatePlayerDTO,
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

  async function transferPlayer(
    leagueId: LeagueId,
    dto: TransferPlayerDTO,
  ): Promise<any> {
    return new PlayerService().transferPlayer(leagueId, dto);
  }

  async function setFreeAgent(
    leagueId: LeagueId,
    dto: SetFreeAgentDTO,
  ): Promise<any> {
    return new PlayerService().setFreeAgent(leagueId, dto);
  }

  async function loanPlayer(
    leagueId: LeagueId,
    dto: LoanPlayerDTO,
  ): Promise<any> {
    return new PlayerService().loanPlayer(leagueId, dto);
  }

  async function createPlayer(
    leagueId: LeagueId,
    dto: CreatePlayerDTO,
  ): Promise<any> {
    return new PlayerService().createPlayer(leagueId, dto);
  }

  async function updatePlayer(
    leagueId: LeagueId,
    dto: UpdatePlayerDTO,
  ): Promise<any> {
    return new PlayerService().updatePlayer(leagueId, dto);
  }

  async function recallLoan(
    recallFromLeagueId: LeagueId,
    recallPlayerId: PlayerId,
  ): Promise<any> {
    return new PlayerService().recallLoan(recallFromLeagueId, recallPlayerId);
  }

  async function updatePlayerValue(
    playerId: PlayerId,
    updatedValue: Number,
  ): Promise<any> {
    return new PlayerService().updatePlayerValue(playerId, updatedValue);
  }

  return {
    getPlayers,
    transferPlayer,
    setFreeAgent,
    loanPlayer,
    createPlayer,
    updatePlayer,
    syncPlayers,
    getLoanedPlayers,
    recallLoan,
    updatePlayerValue,
  };
}

export const playerStore = createPlayerStore();
