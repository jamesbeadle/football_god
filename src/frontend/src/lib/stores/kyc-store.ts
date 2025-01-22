import { KYCService } from "$lib/services/kyc-service";

function createKYCStore() {
  async function storeKYCReference(reference: `${string}-${string}-${string}-${string}-${string}`) {
    return new KYCService().storeKYCReference(reference);
  }

  return {
    storeKYCReference
  };
}

export const kycStore = createKYCStore();
