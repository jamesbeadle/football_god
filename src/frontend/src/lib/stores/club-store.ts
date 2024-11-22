import type {
  CreateClubDTO,
  LeagueId,
  RemoveClubDTO,
} from "../../../../declarations/backend/backend.did";
import { ClubService } from "../services/club-service";

function createClubStore() {
  async function getClubs(leagueId: LeagueId) {
    return new ClubService().getClubs(leagueId);
  }

  async function createClub(dto: CreateClubDTO): Promise<any> {
    return new ClubService().createClub(dto);
  }

  async function removeClub(dto: RemoveClubDTO): Promise<any> {
    return new ClubService().removeClub(dto);
  }

  return {
    getClubs,
    createClub,
    removeClub,
  };
}

export const clubStore = createClubStore();
