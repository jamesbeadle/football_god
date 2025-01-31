import { playerStore } from "$lib/stores/player-store";
import type { HttpAgent } from "@dfinity/agent";
import { SnsGovernanceCanister } from "@dfinity/sns";
import type {
  Command,
  ExecuteGenericNervousSystemFunction,
} from "@dfinity/sns/dist/candid/sns_governance";
import { fixtureStore } from "./fixture-store";
import { ActorFactory } from "$lib/utils/ActorFactory";
import { authStore } from "./auth-store";
import type {
  AddInitialFixturesDTO,
  ClubId,
  CreateClubDTO,
  CreatePlayerDTO,
  FixtureDTO,
  FixtureId,
  GameweekNumber,
  LeagueId,
  LoanPlayerDTO,
  MoveFixtureDTO,
  PlayerEventData,
  PlayerId,
  PlayerPosition,
  PostponeFixtureDTO,
  PromoteClubDTO,
  RecallPlayerDTO,
  RetirePlayerDTO,
  RevaluePlayerUpDTO,
  SeasonId,
  SetPlayerInjuryDTO,
  ShirtType,
  SubmitFixtureDataDTO,
  TransferPlayerDTO,
  UnretirePlayerDTO,
  UpdateClubDTO,
  UpdatePlayerDTO,
} from "../../../../declarations/data_canister/data_canister.did";
import { clubStore } from "./club-store";
import { leagueStore } from "./league-store";
import { Principal } from "@dfinity/principal";
import type { OptionIdentity } from "$lib/types/identity";
import { IDL } from "@dfinity/candid";
import { createAgent } from "@dfinity/utils";

const RevaluePlayerUpDTO_Idl = IDL.Record({
  leagueId: IDL.Nat16,
  playerId: IDL.Nat16,
});

const RevaluePlayerDownDTO_Idl = IDL.Record({
  leagueId: IDL.Nat16,
  playerId: IDL.Nat16,
});

const LoanPlayerDTO_Idl = IDL.Record({
  leagueId: IDL.Nat16,
  playerId: IDL.Nat16,
  loanLeagueId: IDL.Nat16,
  loanClubId: IDL.Nat16,
  loanEndDate: IDL.Int,
});

