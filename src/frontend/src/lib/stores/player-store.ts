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
import { dev } from '$app/environment';
import { mockData } from "../local/mock-data";

function createPlayerStore() {
  const { subscribe, update } = writable<Record<number, PlayerDTO[]>>({});

  async function getPlayers(leagueId: LeagueId) {

    const cached = localStorage.getItem(`players_${leagueId}`);
    if (cached) {
      return deserializeData(cached) as PlayerDTO[];
    }
    if (dev) {
      const playersData = mockData.players[leagueId];
      return playersData?.ok;
    }
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

  return {
    getPlayers,
    subscribe,
    update,
    transferPlayer,
    setFreeAgent,
    loanPlayer,
    createPlayer,
    updatePlayer,
    getLoanedPlayers,
    recallLoan,
  };
}

export const playerStore = createPlayerStore();
