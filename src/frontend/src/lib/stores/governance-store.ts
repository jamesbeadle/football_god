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
  RevaluePlayerUp,
  RevaluePlayerDown,
  LoanPlayer,
  TransferPlayer,
  RecallPlayer,
  CreatePlayer,
  UpdatePlayer,
  SetPlayerInjury,
  RetirePlayer,
  UnretirePlayer,
  PromoteClub,
  UpdateClub,
  CreateClub,
  SubmitFixtureData,
  AddInitialFixtures,
  MoveFixture,
  PostponeFixture,
  CreateLeague,
  UpdateLeague,
  RescheduleFixture,
  SetFreeAgent,
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
  buildMoveFixtureText,
  buildPostponeFixtureText,
  buildPromoteClubText,
  buildRecallPlayerText,
  buildRescheduleFixtureText,
  buildRetirePlayerText,
  buildRevaluePlayerDownText,
  buildRevaluePlayerUpText,
  buildSetFreeAgentText,
  buildSetPlayerInjuryText,
  buildSubmitFixtureDataText,
  buildTransferPlayerText,
  buildUnretirePlayerText,
  buildUpdateClubText,
  buildUpdateLeagueText,
  buildUpdatePlayerText,
} from "$lib/utils/proposal.utils";
import {
  CreateClubDTO_Idl,
  CreateLeagueDTO_Idl,
  CreatePlayerDTO_Idl,
  LoanPlayerDTO_Idl,
  MoveFixtureDTO_Idl,
  RescheduleFixtureDTO_Idl,
  RetirePlayerDTO_Idl,
  RevaluePlayerDownDTO_Idl,
  RevaluePlayerUpDTO_Idl,
  SetPlayerInjuryDTO_Idl,
  SubmitFixtureDataDTO_Idl,
  TransferPlayerDTO_Idl,
  UpdatePlayerDTO_Idl,
  UpdateLeagueDTO_Idl,
} from "$lib/types/idl-types";
import {
  convertDateToReadable,
  formatUnixDateToReadableNumber,
  formatUnixDateToSmallReadableNumber,
  formatUnixTimeToTimeNumber,
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
  async function revaluePlayerUp(dto: RevaluePlayerUp): Promise<any> {
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

  async function revaluePlayerDown(dto: RevaluePlayerDown): Promise<any> {
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

  async function loanPlayer(dto: LoanPlayer): Promise<any> {
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

    const newValue = (dto.newValueQuarterMillions / 4).toFixed(2);

    const { title, summary } = buildLoanPlayerText(
      `${player.firstName} ${player.lastName}`,
      currentClub.friendlyName,
      newClub.friendlyName,
      formatUnixDateToSmallReadableNumber(Number(dto.loanEndDate)),
      newValue,
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

  async function transferPlayer(dto: TransferPlayer): Promise<any> {
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

  async function submitFixtureData(dto: SubmitFixtureData): Promise<any> {
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
    const kickOff = formatUnixDateToReadableNumber(Number(fixture.kickOff));

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

  async function createLeague(dto: CreateLeague): Promise<any> {
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
      formatUnixDateToSmallReadableNumber(Number(dto.formed)),
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

  async function updateLeague(dto: UpdateLeague): Promise<any> {
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
      formatUnixDateToSmallReadableNumber(Number(dto.formed)),
      country.name,
    );

    const encoded = IDL.encode([UpdateLeagueDTO_Idl], [dto]);

    return await createProposal({
      identity: userIdentity,
      functionId: 56000n,
      payload: new Uint8Array(encoded),
      title,
      summary,
    });
  }

  async function createPlayer(dto: CreatePlayer): Promise<any> {
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
      formatUnixDateToSmallReadableNumber(Number(dto.dateOfBirth)),
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

  async function updatePlayer(dto: UpdatePlayer): Promise<any> {
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
      formatUnixDateToSmallReadableNumber(Number(dto.dateOfBirth)),
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

  async function setPlayerInjury(dto: SetPlayerInjury): Promise<any> {
    let userIdentity: OptionIdentity;
    authStore.subscribe((auth) => (userIdentity = auth.identity));
    if (!userIdentity) return;

    let leagues = await leagueStore.getLeagues();

    let league = leagues.find((x) => x.id == dto.leagueId);
    if (!league) throw new Error("Player league not found.");

    const allPlayers = await playerStore.getPlayers(dto.leagueId);
    const player = allPlayers.find((p) => p.id === dto.playerId);
    if (!player) throw new Error("Player not found.");

    const { title, summary } = buildSetPlayerInjuryText(
      `${player.firstName} ${player.lastName}`,
      dto.description,
      convertDateToReadable(Number(dto.expectedEndDate)),
    );

    const encoded = IDL.encode([SetPlayerInjuryDTO_Idl], [dto]);

    return await createProposal({
      identity: userIdentity,
      functionId: 66000n,
      payload: new Uint8Array(encoded),
      title,
      summary,
    });
  }

  async function retirePlayer(dto: RetirePlayer): Promise<any> {
    let userIdentity: OptionIdentity;
    authStore.subscribe((auth) => (userIdentity = auth.identity));
    if (!userIdentity) return;

    let leagues = await leagueStore.getLeagues();

    let league = leagues.find((x) => x.id == dto.leagueId);
    if (!league) throw new Error("Player league not found.");

    const allPlayers = await playerStore.getPlayers(dto.leagueId);
    const player = allPlayers.find((p) => p.id === dto.playerId);
    if (!player) throw new Error("Player not found.");
    const clubs = await clubStore.getClubs(dto.leagueId);
    const currentClub = clubs.find((c) => c.id === player.clubId);
    if (!currentClub) throw new Error("Current club not found.");

    const { title, summary } = buildRetirePlayerText(
      `${player.firstName} ${player.lastName}`,
      Object.keys(player.position)[0],
      currentClub.friendlyName,
      convertDateToReadable(Number(dto.retirementDate)),
    );

    const encoded = IDL.encode([RetirePlayerDTO_Idl], [dto]);

    return await createProposal({
      identity: userIdentity,
      functionId: 67000n,
      payload: new Uint8Array(encoded),
      title,
      summary,
    });
  }

  async function unretirePlayer(dto: UnretirePlayer): Promise<any> {
    let userIdentity: OptionIdentity;
    authStore.subscribe((auth) => (userIdentity = auth.identity));
    if (!userIdentity) return;

    let leagues = await leagueStore.getLeagues();

    let league = leagues.find((x) => x.id == dto.leagueId);
    if (!league) throw new Error("Player league not found.");

    const allPlayers = await playerStore.getPlayers(dto.leagueId);
    const player = allPlayers.find((p) => p.id === dto.playerId);
    if (!player) throw new Error("Player not found.");
    const clubs = await clubStore.getClubs(dto.leagueId);
    const currentClub = clubs.find((c) => c.id === player.clubId);
    if (!currentClub) throw new Error("Current club not found.");

    const { title, summary } = buildUnretirePlayerText(
      `${player.firstName} ${player.lastName}`,
      Object.keys(player.position)[0],
      currentClub.friendlyName,
    );

    const encoded = IDL.encode([RetirePlayerDTO_Idl], [dto]);

    return await createProposal({
      identity: userIdentity,
      functionId: 68000n,
      payload: new Uint8Array(encoded),
      title,
      summary,
    });
  }

  async function recallPlayer(dto: RecallPlayer): Promise<any> {
    let userIdentity: OptionIdentity;
    authStore.subscribe((auth) => (userIdentity = auth.identity));
    if (!userIdentity) return;

    const allPlayers = await playerStore.getPlayers(dto.leagueId);
    const player = allPlayers.find((p) => p.id === dto.playerId);
    if (!player) throw new Error("Player not found.");

    let leagues = await leagueStore.getLeagues();

    let recallLeague = leagues.find((x) => x.id == player.leagueId);
    let parentLeague = leagues.find((x) => x.id == player.parentLeagueId);
    if (!recallLeague) throw new Error("Recall league not found.");
    if (!parentLeague) throw new Error("Parent league not found.");

    const recallClubs = await clubStore.getClubs(player.leagueId);
    const parentLeagueClubs = await clubStore.getClubs(player.parentLeagueId);
    const recallClub = recallClubs.find((c) => c.id === player.clubId);
    const parentClub = parentLeagueClubs.find(
      (c) => c.id === player.parentClubId,
    );
    if (!recallClub) throw new Error("Recall club not found.");
    if (!parentClub) throw new Error("Parent club not found.");

    const { title, summary } = buildRecallPlayerText(
      `${player.firstName} ${player.lastName}`,
      recallClub.friendlyName,
      parentClub.friendlyName,
      recallLeague.name,
      parentLeague.name,
    );

    const encoded = IDL.encode([RetirePlayerDTO_Idl], [dto]);

    return await createProposal({
      identity: userIdentity,
      functionId: 69000n,
      payload: new Uint8Array(encoded),
      title,
      summary,
    });
  }

  async function createClub(dto: CreateClub): Promise<any> {
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

  async function updateClub(dto: UpdateClub): Promise<any> {
    let userIdentity: OptionIdentity;
    authStore.subscribe((auth) => (userIdentity = auth.identity));
    if (!userIdentity) return;

    let leagues = await leagueStore.getLeagues();

    let league = leagues.find((x) => x.id == dto.leagueId);
    if (!league) throw new Error("Player league not found.");

    const { title, summary } = buildUpdateClubText(
      dto.name,
      league.name,
      dto.friendlyName,
      dto.primaryColourHex,
      dto.secondaryColourHex,
      dto.thirdColourHex,
      dto.abbreviatedName,
      Object.keys(dto.shirtType)[0],
    );

    const encoded = IDL.encode([SetPlayerInjuryDTO_Idl], [dto]);

    return await createProposal({
      identity: userIdentity,
      functionId: 62000n,
      payload: new Uint8Array(encoded),
      title,
      summary,
    });
  }

  async function promoteClub(dto: PromoteClub): Promise<any> {
    let userIdentity: OptionIdentity;
    authStore.subscribe((auth) => (userIdentity = auth.identity));
    if (!userIdentity) return;

    let leagues = await leagueStore.getLeagues();

    let fromLeague = leagues.find((x) => x.id == dto.leagueId);
    let toLeague = leagues.find((x) => x.id == dto.toLeagueId);
    if (!fromLeague) throw new Error("Player 'from' league not found.");
    if (!toLeague) throw new Error("Player 'to' league not found.");

    const clubs = await clubStore.getClubs(dto.leagueId);
    const currentClub = clubs.find((c) => c.id === dto.clubId);
    if (!currentClub) throw new Error("Current club not found.");

    const { title, summary } = buildPromoteClubText(
      currentClub.friendlyName,
      fromLeague.name,
      toLeague.name,
    );

    const encoded = IDL.encode([SetPlayerInjuryDTO_Idl], [dto]);

    return await createProposal({
      identity: userIdentity,
      functionId: 63000n,
      payload: new Uint8Array(encoded),
      title,
      summary,
    });
  }

  async function addInitialFixtures(dto: AddInitialFixtures): Promise<any> {
    //TODO
  }

  async function setFreeAgent(dto: SetFreeAgent): Promise<any> {
    let userIdentity: OptionIdentity;
    authStore.subscribe((auth) => (userIdentity = auth.identity));
    if (!userIdentity) return;

    let leagues = await leagueStore.getLeagues();

    let league = leagues.find((x) => x.id == dto.leagueId);
    if (!league) throw new Error("Player league not found.");

    const allPlayers = await playerStore.getPlayers(dto.leagueId);
    const player = allPlayers.find((p) => p.id === dto.playerId);
    if (!player) throw new Error("Player not found.");

    const newValue = (dto.newValueQuarterMillions / 4).toFixed(2);

    const { title, summary } = buildSetFreeAgentText(
      `${player.firstName} ${player.lastName}`,
      newValue,
    );

    const encoded = IDL.encode([SetPlayerInjuryDTO_Idl], [dto]);

    return await createProposal({
      identity: userIdentity,
      functionId: 64000n,
      payload: new Uint8Array(encoded),
      title,
      summary,
    });
  }

  async function moveFixture(dto: MoveFixture): Promise<any> {
    console.log("moving fixture");
    console.log();
    let userIdentity: OptionIdentity;
    authStore.subscribe((auth) => (userIdentity = auth.identity));
    if (!userIdentity) return;

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

    const { title, summary } = buildMoveFixtureText(
      `${homeClub.name} v ${awayClub.name}`,
      fixture.gameweek,
      dto.updatedFixtureGameweek,
      `${formatUnixDateToSmallReadableNumber(Number(dto.updatedFixtureDate))} ${formatUnixTimeToTimeNumber(Number(dto.updatedFixtureDate))}`,
    );

    const encoded = IDL.encode([MoveFixtureDTO_Idl], [dto]);

    return await createProposal({
      identity: userIdentity,
      functionId: 61000n,
      payload: new Uint8Array(encoded),
      title,
      summary,
    });
  }

  async function postponeFixture(dto: PostponeFixture): Promise<any> {
    let userIdentity: OptionIdentity;
    authStore.subscribe((auth) => (userIdentity = auth.identity));
    if (!userIdentity) return;

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

    const { title, summary } = buildPostponeFixtureText(
      `${homeClub.name} v ${awayClub.name}`,
      fixture.gameweek,
    );

    const encoded = IDL.encode([SetPlayerInjuryDTO_Idl], [dto]);

    return await createProposal({
      identity: userIdentity,
      functionId: 65000n,
      payload: new Uint8Array(encoded),
      title,
      summary,
    });
  }

  async function rescheduleFixture(dto: RescheduleFixture): Promise<any> {
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
      `${formatUnixDateToSmallReadableNumber(Number(dto.updatedFixtureDate))} ${formatUnixTimeToTimeNumber(Number(dto.updatedFixtureDate))}`,
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
    setFreeAgent,
  };
}

export const governanceStore = createGovernanceStore();