function createGovernanceStore() {
  async function revaluePlayerUp(dto: RevaluePlayerUpDTO): Promise<any> {
    let identity: OptionIdentity;

    authStore.subscribe(async (auth) => {
      identity = auth.identity;
    });

    if (!identity) {
      return 0n;
    }

    const agent = await createAgent({
      identity: identity,
      host: import.meta.env.VITE_AUTH_PROVIDER_URL,
      fetchRootKey: process.env.DFX_NETWORK === "local",
    });

    try {
      const {
        manageNeuron: governanceManageNeuron,
        listNeurons: governanceListNeurons,
      } = SnsGovernanceCanister.create({
        canisterId: Principal.fromText(
          process.env.SNS_GOVERNANCE_CANISTER_ID ?? "",
        ),
        agent: agent,
      });

      let identity: OptionIdentity;

      authStore.subscribe(async (auth) => {
        identity = auth.identity;
      });

      if (!identity) {
        return;
      }

      let principalId = identity.getPrincipal();

      const userNeurons = await governanceListNeurons({
        principal: principalId,
        limit: 10,
        beforeNeuronId: { id: [] },
      });
      if (userNeurons.length > 0) {
        const encoded = IDL.encode([RevaluePlayerUpDTO_Idl], [dto]);

        const fn: ExecuteGenericNervousSystemFunction = {
          function_id: 50000n,
          payload: new Uint8Array(encoded),
        };

        let allPlayers = await playerStore.getPlayers(dto.leagueId);

        let player = allPlayers.find((x) => x.id == dto.playerId);
        if (player) {
          const command: Command = {
            MakeProposal: {
              title: `Revalue ${player.firstName} ${player.lastName} value to £${(
                (player.valueQuarterMillions + 1) /
                4
              )
                .toFixed(2)
                .toLocaleString()}m.`,
              url: "openfpl.xyz/governance",
              summary: `Revalue ${player.lastName} value up from £${(
                player.valueQuarterMillions / 4
              )
                .toFixed(2)
                .toLocaleString()}m -> £${(
                (player.valueQuarterMillions + 1) /
                4
              )
                .toFixed(2)
                .toLocaleString()}m.`,
              action: [{ ExecuteGenericNervousSystemFunction: fn }],
            },
          };

          const neuronId = userNeurons[0].id[0];
          if (!neuronId) {
            return;
          }

          await governanceManageNeuron({
            subaccount: neuronId.id,
            command: [command],
          });
        }
      }
    } catch (error) {
      console.error("Error revaluing player up:", error);
      throw error;
    }
  }

  async function revaluePlayerDown(dto: RevaluePlayerUpDTO): Promise<any> {
    try {
      const {
        manageNeuron: governanceManageNeuron,
        listNeurons: governanceListNeurons,
      } = SnsGovernanceCanister.create({
        canisterId: Principal.fromText(
          process.env.SNS_GOVERNANCE_CANISTER_ID ?? "",
        ),
      });

      let identity: OptionIdentity;

      authStore.subscribe(async (auth) => {
        identity = auth.identity;
      });

      if (!identity) {
        return;
      }

      let principalId = identity.getPrincipal();

      const userNeurons = await governanceListNeurons({
        principal: principalId,
        limit: 10,
        beforeNeuronId: { id: [] },
      });
      if (userNeurons.length > 0) {
        const encoded = IDL.encode([RevaluePlayerDownDTO_Idl], [dto]);

        const fn: ExecuteGenericNervousSystemFunction = {
          function_id: 51000n,
          payload: new Uint8Array(encoded),
        };

        let allPlayers = await playerStore.getPlayers(dto.leagueId);
        let player = allPlayers.find((x) => x.id == dto.playerId);
        if (player) {
          const command: Command = {
            MakeProposal: {
              title: `Revalue ${player.lastName} value down.`,
              url: "openfpl.xyz/governance",
              summary: `Revalue ${player.lastName} value down from £${(
                player.valueQuarterMillions / 4
              )
                .toFixed(2)
                .toLocaleString()}m -> £${(
                (player.valueQuarterMillions - 1) /
                4
              )
                .toFixed(2)
                .toLocaleString()}m).`,
              action: [{ ExecuteGenericNervousSystemFunction: fn }],
            },
          };

          const neuronId = userNeurons[0].id[0];
          if (!neuronId) {
            return;
          }

          await governanceManageNeuron({
            subaccount: neuronId.id,
            command: [command],
          });
        }
      }
    } catch (error) {
      console.error("Error revaluing player down:", error);
      throw error;
    }
  }

  async function loanPlayer(
    leagueId: LeagueId,
    playerId: PlayerId,
    loanLeagueId: LeagueId,
    loanClubId: ClubId,
    loanEndDate: string,
  ): Promise<any> {
    try {
      const dateObject = new Date(loanEndDate);
      const timestampMilliseconds = dateObject.getTime();
      let nanoseconds = BigInt(timestampMilliseconds) * BigInt(1000000);

      let dto: LoanPlayerDTO = {
        leagueId,
        playerId,
        loanLeagueId,
        loanClubId,
        loanEndDate: nanoseconds,
      };

      const identityActor: any = await ActorFactory.createBackendIdentityActor(
        authStore,
        process.env.SNS_GOVERNANCE_CANISTER_ID ?? "",
      );

      const governanceAgent: HttpAgent = ActorFactory.getAgent(
        process.env.SNS_GOVERNANCE_CANISTER_ID,
        identityActor,
        null,
      );

      const {
        manageNeuron: governanceManageNeuron,
        listNeurons: governanceListNeurons,
      } = SnsGovernanceCanister.create({
        agent: governanceAgent,
        canisterId: identityActor,
      });

      const userNeurons = await governanceListNeurons({
        principal: identityActor.principal,
        limit: 10,
        beforeNeuronId: { id: [] },
      });
      if (userNeurons.length > 0) {
        const jsonString = JSON.stringify(dto);

        const encoder = new TextEncoder();
        const payload = encoder.encode(jsonString);

        const fn: ExecuteGenericNervousSystemFunction = {
          function_id: 9000n,
          payload: payload,
        };

        let allPlayers = await playerStore.getPlayers(leagueId);
        let clubs = await clubStore.getClubs(leagueId);
        let player = allPlayers.find((x) => x.id == playerId);
        if (player) {
          let club = clubs.find((x) => x.id == player?.clubId);
          if (!club) {
            return;
          }

          const command: Command = {
            MakeProposal: {
              title: `Loan ${player.firstName} to ${club?.friendlyName}.`,
              url: "openfpl.xyz/governance",
              summary: `Loan ${player.firstName} to ${club?.friendlyName}.`,
              action: [{ ExecuteGenericNervousSystemFunction: fn }],
            },
          };

          const neuronId = userNeurons[0].id[0];
          if (!neuronId) {
            return;
          }

          await governanceManageNeuron({
            subaccount: neuronId.id,
            command: [command],
          });
        }
      }
    } catch (error) {
      console.error("Error loaning player:", error);
      throw error;
    }
  }

  async function submitFixtureData(
    leagueId: LeagueId,
    seasonId: SeasonId,
    gameweek: GameweekNumber,
    fixtureId: FixtureId,
    playerEventData: PlayerEventData[],
  ): Promise<any> {
    try {
      let dto: SubmitFixtureDataDTO = {
        leagueId,
        seasonId,
        gameweek,
        fixtureId,
        playerEventData,
      };

      const identityActor: any = await ActorFactory.createBackendIdentityActor(
        authStore,
        process.env.SNS_GOVERNANCE_CANISTER_ID ?? "",
      );

      const governanceAgent: HttpAgent = ActorFactory.getAgent(
        process.env.SNS_GOVERNANCE_CANISTER_ID,
        identityActor,
        null,
      );

      const {
        manageNeuron: governanceManageNeuron,
        listNeurons: governanceListNeurons,
      } = SnsGovernanceCanister.create({
        agent: governanceAgent,
        canisterId: identityActor,
      });

      const userNeurons = await governanceListNeurons({
        principal: identityActor.principal,
        limit: 10,
        beforeNeuronId: { id: [] },
      });
      if (userNeurons.length > 0) {
        const jsonString = JSON.stringify(dto);

        const encoder = new TextEncoder();
        const payload = encoder.encode(jsonString);

        const fn: ExecuteGenericNervousSystemFunction = {
          function_id: 3000n,
          payload: payload,
        };

        let allFixtures = await fixtureStore.getFixtures(leagueId);
        let clubs = await clubStore.getClubs(leagueId);
        let fixture = allFixtures.find((x) => x.id == fixtureId);
        if (fixture) {
          let homeClub = clubs.find((x) => x.id == fixture?.homeClubId);
          let awayClub = clubs.find((x) => x.id == fixture?.awayClubId);
          if (!homeClub || !awayClub) {
            return;
          }

          const command: Command = {
            MakeProposal: {
              title: `Fixture Data for ${homeClub.friendlyName} v ${awayClub?.friendlyName}.`,
              url: "openfpl.xyz/governance",
              summary: `Fixture Data for ${homeClub.friendlyName} v ${awayClub?.friendlyName}.`,
              action: [{ ExecuteGenericNervousSystemFunction: fn }],
            },
          };

          const neuronId = userNeurons[0].id[0];
          if (!neuronId) {
            return;
          }

          await governanceManageNeuron({
            subaccount: neuronId.id,
            command: [command],
          });
        }
      }
    } catch (error) {
      console.error("Error submitting fixture data:", error);
      throw error;
    }
  }

  async function addInitialFixtures(
    leagueId: LeagueId,
    seasonFixtures: FixtureDTO[],
  ): Promise<any> {
    try {
      let seasonName = "";

      let dto: AddInitialFixturesDTO = {
        leagueId,
        seasonFixtures,
      };

      const identityActor: any = await ActorFactory.createBackendIdentityActor(
        authStore,
        process.env.SNS_GOVERNANCE_CANISTER_ID ?? "",
      );

      const governanceAgent: HttpAgent = ActorFactory.getAgent(
        process.env.SNS_GOVERNANCE_CANISTER_ID,
        identityActor,
        null,
      );

      const {
        manageNeuron: governanceManageNeuron,
        listNeurons: governanceListNeurons,
      } = SnsGovernanceCanister.create({
        agent: governanceAgent,
        canisterId: identityActor,
      });

      const userNeurons = await governanceListNeurons({
        principal: identityActor.principal,
        limit: 10,
        beforeNeuronId: { id: [] },
      });
      if (userNeurons.length > 0) {
        const jsonString = JSON.stringify(dto);

        const encoder = new TextEncoder();
        const payload = encoder.encode(jsonString);

        const fn: ExecuteGenericNervousSystemFunction = {
          function_id: 4000n,
          payload: payload,
        };

        const command: Command = {
          MakeProposal: {
            title: `Add initial fixtures for season ${seasonName}.`,
            url: "openfpl.xyz/governance",
            summary: `Add initial fixtures for season ${seasonName}.`,
            action: [{ ExecuteGenericNervousSystemFunction: fn }],
          },
        };

        const neuronId = userNeurons[0].id[0];
        if (!neuronId) {
          return;
        }

        await governanceManageNeuron({
          subaccount: neuronId.id,
          command: [command],
        });
      }
    } catch (error) {
      console.error("Error adding initial fixtures:", error);
      throw error;
    }
  }

  async function moveFixture(
    leagueId: LeagueId,
    seasonId: SeasonId,
    fixtureId: FixtureId,
    updatedFixtureGameweek: number,
    updatedFixtureDate: string,
  ): Promise<any> {
    try {
      const dateObject = new Date(updatedFixtureDate);
      const timestampMilliseconds = dateObject.getTime();
      let nanoseconds = BigInt(timestampMilliseconds) * BigInt(1000000);

      let dto: MoveFixtureDTO = {
        leagueId,
        seasonId,
        fixtureId,
        updatedFixtureGameweek,
        updatedFixtureDate: nanoseconds,
      };

      const identityActor: any = await ActorFactory.createBackendIdentityActor(
        authStore,
        process.env.SNS_GOVERNANCE_CANISTER_ID ?? "",
      );

      const governanceAgent: HttpAgent = ActorFactory.getAgent(
        process.env.SNS_GOVERNANCE_CANISTER_ID,
        identityActor,
        null,
      );

      const {
        manageNeuron: governanceManageNeuron,
        listNeurons: governanceListNeurons,
      } = SnsGovernanceCanister.create({
        agent: governanceAgent,
        canisterId: identityActor,
      });

      const userNeurons = await governanceListNeurons({
        principal: identityActor.principal,
        limit: 10,
        beforeNeuronId: { id: [] },
      });
      if (userNeurons.length > 0) {
        const jsonString = JSON.stringify(dto);

        const encoder = new TextEncoder();
        const payload = encoder.encode(jsonString);

        const fn: ExecuteGenericNervousSystemFunction = {
          function_id: 5000n,
          payload: payload,
        };

        let allFixtures = await fixtureStore.getFixtures(leagueId);
        let clubs = await clubStore.getClubs(leagueId);
        let fixture = allFixtures.find((x) => x.id == fixtureId);
        if (fixture) {
          let homeClub = clubs.find((x) => x.id == fixture?.homeClubId);
          let awayClub = clubs.find((x) => x.id == fixture?.awayClubId);
          if (!homeClub || !awayClub) {
            return;
          }

          const command: Command = {
            MakeProposal: {
              title: `Move fixture ${homeClub.friendlyName} v ${awayClub?.friendlyName}.`,
              url: "openfpl.xyz/governance",
              summary: `Fixture Data for ${homeClub.friendlyName} v ${awayClub?.friendlyName}.`,
              action: [{ ExecuteGenericNervousSystemFunction: fn }],
            },
          };

          const neuronId = userNeurons[0].id[0];
          if (!neuronId) {
            return;
          }

          await governanceManageNeuron({
            subaccount: neuronId.id,
            command: [command],
          });
        }
      }
    } catch (error) {
      console.error("Error moving fixture:", error);
      throw error;
    }
  }

  async function postponeFixture(
    leagueId: LeagueId,
    seasonId: SeasonId,
    fixtureId: FixtureId,
  ): Promise<any> {
    try {
      let dto: PostponeFixtureDTO = {
        leagueId,
        seasonId,
        fixtureId,
      };

      const identityActor: any = await ActorFactory.createBackendIdentityActor(
        authStore,
        process.env.SNS_GOVERNANCE_CANISTER_ID ?? "",
      );

      const governanceAgent: HttpAgent = ActorFactory.getAgent(
        process.env.SNS_GOVERNANCE_CANISTER_ID,
        identityActor,
        null,
      );

      const {
        manageNeuron: governanceManageNeuron,
        listNeurons: governanceListNeurons,
      } = SnsGovernanceCanister.create({
        agent: governanceAgent,
        canisterId: identityActor,
      });

      const userNeurons = await governanceListNeurons({
        principal: identityActor.principal,
        limit: 10,
        beforeNeuronId: { id: [] },
      });
      if (userNeurons.length > 0) {
        const jsonString = JSON.stringify(dto);

        const encoder = new TextEncoder();
        const payload = encoder.encode(jsonString);

        const fn: ExecuteGenericNervousSystemFunction = {
          function_id: 6000n,
          payload: payload,
        };

        let allFixtures = await fixtureStore.getFixtures(leagueId);
        let clubs = await clubStore.getClubs(leagueId);
        let fixture = allFixtures.find((x) => x.id == fixtureId);
        if (fixture) {
          let homeClub = clubs.find((x) => x.id == fixture?.homeClubId);
          let awayClub = clubs.find((x) => x.id == fixture?.awayClubId);
          if (!homeClub || !awayClub) {
            return;
          }

          const command: Command = {
            MakeProposal: {
              title: `Postpone fixture ${homeClub.friendlyName} v ${awayClub?.friendlyName}.`,
              url: "openfpl.xyz/governance",
              summary: `Fixture Data for ${homeClub.friendlyName} v ${awayClub?.friendlyName}.`,
              action: [{ ExecuteGenericNervousSystemFunction: fn }],
            },
          };

          const neuronId = userNeurons[0].id[0];
          if (!neuronId) {
            return;
          }

          await governanceManageNeuron({
            subaccount: neuronId.id,
            command: [command],
          });
        }
      }
    } catch (error) {
      console.error("Error postponing fixture:", error);
      throw error;
    }
  }

  async function rescheduleFixture(
    leagueId: LeagueId,
    seasonId: SeasonId,
    fixtureId: FixtureId,
    updatedFixtureGameweek: number,
    updatedFixtureDate: string,
  ): Promise<any> {
    try {
      const dateObject = new Date(updatedFixtureDate);
      const timestampMilliseconds = dateObject.getTime();
      let nanoseconds = BigInt(timestampMilliseconds) * BigInt(1000000);

      let dto: MoveFixtureDTO = {
        leagueId,
        seasonId,
        fixtureId,
        updatedFixtureGameweek,
        updatedFixtureDate: nanoseconds,
      };

      const identityActor: any = await ActorFactory.createBackendIdentityActor(
        authStore,
        process.env.SNS_GOVERNANCE_CANISTER_ID ?? "",
      );

      const governanceAgent: HttpAgent = ActorFactory.getAgent(
        process.env.SNS_GOVERNANCE_CANISTER_ID,
        identityActor,
        null,
      );

      const {
        manageNeuron: governanceManageNeuron,
        listNeurons: governanceListNeurons,
      } = SnsGovernanceCanister.create({
        agent: governanceAgent,
        canisterId: identityActor,
      });

      const userNeurons = await governanceListNeurons({
        principal: identityActor.principal,
        limit: 10,
        beforeNeuronId: { id: [] },
      });
      if (userNeurons.length > 0) {
        const jsonString = JSON.stringify(dto);

        const encoder = new TextEncoder();
        const payload = encoder.encode(jsonString);

        const fn: ExecuteGenericNervousSystemFunction = {
          function_id: 7000n,
          payload: payload,
        };

        let allFixtures = await fixtureStore.getFixtures(leagueId);
        let clubs = await clubStore.getClubs(leagueId);
        let fixture = allFixtures.find((x) => x.id == fixtureId);
        if (fixture) {
          let homeClub = clubs.find((x) => x.id == fixture?.homeClubId);
          let awayClub = clubs.find((x) => x.id == fixture?.awayClubId);
          if (!homeClub || !awayClub) {
            return;
          }

          const command: Command = {
            MakeProposal: {
              title: `Move fixture ${homeClub.friendlyName} v ${awayClub?.friendlyName}.`,
              url: "openfpl.xyz/governance",
              summary: `Fixture Data for ${homeClub.friendlyName} v ${awayClub?.friendlyName}.`,
              action: [{ ExecuteGenericNervousSystemFunction: fn }],
            },
          };

          const neuronId = userNeurons[0].id[0];
          if (!neuronId) {
            return;
          }

          await governanceManageNeuron({
            subaccount: neuronId.id,
            command: [command],
          });
        }
      }
    } catch (error) {
      console.error("Error rescheduling fixture:", error);
      throw error;
    }
  }

  async function transferPlayer(
    leagueId: LeagueId,
    clubId: ClubId,
    playerId: number,
    newShirtNumber: number,
    newLeagueId: LeagueId,
    newClubId: number,
  ): Promise<any> {
    try {
      let dto: TransferPlayerDTO = {
        leagueId,
        clubId,
        playerId,
        newShirtNumber,
        newLeagueId,
        newClubId,
      };

      const identityActor: any = await ActorFactory.createBackendIdentityActor(
        authStore,
        process.env.SNS_GOVERNANCE_CANISTER_ID ?? "",
      );

      const governanceAgent: HttpAgent = ActorFactory.getAgent(
        process.env.SNS_GOVERNANCE_CANISTER_ID,
        identityActor,
        null,
      );

      const {
        manageNeuron: governanceManageNeuron,
        listNeurons: governanceListNeurons,
      } = SnsGovernanceCanister.create({
        agent: governanceAgent,
        canisterId: identityActor,
      });

      const userNeurons = await governanceListNeurons({
        principal: identityActor.principal,
        limit: 10,
        beforeNeuronId: { id: [] },
      });
      if (userNeurons.length > 0) {
        const jsonString = JSON.stringify(dto);

        const encoder = new TextEncoder();
        const payload = encoder.encode(jsonString);

        const fn: ExecuteGenericNervousSystemFunction = {
          function_id: 8000n,
          payload: payload,
        };

        let allPlayers = await playerStore.getPlayers(leagueId);
        let clubs = await clubStore.getClubs(leagueId);
        let player = allPlayers.find((x) => x.id == playerId);
        if (player) {
          let currentClub = clubs.find((x) => x.id == player?.clubId);
          let newClub = clubs.find((x) => x.id == newClubId);
          if (!currentClub) {
            return;
          }

          let title = "";
          if (newClubId == 0) {
            title = `Transfer ${player.firstName} ${player.lastName} outside of Premier League.`;
          }

          if (newClub) {
            title = `Transfer ${player.firstName} ${player.lastName} to ${newClub.friendlyName}`;
          }

          const command: Command = {
            MakeProposal: {
              title: title,
              url: "openfpl.xyz/governance",
              summary: title,
              action: [{ ExecuteGenericNervousSystemFunction: fn }],
            },
          };

          const neuronId = userNeurons[0].id[0];
          if (!neuronId) {
            return;
          }

          await governanceManageNeuron({
            subaccount: neuronId.id,
            command: [command],
          });
        }
      }
    } catch (error) {
      console.error("Error transferring player:", error);
      throw error;
    }
  }

  async function recallPlayer(
    leagueId: LeagueId,
    playerId: PlayerId,
  ): Promise<any> {
    try {
      let dto: RecallPlayerDTO = {
        leagueId,
        playerId,
      };

      const identityActor: any = await ActorFactory.createBackendIdentityActor(
        authStore,
        process.env.SNS_GOVERNANCE_CANISTER_ID ?? "",
      );

      const governanceAgent: HttpAgent = ActorFactory.getAgent(
        process.env.SNS_GOVERNANCE_CANISTER_ID,
        identityActor,
        null,
      );

      const {
        manageNeuron: governanceManageNeuron,
        listNeurons: governanceListNeurons,
      } = SnsGovernanceCanister.create({
        agent: governanceAgent,
        canisterId: identityActor,
      });

      const userNeurons = await governanceListNeurons({
        principal: identityActor.principal,
        limit: 10,
        beforeNeuronId: { id: [] },
      });
      if (userNeurons.length > 0) {
        const jsonString = JSON.stringify(dto);

        const encoder = new TextEncoder();
        const payload = encoder.encode(jsonString);

        const fn: ExecuteGenericNervousSystemFunction = {
          function_id: 10000n,
          payload: payload,
        };

        let allPlayers = await playerStore.getPlayers(leagueId);
        let clubs = await clubStore.getClubs(leagueId);
        let player = allPlayers.find((x) => x.id == playerId);
        if (player) {
          let club = clubs.find((x) => x.id == player?.clubId);
          if (!club) {
            return;
          }

          const command: Command = {
            MakeProposal: {
              title: `Recall ${player.firstName} ${player?.lastName} loan.`,
              url: "openfpl.xyz/governance",
              summary: `Recall ${player.firstName} ${player?.lastName} loan.`,
              action: [{ ExecuteGenericNervousSystemFunction: fn }],
            },
          };

          const neuronId = userNeurons[0].id[0];
          if (!neuronId) {
            return;
          }

          await governanceManageNeuron({
            subaccount: neuronId.id,
            command: [command],
          });
        }
      }
    } catch (error) {
      console.error("Error recalling player loan:", error);
      throw error;
    }
  }

  async function createPlayer(
    leagueId: LeagueId,
    clubId: number,
    position: PlayerPosition,
    firstName: string,
    lastName: string,
    shirtNumber: number,
    valueQuarterMillions: number,
    dateOfBirth: string,
    nationality: number,
  ): Promise<any> {
    try {
      const dateObject = new Date(dateOfBirth);
      const timestampMilliseconds = dateObject.getTime();
      let nanoseconds = BigInt(timestampMilliseconds) * BigInt(1000000);

      let dto: CreatePlayerDTO = {
        leagueId,
        clubId,
        position,
        firstName,
        lastName,
        shirtNumber,
        valueQuarterMillions,
        dateOfBirth: nanoseconds,
        nationality,
      };

      const identityActor: any = await ActorFactory.createBackendIdentityActor(
        authStore,
        process.env.SNS_GOVERNANCE_CANISTER_ID ?? "",
      );

      const governanceAgent: HttpAgent = ActorFactory.getAgent(
        process.env.SNS_GOVERNANCE_CANISTER_ID,
        identityActor,
        null,
      );

      const {
        manageNeuron: governanceManageNeuron,
        listNeurons: governanceListNeurons,
      } = SnsGovernanceCanister.create({
        agent: governanceAgent,
        canisterId: identityActor,
      });

      const userNeurons = await governanceListNeurons({
        principal: identityActor.principal,
        limit: 10,
        beforeNeuronId: { id: [] },
      });
      if (userNeurons.length > 0) {
        const jsonString = JSON.stringify(dto);

        const encoder = new TextEncoder();
        const payload = encoder.encode(jsonString);

        const fn: ExecuteGenericNervousSystemFunction = {
          function_id: 11000n,
          payload: payload,
        };

        let clubs = await clubStore.getClubs(leagueId);
        let club = clubs.find((x) => x.id == clubId);
        if (!club) {
          return;
        }

        const command: Command = {
          MakeProposal: {
            title: `Create New Player: ${firstName} v ${lastName}.`,
            url: "openfpl.xyz/governance",
            summary: `Create New Player: ${firstName} v ${lastName}.`,
            action: [{ ExecuteGenericNervousSystemFunction: fn }],
          },
        };

        const neuronId = userNeurons[0].id[0];
        if (!neuronId) {
          return;
        }

        await governanceManageNeuron({
          subaccount: neuronId.id,
          command: [command],
        });
      }
    } catch (error) {
      console.error("Error creating player:", error);
      throw error;
    }
  }

  async function updatePlayer(
    leagueId: LeagueId,
    playerId: PlayerId,
    position: PlayerPosition,
    firstName: string,
    lastName: string,
    shirtNumber: number,
    dateOfBirth: bigint,
    nationality: number,
  ): Promise<any> {
    try {
      let dto: UpdatePlayerDTO = {
        leagueId,
        playerId,
        position,
        firstName,
        lastName,
        shirtNumber,
        dateOfBirth: BigInt(dateOfBirth),
        nationality,
      };

      const identityActor: any = await ActorFactory.createBackendIdentityActor(
        authStore,
        process.env.SNS_GOVERNANCE_CANISTER_ID ?? "",
      );

      const governanceAgent: HttpAgent = ActorFactory.getAgent(
        process.env.SNS_GOVERNANCE_CANISTER_ID,
        identityActor,
        null,
      );

      const {
        manageNeuron: governanceManageNeuron,
        listNeurons: governanceListNeurons,
      } = SnsGovernanceCanister.create({
        agent: governanceAgent,
        canisterId: identityActor,
      });

      const userNeurons = await governanceListNeurons({
        principal: identityActor.principal,
        limit: 10,
        beforeNeuronId: { id: [] },
      });
      if (userNeurons.length > 0) {
        const jsonString = JSON.stringify(dto);

        const encoder = new TextEncoder();
        const payload = encoder.encode(jsonString);

        const fn: ExecuteGenericNervousSystemFunction = {
          function_id: 12000n,
          payload: payload,
        };

        let allPlayers = await playerStore.getPlayers(leagueId);
        let clubs = await clubStore.getClubs(leagueId);
        let player = allPlayers.find((x) => x.id == playerId);
        if (player) {
          let club = clubs.find((x) => x.id == player?.clubId);
          if (!club) {
            return;
          }

          const command: Command = {
            MakeProposal: {
              title: `Update ${player.firstName} ${player.lastName} details.`,
              url: "openfpl.xyz/governance",
              summary: `Update ${player.firstName} ${player.lastName} details.`,
              action: [{ ExecuteGenericNervousSystemFunction: fn }],
            },
          };

          const neuronId = userNeurons[0].id[0];
          if (!neuronId) {
            return;
          }

          await governanceManageNeuron({
            subaccount: neuronId.id,
            command: [command],
          });
        }
      }
    } catch (error) {
      console.error("Error updating player:", error);
      throw error;
    }
  }

  async function setPlayerInjury(
    leagueId: LeagueId,
    playerId: PlayerId,
    description: string,
    expectedEndDate: string,
  ): Promise<any> {
    try {
      const dateObject = new Date(expectedEndDate);
      const timestampMilliseconds = dateObject.getTime();
      let nanoseconds = BigInt(timestampMilliseconds) * BigInt(1000000);

      let dto: SetPlayerInjuryDTO = {
        leagueId,
        playerId,
        description,
        expectedEndDate: nanoseconds,
      };

      const identityActor: any = await ActorFactory.createBackendIdentityActor(
        authStore,
        process.env.SNS_GOVERNANCE_CANISTER_ID ?? "",
      );

      const governanceAgent: HttpAgent = ActorFactory.getAgent(
        process.env.SNS_GOVERNANCE_CANISTER_ID,
        identityActor,
        null,
      );

      const {
        manageNeuron: governanceManageNeuron,
        listNeurons: governanceListNeurons,
      } = SnsGovernanceCanister.create({
        agent: governanceAgent,
        canisterId: identityActor,
      });

      const userNeurons = await governanceListNeurons({
        principal: identityActor.principal,
        limit: 10,
        beforeNeuronId: { id: [] },
      });
      if (userNeurons.length > 0) {
        const jsonString = JSON.stringify(dto);

        const encoder = new TextEncoder();
        const payload = encoder.encode(jsonString);

        const fn: ExecuteGenericNervousSystemFunction = {
          function_id: 13000n,
          payload: payload,
        };

        let allPlayers = await playerStore.getPlayers(leagueId);
        let clubs = await clubStore.getClubs(leagueId);
        let player = allPlayers.find((x) => x.id == playerId);
        if (player) {
          let club = clubs.find((x) => x.id == player?.clubId);
          if (!club) {
            return;
          }

          const command: Command = {
            MakeProposal: {
              title: `Set Player Injury for ${player.firstName} ${player.lastName}.`,
              url: "openfpl.xyz/governance",
              summary: `Set Player Injury for ${player.firstName} ${player.lastName}.`,
              action: [{ ExecuteGenericNervousSystemFunction: fn }],
            },
          };

          const neuronId = userNeurons[0].id[0];
          if (!neuronId) {
            return;
          }

          await governanceManageNeuron({
            subaccount: neuronId.id,
            command: [command],
          });
        }
      }
    } catch (error) {
      console.error("Error setting player injury:", error);
      throw error;
    }
  }

  async function retirePlayer(
    leagueId: LeagueId,
    playerId: PlayerId,
    retirementDate: string,
  ): Promise<any> {
    try {
      const dateObject = new Date(retirementDate);
      const timestampMilliseconds = dateObject.getTime();
      let nanoseconds = BigInt(timestampMilliseconds) * BigInt(1000000);

      let dto: RetirePlayerDTO = {
        leagueId,
        playerId,
        retirementDate: nanoseconds,
      };

      const identityActor: any = await ActorFactory.createBackendIdentityActor(
        authStore,
        process.env.SNS_GOVERNANCE_CANISTER_ID ?? "",
      );

      const governanceAgent: HttpAgent = ActorFactory.getAgent(
        process.env.SNS_GOVERNANCE_CANISTER_ID,
        identityActor,
        null,
      );

      const {
        manageNeuron: governanceManageNeuron,
        listNeurons: governanceListNeurons,
      } = SnsGovernanceCanister.create({
        agent: governanceAgent,
        canisterId: identityActor,
      });

      const userNeurons = await governanceListNeurons({
        principal: identityActor.principal,
        limit: 10,
        beforeNeuronId: { id: [] },
      });
      if (userNeurons.length > 0) {
        const jsonString = JSON.stringify(dto);

        const encoder = new TextEncoder();
        const payload = encoder.encode(jsonString);

        const fn: ExecuteGenericNervousSystemFunction = {
          function_id: 14000n,
          payload: payload,
        };

        let allPlayers = await playerStore.getPlayers(leagueId);
        let clubs = await clubStore.getClubs(leagueId);
        let player = allPlayers.find((x) => x.id == playerId);
        if (player) {
          let club = clubs.find((x) => x.id == player?.clubId);
          if (!club) {
            return;
          }

          const command: Command = {
            MakeProposal: {
              title: `Retire ${player.firstName} ${player.lastName}.`,
              url: "openfpl.xyz/governance",
              summary: `Retire ${player.firstName} ${player.lastName}.`,
              action: [{ ExecuteGenericNervousSystemFunction: fn }],
            },
          };

          const neuronId = userNeurons[0].id[0];
          if (!neuronId) {
            return;
          }

          await governanceManageNeuron({
            subaccount: neuronId.id,
            command: [command],
          });
        }
      }
    } catch (error) {
      console.error("Error retiring player:", error);
      throw error;
    }
  }

  async function unretirePlayer(
    leagueId: LeagueId,
    playerId: PlayerId,
  ): Promise<any> {
    try {
      let dto: UnretirePlayerDTO = {
        leagueId,
        playerId,
      };

      const identityActor: any = await ActorFactory.createBackendIdentityActor(
        authStore,
        process.env.SNS_GOVERNANCE_CANISTER_ID ?? "",
      );

      const governanceAgent: HttpAgent = ActorFactory.getAgent(
        process.env.SNS_GOVERNANCE_CANISTER_ID,
        identityActor,
        null,
      );

      const {
        manageNeuron: governanceManageNeuron,
        listNeurons: governanceListNeurons,
      } = SnsGovernanceCanister.create({
        agent: governanceAgent,
        canisterId: identityActor,
      });

      const userNeurons = await governanceListNeurons({
        principal: identityActor.principal,
        limit: 10,
        beforeNeuronId: { id: [] },
      });
      if (userNeurons.length > 0) {
        const jsonString = JSON.stringify(dto);

        const encoder = new TextEncoder();
        const payload = encoder.encode(jsonString);

        const fn: ExecuteGenericNervousSystemFunction = {
          function_id: 15000n,
          payload: payload,
        };

        let allPlayers = await playerStore.getPlayers(leagueId);
        let clubs = await clubStore.getClubs(leagueId);
        let player = allPlayers.find((x) => x.id == playerId);
        if (player) {
          let club = clubs.find((x) => x.id == player?.clubId);
          if (!club) {
            return;
          }

          const command: Command = {
            MakeProposal: {
              title: `Unretire ${player.firstName} ${player.lastName}.`,
              url: "openfpl.xyz/governance",
              summary: `Unretire ${player.firstName} ${player.lastName}.`,
              action: [{ ExecuteGenericNervousSystemFunction: fn }],
            },
          };

          const neuronId = userNeurons[0].id[0];
          if (!neuronId) {
            return;
          }

          await governanceManageNeuron({
            subaccount: neuronId.id,
            command: [command],
          });
        }
      }
    } catch (error) {
      console.error("Error unretiring player:", error);
      throw error;
    }
  }

  async function createClub(dto: CreateClubDTO): Promise<any> {
    try {
      const identityActor: any = await ActorFactory.createBackendIdentityActor(
        authStore,
        process.env.SNS_GOVERNANCE_CANISTER_ID ?? "",
      );

      const governanceAgent: HttpAgent = ActorFactory.getAgent(
        process.env.SNS_GOVERNANCE_CANISTER_ID,
        identityActor,
        null,
      );

      const {
        manageNeuron: governanceManageNeuron,
        listNeurons: governanceListNeurons,
      } = SnsGovernanceCanister.create({
        agent: governanceAgent,
        canisterId: identityActor,
      });

      const userNeurons = await governanceListNeurons({
        principal: identityActor.principal,
        limit: 10,
        beforeNeuronId: { id: [] },
      });
      if (userNeurons.length > 0) {
        const jsonString = JSON.stringify(dto);

        const encoder = new TextEncoder();
        const payload = encoder.encode(jsonString);

        const fn: ExecuteGenericNervousSystemFunction = {
          function_id: 18000n,
          payload: payload,
        };

        let league = await leagueStore.getLeagueById(dto.leagueId);
        const command: Command = {
          MakeProposal: {
            title: `Create ${league!.name} club (${dto.friendlyName}).`,
            url: "openfpl.xyz/governance",
            summary: `Create ${league!.name} club (${dto.friendlyName}).`,
            action: [{ ExecuteGenericNervousSystemFunction: fn }],
          },
        };

        const neuronId = userNeurons[0].id[0];
        if (!neuronId) {
          return;
        }

        await governanceManageNeuron({
          subaccount: neuronId.id,
          command: [command],
        });
      }
    } catch (error) {
      console.error("Error updating club:", error);
      throw error;
    }
  }

  async function promoteClub(
    leagueId: LeagueId,
    toLeagueId: LeagueId,
    clubId: ClubId,
  ): Promise<any> {
    try {
      let dto: PromoteClubDTO = {
        leagueId,
        clubId,
        toLeagueId,
      };

      const identityActor: any = await ActorFactory.createBackendIdentityActor(
        authStore,
        process.env.SNS_GOVERNANCE_CANISTER_ID ?? "",
      );

      const governanceAgent: HttpAgent = ActorFactory.getAgent(
        process.env.SNS_GOVERNANCE_CANISTER_ID,
        identityActor,
        null,
      );

      const {
        manageNeuron: governanceManageNeuron,
        listNeurons: governanceListNeurons,
      } = SnsGovernanceCanister.create({
        agent: governanceAgent,
        canisterId: identityActor,
      });

      const userNeurons = await governanceListNeurons({
        principal: identityActor.principal,
        limit: 10,
        beforeNeuronId: { id: [] },
      });
      if (userNeurons.length > 0) {
        const jsonString = JSON.stringify(dto);

        const encoder = new TextEncoder();
        const payload = encoder.encode(jsonString);

        const fn: ExecuteGenericNervousSystemFunction = {
          function_id: 16000n,
          payload: payload,
        };

        let clubs = await clubStore.getClubs(leagueId);
        let club = clubs.find((x) => x.id == clubId);
        if (!club) {
          return;
        }

        const command: Command = {
          MakeProposal: {
            title: `Promote ${club.friendlyName}.`,
            url: "openfpl.xyz/governance",
            summary: `Promote ${club.friendlyName}.`,
            action: [{ ExecuteGenericNervousSystemFunction: fn }],
          },
        };

        const neuronId = userNeurons[0].id[0];
        if (!neuronId) {
          return;
        }

        await governanceManageNeuron({
          subaccount: neuronId.id,
          command: [command],
        });
      }
    } catch (error) {
      console.error("Error promoting former club:", error);
      throw error;
    }
  }

  async function updateClub(
    leagueId: LeagueId,
    clubId: ClubId,
    name: string,
    friendlyName: string,
    primaryColourHex: string,
    secondaryColourHex: string,
    thirdColourHex: string,
    abbreviatedName: string,
    shirtType: ShirtType,
  ): Promise<any> {
    try {
      let dto: UpdateClubDTO = {
        leagueId,
        clubId,
        name,
        friendlyName,
        primaryColourHex,
        secondaryColourHex,
        thirdColourHex,
        abbreviatedName,
        shirtType,
      };

      const identityActor: any = await ActorFactory.createBackendIdentityActor(
        authStore,
        process.env.SNS_GOVERNANCE_CANISTER_ID ?? "",
      );

      const governanceAgent: HttpAgent = ActorFactory.getAgent(
        process.env.SNS_GOVERNANCE_CANISTER_ID,
        identityActor,
        null,
      );

      const {
        manageNeuron: governanceManageNeuron,
        listNeurons: governanceListNeurons,
      } = SnsGovernanceCanister.create({
        agent: governanceAgent,
        canisterId: identityActor,
      });

      const userNeurons = await governanceListNeurons({
        principal: identityActor.principal,
        limit: 10,
        beforeNeuronId: { id: [] },
      });
      if (userNeurons.length > 0) {
        const jsonString = JSON.stringify(dto);

        const encoder = new TextEncoder();
        const payload = encoder.encode(jsonString);

        const fn: ExecuteGenericNervousSystemFunction = {
          function_id: 18000n,
          payload: payload,
        };

        let clubs = await clubStore.getClubs(leagueId);
        let club = clubs.find((x) => x.id == clubId);
        if (!club) {
          return;
        }

        const command: Command = {
          MakeProposal: {
            title: `Update ${club.friendlyName} club details.`,
            url: "openfpl.xyz/governance",
            summary: `Update ${club.friendlyName} club details.`,
            action: [{ ExecuteGenericNervousSystemFunction: fn }],
          },
        };

        const neuronId = userNeurons[0].id[0];
        if (!neuronId) {
          return;
        }

        await governanceManageNeuron({
          subaccount: neuronId.id,
          command: [command],
        });
      }
    } catch (error) {
      console.error("Error updating club:", error);
      throw error;
    }
  }

  return {
    revaluePlayerUp,
    revaluePlayerDown,
    submitFixtureData,
    addInitialFixtures,
    moveFixture,
    postponeFixture,
    rescheduleFixture,
    loanPlayer,
    transferPlayer,
    recallPlayer,
    createPlayer,
    updatePlayer,
    setPlayerInjury,
    retirePlayer,
    unretirePlayer,
    createClub,
    promoteClub,
    updateClub,
  };
}

export const governanceStore = createGovernanceStore();
