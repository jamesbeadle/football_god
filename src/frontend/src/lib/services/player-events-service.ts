import { idlFactory } from "../../../../declarations/backend";
import { ActorFactory } from "$lib/utils/ActorFactory";
import { isError } from "$lib/utils/helpers";
import type {
  PlayerPointsDTO,
  PlayerDetailDTO,
  GetPlayerDetailsDTO,
  GameweekFiltersDTO,
} from "../../../../declarations/data_canister/data_canister.did";

export class PlayerEventsService {
  private actor: any;

  constructor() {
    this.actor = ActorFactory.createActor(
      idlFactory,
      process.env.BACKEND_CANISTER_ID,
    );
  }

  async getPlayerDetails(
    playerId: number,
    seasonId: number,
  ): Promise<PlayerDetailDTO | undefined> {
    try {
      let dto: GetPlayerDetailsDTO = {
        playerId: playerId,
        seasonId: seasonId,
      };
      let result = await this.actor.getPlayerDetails(dto);

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
    const result = await this.actor.getPlayerDetailsForGameweek(leagueId, dto);
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
      let result = await this.actor.getPlayerDetailsForGameweek(dto);

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
