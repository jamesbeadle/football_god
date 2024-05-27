import { authStore } from "$lib/stores/auth.store";
import { ActorFactory } from "../../utils/ActorFactory";
import { isError } from "$lib/utils/helpers";
import { writable } from "svelte/store";
import type {
  AccountBalancesDTO,
  Euro2024PredictionDTO,
} from "../../../../declarations/football_god_backend/football_god_backend.did";
import { IcrcLedgerCanister, IcrcTransferError } from "@dfinity/ledger-icrc";
import { Principal } from "@dfinity/principal";
import { Text } from "@dfinity/candid/lib/cjs/idl";
import { createAgent, principalToSubAccount } from "@dfinity/utils";
import type { OptionIdentity } from "$lib/types/identity";

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
      const identityActor = await ActorFactory.createIdentityActor(
        authStore,
        process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
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
          const identityActor = await ActorFactory.createIdentityActor(
            authStore,
            process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
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
    // Use the name property of the File object to get the filename
    const filename = file.name;

    // Extract the extension
    const lastIndex = filename.lastIndexOf(".");

    // Return the extension, ensuring it doesn't return -1 for files without an extension
    return lastIndex !== -1 ? filename.substring(lastIndex + 1) : "";
  }

  async function isUsernameAvailable(username: string): Promise<boolean> {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
    );
    return await identityActor.isUsernameValid(username);
  }

  async function cacheProfile() {
    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
    );

    let getProfileResponse = await identityActor.getProfileDTO();
    let error = isError(getProfileResponse);
    if (error) {
      console.error("Error fetching user profile");
      return;
    }

    let profileData = getProfileResponse.ok;
    set(profileData);
  }

  async function saveEuro2024Predictions(
    dto: Euro2024PredictionDTO,
  ): Promise<any> {
    try {
      const identityActor = await ActorFactory.createIdentityActor(
        authStore,
        process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
      );
      const paidButNoEntry = await identityActor.checkPaidButNoEntry();

      if (dto.alreadyEntered || paidButNoEntry) {
        const result = await identityActor.submitEuro2024Prediction(dto);
        if (isError(result)) {
          console.error("Error saving Euro2024 prediction.");
          return;
        }
        return result;
      }

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
        let subaccount: Uint8Array = principalToSubAccount(principalId);
        try {
          let transfer_result = await transfer({
            to: {
              owner: Principal.fromText(
                process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
              ),
              subaccount: [subaccount],
            },
            fee: 100_000n,
            memo: new Uint8Array(Text.encodeValue("0")),
            from_subaccount: undefined,
            created_at_time: BigInt(Date.now()) * BigInt(1_000_000),
            amount: 10_000_000_000n,
          });

          const result = await identityActor.submitEuro2024Prediction(dto);
          if (isError(result)) {
            console.error("Error saving Euro2024 prediction.");
            return;
          }
          return result;
        } catch (err: any) {
          console.error(err.errorType);
        }
      }
    } catch (error) {
      console.error("Error saving Euro2024 prediction.", error);
      throw error;
    }
  }

  async function getUserPrediction(): Promise<
    Euro2024PredictionDTO | undefined
  > {
    try {
      const identityActor: any = await ActorFactory.createIdentityActor(
        authStore,
        process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
      );
      const result = await identityActor.getUserPrediction();
      if (isError(result)) {
        console.error("Error getting user prediction");
        return undefined;
      }

      let prediction = result.ok;
      return prediction;
    } catch (error) {
      console.error("Error getting user prediction:", error);
      return undefined;
    }
  }

  async function getAccountBalances(): Promise<AccountBalancesDTO | undefined> {
    try {
      const identityActor: any = await ActorFactory.createIdentityActor(
        authStore,
        process.env.FOOTBALL_GOD_BACKEND_CANISTER_ID ?? "",
      );
      const result = await identityActor.getAccountBalances();
      if (isError(result)) {
        console.error("Error getting account balances");
        return undefined;
      }

      let accountBalances = result;
      return accountBalances;
    } catch (error) {
      console.error("Error getting user account balances:", error);
      return undefined;
    }
  }

  return {
    subscribe,
    sync,
    updateUsername,
    updateProfilePicture,
    isUsernameAvailable,
    cacheProfile,
    saveEuro2024Predictions,
    getUserPrediction,
    getAccountBalances,
  };
}

export const userStore = createUserStore();
