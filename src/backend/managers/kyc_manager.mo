import Base "../types/base_types";
import App "../types/app_types";
import Buffer "mo:base/Buffer";

module {

  public class KYCManager() {

    private var kycReferences: [(Base.PrincipalId, Text)] = [];
    private var kycProfiles: [(Base.PrincipalId, App.ShuftiResponse)] = []; 

    public func getStableKYCReferences() : [(Base.PrincipalId, Text)]{
        return kycReferences;
    };

    public func setStableKYCReferences(stable_kyc_references: [(Base.PrincipalId, Text)]){
        kycReferences := stable_kyc_references;
    };

    public func getStableKYCProfiles() : [(Base.PrincipalId, App.ShuftiResponse)]{
        return kycProfiles;
    };

    public func setStableKYCProfiles(stable_kyc_profiles: [(Base.PrincipalId, App.ShuftiResponse)]){
        kycProfiles := stable_kyc_profiles;
    };

    public func storeKYCReference(reference: Text, principalId: Text){
      let referenceBuffer = Buffer.fromArray<(Base.PrincipalId, Text)>(kycReferences);
      referenceBuffer.add((principalId, reference));
      kycReferences := Buffer.toArray(referenceBuffer);
    };
    //Shufti send response 

    //shufti call back
        //verify
        //reject

    

  };
};
