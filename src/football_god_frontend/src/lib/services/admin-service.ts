import { authStore } from "$lib/stores/auth-store";
import { idlFactory } from "../../../../declarations/football_god_backend";
import { ActorFactory } from "../../utils/ActorFactory";
import { isError } from "../utils/helpers";

export class AdminService {
  private actor: any;

  constructor() {
    this.actor = ActorFactory.createActor(
      idlFactory,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID,
    );
  }

  async getAdminDashboard(): Promise<AdminDashboardDTO> {
    const result = await this.actor.getAdminDashboard();
    if (isError(result)) throw new Error("Failed to fetch clubs");
    return result.ok;
  }

  async getLeagueClubs(leagueId: FootballLeagueId): Promise<ClubDTO[]> {
    const result = await this.actor.getLeagueClubs(leagueId);
    if (isError(result)) throw new Error("Failed to fetch league clubs");
    return result.ok;
  }

  //Temporary post functions to handle multiple leagues
  async transferPlayer(
    leagueId: number,
    dto: TransferPlayerDTO,
  ): Promise<void> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
    );

    const result = await identityActor.executeTransferPlayer(leagueId, dto);
    if (isError(result)) throw new Error("Failed to transfer player");
  }
}
