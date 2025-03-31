import { authStore } from "./auth-store";
import { IcrcLedgerCanister } from "@dfinity/ledger-icrc";
import { Principal } from "@dfinity/principal";
import { Text } from "@dfinity/candid/lib/cjs/idl";
import { createAgent } from "@dfinity/utils";
import type { OptionIdentity } from "../types/identity";

function createUserStore() {
  async function withdrawFPL(
    withdrawalAddress: string,
    withdrawalAmount: bigint,
  ): Promise<any> {
    try {
      let identity: OptionIdentity;

      authStore.subscribe(async (auth) => {
        identity = auth.identity;
      });

      if (!identity) {
        return;
      }

      let principalId = identity.getPrincipal();

      const agent = await createAgent({
        identity: identity,
        host: import.meta.env.VITE_AUTH_PROVIDER_URL,
        fetchRootKey: process.env.DFX_NETWORK === "local",
      });

      const { transfer } = IcrcLedgerCanister.create({
        agent,
        canisterId:
          process.env.DFX_NETWORK === "ic"
            ? Principal.fromText("ddsp7-7iaaa-aaaaq-aacqq-cai")
            : Principal.fromText("avqkn-guaaa-aaaaa-qaaea-cai"),
      });

      if (principalId) {
        try {
          let transfer_result = await transfer({
            to: {
              owner: Principal.fromText(withdrawalAddress),
              subaccount: [],
            },
            fee: 100_000n,
            memo: new Uint8Array(Text.encodeValue("0")),
            from_subaccount: undefined,
            created_at_time: BigInt(Date.now()) * BigInt(1_000_000),
            amount: withdrawalAmount - 100_000n,
          });
        } catch (err: any) {
          console.error(err.errorType);
        }
      }
    } catch (error) {
      console.error("Error withdrawing FPL.", error);
      throw error;
    }
  }

  async function getFPLBalance(): Promise<bigint> {
    let identity: OptionIdentity;

    authStore.subscribe(async (auth) => {
      identity = auth.identity;
    });

    if (!identity) {
      return 0n;
    }

    let principalId = identity.getPrincipal();

    const agent = await createAgent({
      identity: identity,
      host: import.meta.env.VITE_AUTH_PROVIDER_URL,
      fetchRootKey: process.env.DFX_NETWORK === "local",
    });

    const { balance } = IcrcLedgerCanister.create({
      agent,
      canisterId:
        process.env.DFX_NETWORK === "ic"
          ? Principal.fromText("ddsp7-7iaaa-aaaaq-aacqq-cai")
          : Principal.fromText("avqkn-guaaa-aaaaa-qaaea-cai"),
    });

    if (principalId) {
      try {
        let result = await balance({
          owner: principalId,
          certified: false,
        });
        return result;
      } catch (err: any) {
        console.error(err);
      }
    }

    return 0n;
  }
  return {
    withdrawFPL,
    getFPLBalance,
  };
}

export const userStore = createUserStore();
