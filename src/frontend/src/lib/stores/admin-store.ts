import { writable } from "svelte/store";
import { AdminService } from "../services/admin-service";
import type {
  CreateClubDTO,
  CreateLeagueDTO,
  CreatePlayerDTO,
  FixtureDTO,
  GetFixturesDTO,
  LeagueId,
  LoanPlayerDTO,
  MoveFixtureDTO,
  PostponeFixtureDTO,
  RemoveClubDTO,
  SetFreeAgentDTO,
  SubmitFixtureDataDTO,
  SystemStateDTO,
  TransferPlayerDTO,
  UpdateLeagueDTO,
  UpdatePlayerDTO,
  UpdateSystemStateDTO,
} from "../../../../declarations/backend/backend.did";

function createAdminStore() {
  //TODO: Create functions that call the governance endpoints directly

  async function transferPlayer(
    leagueId: LeagueId,
    dto: TransferPlayerDTO,
  ): Promise<any> {
    return new AdminService().transferPlayer(leagueId, dto);
  }

  async function setFreeAgent(
    leagueId: LeagueId,
    dto: SetFreeAgentDTO,
  ): Promise<any> {
    return new AdminService().setFreeAgent(leagueId, dto);
  }

  async function loanPlayer(
    leagueId: LeagueId,
    dto: LoanPlayerDTO,
  ): Promise<any> {
    return new AdminService().loanPlayer(leagueId, dto);
  }

  async function createPlayer(
    leagueId: LeagueId,
    dto: CreatePlayerDTO,
  ): Promise<any> {
    return new AdminService().createPlayer(leagueId, dto);
  }

  async function updatePlayer(
    leagueId: LeagueId,
    dto: UpdatePlayerDTO,
  ): Promise<any> {
    return new AdminService().updatePlayer(leagueId, dto);
  }

  async function createLeague(dto: CreateLeagueDTO): Promise<any> {
    return new AdminService().createLeague(dto);
  }

  async function updateLeague(dto: UpdateLeagueDTO): Promise<any> {
    return new AdminService().updateLeague(dto);
  }

  async function getSystemState(
    applicationName: string,
  ): Promise<SystemStateDTO | undefined> {
    return new AdminService().getSystemState(applicationName);
  }

  async function updateSystemState(
    applicationName: string,
    dto: UpdateSystemStateDTO,
  ): Promise<any> {
    return new AdminService().updateSystemState(applicationName, dto);
  }

  async function snapshotManagers(applicationName: string): Promise<any> {
    return new AdminService().snapshotManagers(applicationName);
  }

  async function calculateGameweekScores(
    applicationName: string,
  ): Promise<any> {
    return new AdminService().calculateGameweekScores(applicationName);
  }

  async function calculateLeaderboards(applicationName: string): Promise<any> {
    return new AdminService().calculateLeaderboards(applicationName);
  }

  async function calculateWeeklyRewards(
    applicationName: string,
    gameweek: number,
  ): Promise<any> {
    return new AdminService().calculateWeeklyRewards(applicationName, gameweek);
  }

  async function payWeeklyRewards(
    applicationName: string,
    gameweek: number,
  ): Promise<any> {
    return new AdminService().payWeeklyRewards(applicationName, gameweek);
  }

  async function createClub(dto: CreateClubDTO): Promise<any> {
    return new AdminService().createClub(dto);
  }

  async function removeClub(dto: RemoveClubDTO): Promise<any> {
    return new AdminService().removeClub(dto);
  }

  async function getFixtures(
    dto: GetFixturesDTO,
  ): Promise<FixtureDTO[] | undefined> {
    return new AdminService().getFixtures(dto);
  }

  async function moveFixture(dto: MoveFixtureDTO): Promise<any> {
    return new AdminService().moveFixture(dto);
  }

  async function postponeFixture(dto: PostponeFixtureDTO): Promise<any> {
    return new AdminService().postponeFixture(dto);
  }

  async function submitFixtureData(dto: SubmitFixtureDataDTO): Promise<any> {
    return new AdminService().submitFixtureData(dto);
  }

  return {
    createLeague,
    updateLeague,
    transferPlayer,
    setFreeAgent,
    loanPlayer,
    createPlayer,
    updatePlayer,
    updateSystemState,
    snapshotManagers,
    calculateGameweekScores,
    calculateLeaderboards,
    calculateWeeklyRewards,
    payWeeklyRewards,
    createClub,
    removeClub,
    getSystemState,
    getFixtures,
    moveFixture,
    postponeFixture,
    submitFixtureData,
  };
}

export const adminStore = createAdminStore();
