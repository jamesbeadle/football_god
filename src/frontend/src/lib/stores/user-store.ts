import { authStore } from "./auth-store";
import { ActorFactory } from "../utils/ActorFactory";
import { isError } from "../utils/helpers";
import { writable } from "svelte/store";
import { IcrcLedgerCanister } from "@dfinity/ledger-icrc";
import { Principal } from "@dfinity/principal";
import { Text } from "@dfinity/candid/lib/cjs/idl";
import { createAgent } from "@dfinity/utils";
import type { OptionIdentity } from "../types/identity";

function createUserStore() {
  const { subscribe, set } = writable<any>(null);

  async function sync() {
    let localStorageString = localStorage.getItem("user_profile_data");
    if (localStorageString) {
      const localProfile = JSON.parse(localStorageString);
      set(localProfile);
      return;
    }
    try {
      await cacheProfile();
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  }

  async function updateUsername(username: string): Promise<any> {
    try {
      const identityActor = await ActorFactory.createBackendIdentityActor(
        authStore,
        process.env.BACKEND_CANISTER_ID ?? "",
      );
      const result = await identityActor.updateDisplayName(username);
      if (isError(result)) {
        console.error("Error updating username");
        return;
      }
      await cacheProfile();
      return result;
    } catch (error) {
      console.error("Error updating username:", error);
      throw error;
    }
  }

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

  async function agreeTerms(): Promise<any> {
    try {
      const identityActor = await ActorFactory.createBackendIdentityActor(
        authStore,
        process.env.BACKEND_CANISTER_ID ?? "",
      );
      const result = await identityActor.agreeTerms();
      if (isError(result)) {
        console.error("Error agreeing terms");
        return;
      }

      await cacheProfile();
      return result;
    } catch (error) {
      console.error(error);
      console.error("Error agreeing terms:", error);
    }
  }

  async function updateProfilePicture(picture: File): Promise<any> {
    try {
      const maxPictureSize = 1000;
      const extension = getFileExtensionFromFile(picture);

      if (picture.size > maxPictureSize * 1024) {
        return null;
      }
      const reader = new FileReader();
      reader.readAsArrayBuffer(picture);
      reader.onloadend = async () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        try {
          const identityActor = await ActorFactory.createBackendIdentityActor(
            authStore,
            process.env.BACKEND_CANISTER_ID ?? "",
          );
          const result = await identityActor.updateProfilePicture(
            uint8Array,
            extension,
          );
          if (isError(result)) {
            console.error("Error updating profile picture");
            return;
          }

          await cacheProfile();
          return result;
        } catch (error) {
          console.error(error);
        }
      };
    } catch (error) {
      console.error("Error updating username:", error);
      throw error;
    }
  }

  function getFileExtensionFromFile(file: File): string {
    const filename = file.name;
    const lastIndex = filename.lastIndexOf(".");
    return lastIndex !== -1 ? filename.substring(lastIndex + 1) : "";
  }

  async function isUsernameAvailable(username: string): Promise<boolean> {
    const identityActor: any = await ActorFactory.createBackendIdentityActor(
      authStore,
      process.env.BACKEND_CANISTER_ID ?? "",
    );
    return await identityActor.isUsernameValid(username);
  }

  async function cacheProfile() {
    const identityActor: any = await ActorFactory.createBackendIdentityActor(
      authStore,
      process.env.BACKEND_CANISTER_ID ?? "",
    );

    let getProfileResponse = await identityActor.getProfile();
    let error = isError(getProfileResponse);
    if (error) {
      console.error("Error fetching user profile");
      return;
    }

    let profileData = getProfileResponse.ok;
    set(profileData);
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
    subscribe,
    sync,
    agreeTerms,
    updateUsername,
    updateProfilePicture,
    isUsernameAvailable,
    cacheProfile,
    withdrawFPL,
    getFPLBalance,
  };
}

export const userStore = createUserStore();
