import type { LeagueId } from "../../../../declarations/backend/backend.did";
import { idlFactory } from "../../../../declarations/backend";
import { ActorFactory } from "../utils/ActorFactory";
import { isError } from "../utils/helpers";
import { authStore } from "$lib/stores/auth-store";
import type {
  CreatePlayerDTO,
  LoanedPlayerDTO,
  LoanPlayerDTO,
  PlayerDTO,
  PlayerId,
  RecallPlayerDTO,
  SetFreeAgentDTO,
  TransferPlayerDTO,
  UpdatePlayerDTO,
} from "../../../../declarations/data_canister/data_canister.did";

export class PlayerService {
  constructor() {}

  async getPlayers(leagueId: LeagueId): Promise<PlayerDTO[]> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.DATA_CANISTER_CANISTER_ID ?? "",
    );

    const result = await identityActor.getPlayers(leagueId);
    if (isError(result)) throw new Error("Failed to fetch players");
    return result.ok;
  }

  async getLoanedPlayers(leagueId: LeagueId): Promise<LoanedPlayerDTO[]> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.DATA_CANISTER_CANISTER_ID ?? "",
    );
    const result = await identityActor.getLoanedPlayers(leagueId);
    if (isError(result)) throw new Error("Failed to fetch players");
    return result.ok;
  }

  async transferPlayer(
    leagueId: number,
    dto: TransferPlayerDTO,
  ): Promise<void> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.DATA_CANISTER_CANISTER_ID ?? "",
    );

    const result = await identityActor.executeTransferPlayer(leagueId, dto);
    if (isError(result)) throw new Error("Failed to transfer player");
  }

  async setFreeAgent(leagueId: number, dto: SetFreeAgentDTO): Promise<void> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.DATA_CANISTER_CANISTER_ID ?? "",
    );

    const result = await identityActor.executeSetFreeAgent(leagueId, dto);
    if (isError(result)) throw new Error("Failed to set player as free agent");
  }

  async loanPlayer(leagueId: number, dto: LoanPlayerDTO): Promise<void> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.DATA_CANISTER_CANISTER_ID ?? "",
    );

    const result = await identityActor.executeLoanPlayer(leagueId, dto);
    if (isError(result)) throw new Error("Failed to loan player");
  }

  async createPlayer(leagueId: number, dto: CreatePlayerDTO): Promise<void> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.DATA_CANISTER_CANISTER_ID ?? "",
    );

    const result = await identityActor.executeCreatePlayer(leagueId, dto);
    if (isError(result)) throw new Error("Failed to creaete player");
  }

  async updatePlayer(leagueId: number, dto: UpdatePlayerDTO): Promise<void> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.DATA_CANISTER_CANISTER_ID ?? "",
    );

    const result = await identityActor.executeUpdatePlayer(leagueId, dto);
    if (isError(result)) throw new Error("Failed to update player");
  }

  async recallLoan(leagueId: number, dto: RecallPlayerDTO): Promise<void> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.DATA_CANISTER_CANISTER_ID ?? "",
    );

    const result = await identityActor.executeRecallPlayer(dto);
    if (isError(result)) throw new Error("Failed to recall player");
  }
}
