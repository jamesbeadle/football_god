import { writable } from "svelte/store";
import { AdminService } from "../services/admin-service";
import type {
  ClubDTO,
  LeagueId,
  TransferPlayerDTO,
} from "../../../../declarations/football_god_backend/football_god_backend.did";

function createAdminStore() {
  //TODO: Create functions that call the governance endpoints directly

  async function transferPlayer(
    leagueId: LeagueId,
    dto: TransferPlayerDTO,
  ): Promise<any> {
    return new AdminService().transferPlayer(leagueId, dto);
  }

  return {
    transferPlayer,
  };
}

export const adminStore = createAdminStore();
