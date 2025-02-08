import { playerStore } from "$lib/stores/player-store";
import { clubStore } from "./club-store";
import { authStore } from "./auth-store";

import { createAgent } from "@dfinity/utils";
import { IDL } from "@dfinity/candid";
import { Principal } from "@dfinity/principal";

import type { OptionIdentity } from "$lib/types/identity";
import { SnsGovernanceCanister } from "@dfinity/sns";
import type {
  Command,
  ExecuteGenericNervousSystemFunction,
} from "@dfinity/sns/dist/candid/sns_governance";

import type {
  RevaluePlayerUpDTO,
  RevaluePlayerDownDTO,
  LoanPlayerDTO,
  TransferPlayerDTO,
  RecallPlayerDTO,
  CreatePlayerDTO,
  UpdatePlayerDTO,
  SetPlayerInjuryDTO,
  RetirePlayerDTO,
  UnretirePlayerDTO,
  PromoteClubDTO,
  UpdateClubDTO,
  CreateClubDTO,
  SubmitFixtureDataDTO,
  AddInitialFixturesDTO,
  MoveFixtureDTO,
  PostponeFixtureDTO,
  CreateLeagueDTO,
  UpdateLeagueDTO,
  RescheduleFixtureDTO,
} from "../../../../declarations/data_canister/data_canister.did";

import type {
  LeagueId,
  ClubId,
  PlayerId,
  FixtureId,
  GameweekNumber,
  SeasonId,
  PlayerPosition,
} from "../../../../declarations/data_canister/data_canister.did";
import {
  buildCreateClubText,
  buildCreateLeagueText,
  buildCreatePlayerText,
  buildLoanPlayerText,
  buildRescheduleFixtureText,
  buildRetirePlayerText,
  buildRevaluePlayerDownText,
  buildRevaluePlayerUpText,
  buildSetPlayerInjuryText,
  buildSubmitFixtureDataText,
  buildTransferPlayerText,
  buildUpdateLeagueText,
  buildUpdatePlayerText,
} from "$lib/utils/proposal.utils";
import {
  CreateClubDTO_Idl,
  CreateLeagueDTO_Idl,
  CreatePlayerDTO_Idl,
  LoanPlayerDTO_Idl,
  RescheduleFixtureDTO_Idl,
  RetirePlayerDTO_Idl,
  RevaluePlayerDownDTO_Idl,
  RevaluePlayerUpDTO_Idl,
  SetPlayerInjuryDTO_Idl,
  SubmitFixtureDataDTO_Idl,
  TransferPlayerDTO_Idl,
  UpdatePlayerDTO_Idl,
} from "$lib/types/idl-types";
import {
  formatUnixDateToReadable,
  formatUnixDateToSmallReadable,
  formatUnixTimeToTime,
} from "$lib/utils/helpers";
import { leagueStore } from "./league-store";
import { toasts } from "./toasts-store";
import { fixtureStore } from "./fixture-store";
import { seasonStore } from "./season-store";
import { countryStore } from "./country-store";

async function createProposal({
  identity,
  functionId,
  payload,
  title,
  summary,
}: {
  identity: OptionIdentity;
  functionId: bigint;
  payload: Uint8Array;
  title: string;
  summary: string;
}) {
  if (!identity) throw new Error("No identity to propose with");

  const agent = await createAgent({
    identity,
    host: import.meta.env.VITE_AUTH_PROVIDER_URL,
    fetchRootKey: process.env.DFX_NETWORK === "local",
  });

  const { manageNeuron, listNeurons } = SnsGovernanceCanister.create({
    canisterId: Principal.fromText(
      process.env.SNS_GOVERNANCE_CANISTER_ID ?? "",
    ),
    agent,
  });

  const userNeurons = await listNeurons({
    principal: identity.getPrincipal(),
    limit: 10,
    beforeNeuronId: { id: [] },
  });
  if (userNeurons.length === 0) {
    throw new Error("No neurons found for this principal; cannot propose");
  }

  const neuronId = userNeurons[0].id[0];
  if (!neuronId) throw new Error("Neuron has no subaccount ID");

  const fn: ExecuteGenericNervousSystemFunction = {
    function_id: functionId,
    payload,
  };
  const command: Command = {
    MakeProposal: {
      title,
      url: "openfpl.xyz/governance",
      summary,
      action: [{ ExecuteGenericNervousSystemFunction: fn }],
    },
  };

  return await manageNeuron({
    subaccount: neuronId.id,
    command: [command],
  });
}

