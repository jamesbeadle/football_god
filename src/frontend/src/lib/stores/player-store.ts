import type {
  CreatePlayerDTO,
  LeagueId,
  PlayerId,
  LoanPlayerDTO,
  SetFreeAgentDTO,
  TransferPlayerDTO,
  UpdatePlayerDTO,
} from "../../../../declarations/data_canister/data_canister.did";
import { PlayerService } from "../services/player-service";

function createPlayerStore() {
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

  return {
    getPlayers,
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
