import { idlFactory } from "../../../../declarations/backend";
import { ActorFactory } from "$lib/utils/ActorFactory";
import { isError } from "$lib/utils/helpers";
import type {
  PlayerPointsDTO,
  PlayerDetailDTO,
  GetPlayerDetailsDTO,
  GameweekFiltersDTO,
} from "../../../../declarations/data_canister/data_canister.did";
import { authStore } from "$lib/stores/auth-store";

export class PlayerEventsService {
  constructor() {}

  async getPlayerDetails(
    playerId: number,
    seasonId: number,
  ): Promise<PlayerDetailDTO | undefined> {
    try {
      let dto: GetPlayerDetailsDTO = {
        playerId: playerId,
        seasonId: seasonId,
      };
      const identityActor: any = await ActorFactory.createIdentityActor(
        authStore,
        process.env.DATA_CANISTER_CANISTER_ID ?? "",
      );
      const result = await identityActor.getPlayerDetails(dto);

      if (isError(result)) {
        console.error("Error fetching player details");
      }

      return result.ok;
    } catch (error) {
      console.error("Error fetching player data:", error);
      throw error;
    }
  }

  async getPlayerDetailsForGameweek(
    leagueId: number,
    seasonId: number,
    gameweek: number,
  ): Promise<PlayerPointsDTO[] | undefined> {
    try {
    } catch (error) {}
    let dto: GameweekFiltersDTO = {
      seasonId,
      gameweek,
    };
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.DATA_CANISTER_CANISTER_ID ?? "",
    );
    const result = await identityActor.getPlayerDetailsForGameweek(
      leagueId,
      dto,
    );
    if (isError(result))
      throw new Error(
        "Failed to fetch player details for gameweek in player events service",
      );
    return result.ok;
  }

  async getPlayerEvents(
    seasonId: number,
    gameweek: number,
  ): Promise<PlayerPointsDTO[] | undefined> {
    try {
      let dto: GameweekFiltersDTO = {
        seasonId,
        gameweek,
      };
      const identityActor: any = await ActorFactory.createIdentityActor(
        authStore,
        process.env.DATA_CANISTER_CANISTER_ID ?? "",
      );
      const result = await identityActor.getPlayerDetailsForGameweek(dto);

      if (isError(result)) {
        console.error("Error fetching player details for gameweek");
      }

      return result.ok;
    } catch (error) {
      console.error("Error fetching player events: ", error);
      /*  toasts.addToast({
        type: "error",
        message: "Error fetching player events.",
      }); */
    }
  }
}
