import { authStore } from "$lib/stores/auth-store";
import { idlFactory } from "../../../../declarations/football_god_backend";
import type {
  FootballLeagueDTO,
  Gender,
  LeagueId,
} from "../../../../declarations/football_god_backend/football_god_backend.did";
import { ActorFactory } from "../../utils/ActorFactory";
import { isError } from "../utils/helpers";

export class LeagueService {
  private actor: any;

  constructor() {
    this.actor = ActorFactory.createActor(
      idlFactory,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID,
    );
  }

  async getLeagues(): Promise<FootballLeagueDTO[]> {
    const result = await this.actor.getLeagues();
    if (isError(result)) throw new Error("Failed to fetch leagues");
    return result.ok;
  }

  async setLeagueName(leagueId: LeagueId, leagueName: string): Promise<void> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.OPENFPL_BACKEND_CANISTER_ID ?? "",
    );

    const result = await identityActor.setLeagueName(leagueId, leagueName);
    if (isError(result)) throw new Error("Failed to set league name");
  }

  async setAbbreviatedName(
    leagueId: LeagueId,
    abbreviatedName: string,
  ): Promise<void> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.OPENFPL_BACKEND_CANISTER_ID ?? "",
    );

    const result = await identityActor.setAbbreviatedLeagueName(
      leagueId,
      abbreviatedName,
    );
    if (isError(result))
      throw new Error("Failed to set abbreviated league name");
  }

  async setGoverningBody(
    leagueId: LeagueId,
    governingBody: string,
  ): Promise<void> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.OPENFPL_BACKEND_CANISTER_ID ?? "",
    );

    const result = await identityActor.setLeagueGoverningBody(
      leagueId,
      governingBody,
    );
    if (isError(result)) throw new Error("Failed to set governing body");
  }

  async setGender(leagueId: LeagueId, gender: Gender): Promise<void> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.OPENFPL_BACKEND_CANISTER_ID ?? "",
    );

    const result = await identityActor.setLeagueGender(leagueId, gender);
    if (isError(result)) throw new Error("Failed to set league gender");
  }

  async setDateFormed(leagueId: LeagueId, date: BigInt): Promise<void> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.OPENFPL_BACKEND_CANISTER_ID ?? "",
    );

    const result = await identityActor.setLeagueDateFormed(leagueId, date);
    if (isError(result)) throw new Error("Failed to set league formed date");
  }

  async setCountryId(leagueId: LeagueId, countryId: number): Promise<void> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.OPENFPL_BACKEND_CANISTER_ID ?? "",
    );

    const result = await identityActor.setLeagueCountryId(leagueId, countryId);
    if (isError(result)) throw new Error("Failed to set league country");
  }

  async setLogo(leagueId: LeagueId, logo: Uint8Array): Promise<void> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.OPENFPL_BACKEND_CANISTER_ID ?? "",
    );

    const result = await identityActor.setLeagueLogo(leagueId, logo);
    if (isError(result)) throw new Error("Failed to set league logo");
  }

  async setTeamCount(leagueId: LeagueId, teamCount: number): Promise<void> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.OPENFPL_BACKEND_CANISTER_ID ?? "",
    );

    const result = await identityActor.setTeamCount(leagueId, teamCount);
    if (isError(result)) throw new Error("Failed to set league team count");
  }

  async createLeague(dto: CreateLeagueDTO): Promise<void> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.OPENFPL_BACKEND_CANISTER_ID ?? "",
    );

    const result = await identityActor.createLeague(dto);
    if (isError(result)) throw new Error("Failed to create league");
  }
}
