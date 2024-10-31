import { authStore } from "$lib/stores/auth-store";
import { idlFactory } from "../../../../declarations/football_god_backend";
import type {
  ClubDTO,
  CreateClubDTO,
  CreateLeagueDTO,
  CreatePlayerDTO,
  FixtureDTO,
  GetFixturesDTO,
  LeagueId,
  LoanPlayerDTO,
  MoveFixtureDTO,
  PostponeFixtureDTO,
  SubmitFixtureDataDTO,
  SystemStateDTO,
  TransferPlayerDTO,
  UpdateLeagueDTO,
  UpdatePlayerDTO,
  UpdateSystemStateDTO,
} from "../../../../declarations/football_god_backend/football_god_backend.did";
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

  async isDataManager(): Promise<boolean> {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
    );
    const result: any = await identityActor.isDataManager();
    if (isError(result)) {
      throw new Error("Failed to check is data manager");
    }
    return result.ok;
  }

  async isAdmin(): Promise<boolean> {
    const identityActor = await ActorFactory.createIdentityActor(
      authStore,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
    );
    const result: any = await identityActor.isAdmin();
    if (isError(result)) {
      throw new Error("Failed to check is admin");
    }
    return result.ok;
  }

  async getLeagueClubs(leagueId: LeagueId): Promise<ClubDTO[]> {
    const result = await this.actor.getLeagueClubs(leagueId);
    if (isError(result)) throw new Error("Failed to fetch league clubs");
    return result.ok;
  }

  async createLeague(dto: CreateLeagueDTO): Promise<void> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
    );

    const result = await identityActor.executeCreateLeague(dto);
    if (isError(result)) throw new Error("Failed to create league");
  }

  async updateLeague(dto: UpdateLeagueDTO): Promise<void> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
    );

    const result = await identityActor.executeUpdateLeague(dto);
    if (isError(result)) throw new Error("Failed to update league");
  }

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

  async loanPlayer(leagueId: number, dto: LoanPlayerDTO): Promise<void> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
    );

    const result = await identityActor.executeLoanPlayer(leagueId, dto);
    if (isError(result)) throw new Error("Failed to loan player");
  }

  async createPlayer(leagueId: number, dto: CreatePlayerDTO): Promise<void> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
    );

    const result = await identityActor.executeCreatePlayer(leagueId, dto);
    if (isError(result)) throw new Error("Failed to creaete player");
  }

  async updatePlayer(leagueId: number, dto: UpdatePlayerDTO): Promise<void> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
    );

    const result = await identityActor.executeUpdatePlayer(leagueId, dto);
    if (isError(result)) throw new Error("Failed to update player");
  }

  async updateSystemState(
    applicationName: string,
    dto: UpdateSystemStateDTO,
  ): Promise<void> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
    );

    const result = await identityActor.updateSystemState(applicationName, dto);
    if (isError(result)) throw new Error("Failed to update system state");
  }

  async snapshotManagers(applicationName: string): Promise<void> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
    );

    const result = await identityActor.snapshotManagers(applicationName);
    if (isError(result)) throw new Error("Failed to snapshot managers");
  }

  async calculateGameweekScores(applicationName: string): Promise<void> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
    );

    const result = await identityActor.calculateGameweekScores(applicationName);
    if (isError(result)) throw new Error("Failed to calculate gameweek scores");
  }

  async calculateLeaderboards(applicationName: string): Promise<void> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
    );

    const result = await identityActor.calculateLeaderboards(applicationName);
    if (isError(result)) throw new Error("Failed to calculate leaderboards");
  }

  async createClub(dto: CreateClubDTO): Promise<void> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
    );

    const result = await identityActor.executeCreateClub(dto);
    if (isError(result)) throw new Error("Failed to create club");
  }

  async getSystemState(
    applicationName: string,
  ): Promise<SystemStateDTO | undefined> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
    );

    const result = await identityActor.getSystemState(applicationName);
    console.log(result);
    if (isError(result)) throw new Error("Failed to get system state");
    return result.ok;
  }

  async getFixtures(dto: GetFixturesDTO): Promise<FixtureDTO[] | undefined> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
    );

    const result = await identityActor.getFixtures(dto);
    console.log(result);
    if (isError(result)) throw new Error("Failed to get fixtures");
    return result.ok;
  }

  async moveFixture(dto: MoveFixtureDTO): Promise<void> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
    );

    const result = await identityActor.executeMoveFixture(dto);
    if (isError(result)) throw new Error("Failed to move fixture");
  }

  async postponeFixture(dto: PostponeFixtureDTO): Promise<void> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
    );

    const result = await identityActor.executePostponeFixture(dto);
    if (isError(result)) throw new Error("Failed to postpone fixture");
  }

  async submitFixtureData(dto: SubmitFixtureDataDTO): Promise<void> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
    );

    const result = await identityActor.executeSubmitFixtureData(dto);
    if (isError(result)) throw new Error("Failed to submit fixture data");
  }
}