function createGovernanceStore() {
  async function revaluePlayerUp(dto: RevaluePlayerUpDTO): Promise<any> {
    let userIdentity: OptionIdentity;
    authStore.subscribe((auth) => (userIdentity = auth.identity));
    if (!userIdentity) return;

    const allPlayers = await playerStore.getPlayers(dto.leagueId);
    const player = allPlayers.find((p) => p.id === dto.playerId);
    if (!player) throw new Error("Player not found.");

    const oldVal = (player.valueQuarterMillions / 4).toFixed(2);
    const newVal = ((player.valueQuarterMillions + 1) / 4).toFixed(2);
    const { title, summary } = buildRevaluePlayerUpText(
      `${player.firstName} ${player.lastName}`,
      oldVal,
      newVal,
    );

    const encoded = IDL.encode([RevaluePlayerUpDTO_Idl], [dto]);

    return await createProposal({
      identity: userIdentity,
      functionId: 50000n,
      payload: new Uint8Array(encoded),
      title,
      summary,
    });
  }

  async function revaluePlayerDown(dto: RevaluePlayerDownDTO): Promise<any> {
    let userIdentity: OptionIdentity;
    authStore.subscribe((auth) => (userIdentity = auth.identity));
    if (!userIdentity) return;

    const players = await playerStore.getPlayers(dto.leagueId);
    const player = players.find((p) => p.id === dto.playerId);
    if (!player) throw new Error("Player not found.");

    const oldVal = (player.valueQuarterMillions / 4).toFixed(2);
    const newVal = ((player.valueQuarterMillions - 1) / 4).toFixed(2);
    const { title, summary } = buildRevaluePlayerDownText(
      `${player.firstName} ${player.lastName}`,
      oldVal,
      newVal,
    );

    const encoded = IDL.encode([RevaluePlayerDownDTO_Idl], [dto]);

    return await createProposal({
      identity: userIdentity,
      functionId: 51000n,
      payload: new Uint8Array(encoded),
      title,
      summary,
    });
  }

  async function loanPlayer(dto: LoanPlayerDTO): Promise<any> {
    let userIdentity: OptionIdentity;
    authStore.subscribe((auth) => (userIdentity = auth.identity));
    if (!userIdentity) return;

    const players = await playerStore.getPlayers(dto.leagueId);
    const player = players.find((p) => p.id === dto.playerId);
    if (!player) throw new Error("Player not found.");

    const clubs = await clubStore.getClubs(dto.leagueId);
    const currentClub = clubs.find((c) => c.id === player.clubId);
    if (!currentClub) throw new Error("Current club not found.");

    const loanClubs = await clubStore.getClubs(dto.loanLeagueId);
    const newClub = loanClubs.find((c) => c.id === dto.loanClubId);
    if (!newClub) throw new Error("Loan club not found.");

    const { title, summary } = buildLoanPlayerText(
      `${player.firstName} ${player.lastName}`,
      currentClub.friendlyName,
      newClub.friendlyName,
      formatUnixDateToSmallReadable(Number(dto.loanEndDate)),
    );

    const encoded = IDL.encode([LoanPlayerDTO_Idl], [dto]);

    return await createProposal({
      identity: userIdentity,
      functionId: 52000n,
      payload: new Uint8Array(encoded),
      title,
      summary,
    });
  }

  async function transferPlayer(dto: TransferPlayerDTO): Promise<any> {
    let userIdentity: OptionIdentity;
    authStore.subscribe((auth) => (userIdentity = auth.identity));
    if (!userIdentity) return;

    const allPlayers = await playerStore.getPlayers(dto.leagueId);
    const player = allPlayers.find((p) => p.id === dto.playerId);
    if (!player) throw new Error("Player not found.");

    const clubs = await clubStore.getClubs(dto.leagueId);
    const currentClub = clubs.find((c) => c.id === player.clubId);
    if (!currentClub) throw new Error("Current club not found.");

    const newLeagueClubs = await clubStore.getClubs(dto.newLeagueId);
    const newClub = newLeagueClubs.find((c) => c.id === dto.newClubId);
    if (!newClub) throw new Error("New club not found.");

    let leagues = await leagueStore.getLeagues();

    const currentLeague = leagues.find((x) => x.id == dto.leagueId);
    if (!currentLeague) throw new Error("Current league not found.");

    const transferLeague = leagues.find((x) => x.id == dto.newLeagueId);
    if (!transferLeague) throw new Error("Transfer league not found.");

    const newValue = (player.valueQuarterMillions / 4).toFixed(2);

    const { title, summary } = buildTransferPlayerText(
      `${player.firstName} ${player.lastName}`,
      currentClub.friendlyName,
      currentLeague.name,
      newClub.friendlyName,
      transferLeague.name,
      newValue,
    );

    const encoded = IDL.encode([TransferPlayerDTO_Idl], [dto]);

    return await createProposal({
      identity: userIdentity,
      functionId: 53000n,
      payload: new Uint8Array(encoded),
      title,
      summary,
    });
  }

  async function submitFixtureData(dto: SubmitFixtureDataDTO): Promise<any> {
    let userIdentity: OptionIdentity;
    authStore.subscribe((auth) => (userIdentity = auth.identity));
    if (!userIdentity) return;

    if (dto.playerEventData.length <= 0) {
      return toasts.addToast({
        type: "error",
        message: "Player event data not found.",
      });
    }

    if (dto.playerEventData.length <= 0) {
      return toasts.addToast({
        type: "error",
        message: "Player event data not found.",
      });
    }

    const leagueFixtures = await fixtureStore.getFixtures(
      dto.leagueId,
      dto.seasonId,
    );
    let fixture = leagueFixtures.find((x) => x.id == dto.fixtureId);
    if (!fixture) throw new Error("Fixture not found.");

    const clubs = await clubStore.getClubs(dto.leagueId);
    const homeClub = clubs.find((c) => c.id === fixture.homeClubId);
    const awayClub = clubs.find((c) => c.id === fixture.awayClubId);
    if (!homeClub || !awayClub) throw new Error("Missing home/away club.");

    const allSeasons = await seasonStore.getSeasons(dto.leagueId);
    const season = allSeasons.find((x) => x.id == dto.seasonId);
    const seasonName = season?.name ?? "Unknown Season";
    const clubsVs = `${homeClub.friendlyName} v ${awayClub.friendlyName}`;
    const kickOff = formatUnixDateToReadable(Number(fixture.kickOff));

    const encoded = IDL.encode([SubmitFixtureDataDTO_Idl], [dto]);

    const { title, summary } = buildSubmitFixtureDataText(
      clubsVs,
      dto.gameweek,
      kickOff,
      "",
      dto.fixtureId,
      seasonName,
    );

    return await createProposal({
      identity: userIdentity,
      functionId: 54000n,
      payload: new Uint8Array(encoded),
      title,
      summary,
    });
  }

  async function createLeague(dto: CreateLeagueDTO): Promise<any> {
    let userIdentity: OptionIdentity;
    authStore.subscribe((auth) => (userIdentity = auth.identity));
    if (!userIdentity) return;

    let countries = await countryStore.getCountries();
    let country = countries.find((x) => x.id == dto.countryId);
    if (!country) throw new Error("Country not found.");

    const { title, summary } = buildCreateLeagueText(
      dto.name,
      dto.abbreviation,
      dto.teamCount,
      Object.keys(dto.relatedGender)[0],
      dto.governingBody,
      formatUnixDateToSmallReadable(Number(dto.formed)),
      country.name,
    );

    const encoded = IDL.encode([CreateLeagueDTO_Idl], [dto]);

    return await createProposal({
      identity: userIdentity,
      functionId: 55000n,
      payload: new Uint8Array(encoded),
      title,
      summary,
    });
  }

  async function updateLeague(dto: UpdateLeagueDTO): Promise<any> {
    let userIdentity: OptionIdentity;
    authStore.subscribe((auth) => (userIdentity = auth.identity));
    if (!userIdentity) return;

    let countries = await countryStore.getCountries();
    let country = countries.find((x) => x.id == dto.countryId);
    if (!country) throw new Error("Country not found.");

    const { title, summary } = buildUpdateLeagueText(
      dto.name,
      dto.abbreviation,
      dto.teamCount,
      Object.keys(dto.relatedGender)[0],
      dto.governingBody,
      formatUnixDateToSmallReadable(Number(dto.formed)),
      country.name,
    );

    const encoded = IDL.encode([CreateLeagueDTO_Idl], [dto]);

    return await createProposal({
      identity: userIdentity,
      functionId: 56000n,
      payload: new Uint8Array(encoded),
      title,
      summary,
    });
  }

  async function createPlayer(dto: CreatePlayerDTO): Promise<any> {
    let userIdentity: OptionIdentity;
    authStore.subscribe((auth) => (userIdentity = auth.identity));
    if (!userIdentity) return;

    let leagues = await leagueStore.getLeagues();

    let league = leagues.find((x) => x.id == dto.leagueId);
    if (!league) throw new Error("Player league not found.");

    let leagueClubs = await clubStore.getClubs(dto.leagueId);
    let playerClub = leagueClubs.find((x) => x.id == dto.clubId);
    if (!playerClub) throw new Error("Player club not found.");

    let countries = await countryStore.getCountries();
    let country = countries.find((x) => x.id == dto.nationality);
    if (!country) throw new Error("Country not found.");

    const { title, summary } = buildCreatePlayerText(
      `${dto.firstName} ${dto.lastName}`,
      Object.keys(dto.position)[0],
      playerClub.name,
      league.name,
      (dto.valueQuarterMillions / 4).toFixed(2),
      formatUnixDateToSmallReadable(Number(dto.dateOfBirth)),
      country.name,
    );

    const encoded = IDL.encode([CreatePlayerDTO_Idl], [dto]);

    return await createProposal({
      identity: userIdentity,
      functionId: 58000n,
      payload: new Uint8Array(encoded),
      title,
      summary,
    });
  }

  async function updatePlayer(dto: UpdatePlayerDTO): Promise<any> {
    let userIdentity: OptionIdentity;
    authStore.subscribe((auth) => (userIdentity = auth.identity));
    if (!userIdentity) return;

    let leagues = await leagueStore.getLeagues();

    let league = leagues.find((x) => x.id == dto.leagueId);
    if (!league) throw new Error("Player league not found.");

    let leagueClubs = await clubStore.getClubs(dto.leagueId);
    let players = await playerStore.getPlayers(dto.leagueId);
    let player = players.find((x) => x.id == dto.playerId);
    if (!player) throw new Error("Player not found.");

    let playerClub = leagueClubs.find((x) => x.id == player.clubId);
    if (!playerClub) throw new Error("Player club not found.");

    let countries = await countryStore.getCountries();
    let country = countries.find((x) => x.id == dto.nationality);
    if (!country) throw new Error("Country not found.");

    const { title, summary } = buildUpdatePlayerText(
      `${dto.firstName} ${dto.lastName}`,
      Object.keys(dto.position)[0],
      playerClub.name,
      league.name,
      formatUnixDateToSmallReadable(Number(dto.dateOfBirth)),
      country.name,
    );

    const encoded = IDL.encode([UpdatePlayerDTO_Idl], [dto]);

    return await createProposal({
      identity: userIdentity,
      functionId: 60000n,
      payload: new Uint8Array(encoded),
      title,
      summary,
    });
  }

  async function setPlayerInjury(dto: SetPlayerInjuryDTO): Promise<any> {}

  async function retirePlayer(dto: RetirePlayerDTO): Promise<any> {}

  async function unretirePlayer(dto: UnretirePlayerDTO): Promise<any> {}

  async function recallPlayer(dto: RecallPlayerDTO): Promise<any> {}

  async function createClub(dto: CreateClubDTO): Promise<any> {
    let userIdentity: OptionIdentity;
    authStore.subscribe((auth) => (userIdentity = auth.identity));
    if (!userIdentity) return;

    let leagues = await leagueStore.getLeagues();

    let league = leagues.find((x) => x.id == dto.leagueId);
    if (!league) throw new Error("Player league not found.");

    const { title, summary } = buildCreateClubText(
      dto.name,
      league.name,
      dto.friendlyName,
      dto.primaryColourHex,
      dto.secondaryColourHex,
      dto.thirdColourHex,
      dto.abbreviatedName,
      Object.keys(dto.shirtType)[0],
    );

    const encoded = IDL.encode([CreateClubDTO_Idl], [dto]);

    return await createProposal({
      identity: userIdentity,
      functionId: 59000n,
      payload: new Uint8Array(encoded),
      title,
      summary,
    });
  }

  async function updateClub(dto: UpdateClubDTO): Promise<any> {}

  async function promoteClub(dto: PromoteClubDTO): Promise<any> {}

  async function addInitialFixtures(dto: AddInitialFixturesDTO): Promise<any> {}

  async function moveFixture(dto: MoveFixtureDTO): Promise<any> {}

  async function postponeFixture(dto: PostponeFixtureDTO): Promise<any> {}

  async function rescheduleFixture(dto: RescheduleFixtureDTO): Promise<any> {
    let userIdentity: OptionIdentity;
    authStore.subscribe((auth) => (userIdentity = auth.identity));
    if (!userIdentity) return;

    const leagueFixtures = await fixtureStore.getPostponedFixtures(
      dto.leagueId,
    );
    let fixture = leagueFixtures.find((x) => x.id == dto.fixtureId);
    if (!fixture) throw new Error("Fixture not found.");

    const clubs = await clubStore.getClubs(dto.leagueId);
    const homeClub = clubs.find((c) => c.id === fixture.homeClubId);
    const awayClub = clubs.find((c) => c.id === fixture.awayClubId);
    if (!homeClub || !awayClub) throw new Error("Missing home/away club.");

    const { title, summary } = buildRescheduleFixtureText(
      `${homeClub.name} v ${awayClub.name}`,
      dto.updatedFixtureGameweek,
      `${formatUnixDateToSmallReadable(Number(dto.updatedFixtureDate))} ${formatUnixTimeToTime(Number(dto.updatedFixtureDate))}`,
    );

    const encoded = IDL.encode([RescheduleFixtureDTO_Idl], [dto]);

    return await createProposal({
      identity: userIdentity,
      functionId: 57000n,
      payload: new Uint8Array(encoded),
      title,
      summary,
    });
  }

  return {
    revaluePlayerUp,
    revaluePlayerDown,
    loanPlayer,
    transferPlayer,
    createPlayer,
    updatePlayer,
    setPlayerInjury,
    retirePlayer,
    unretirePlayer,
    recallPlayer,
    createClub,
    updateClub,
    promoteClub,
    addInitialFixtures,
    moveFixture,
    postponeFixture,
    submitFixtureData,
    createLeague,
    updateLeague,
    rescheduleFixture,
  };
}

export const governanceStore = createGovernanceStore();
