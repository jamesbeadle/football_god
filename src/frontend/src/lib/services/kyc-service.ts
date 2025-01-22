import { authStore } from "$lib/stores/auth-store";
import { ActorFactory } from "$lib/utils/ActorFactory";
import { isError } from "$lib/utils/helpers";

export class KYCService {


  constructor() { }

  async storeKYCReference(reference: `${string}-${string}-${string}-${string}-${string}`): Promise<void> {

    const identityActor: any = await ActorFactory.createIdentityActor(
      authStore,
      process.env.BACKEND_CANISTER_ID ?? "",
    );
        
    const response = await identityActor.storeKYCReference(reference);
    if (isError(response)) {
      console.error("Error storing KYC reference:", response.err);
      throw new Error("Failed to store KYC reference");
    }
  }
  
}