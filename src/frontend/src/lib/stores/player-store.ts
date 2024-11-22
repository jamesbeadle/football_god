import type {
  CreatePlayerDTO,
  LeagueId,
  LoanPlayerDTO,
  SetFreeAgentDTO,
  TransferPlayerDTO,
  UpdatePlayerDTO,
} from "../../../../declarations/backend/backend.did";
import { PlayerService } from "../services/player-service";

function createPlayerStore() {
  async function getPlayers(leagueId: LeagueId) {
    return new PlayerService().getPlayers(leagueId);
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

  return {
    getPlayers,
    transferPlayer,
    setFreeAgent,
    loanPlayer,
    createPlayer,
    updatePlayer,
  };
}

export const playerStore = createPlayerStore();
