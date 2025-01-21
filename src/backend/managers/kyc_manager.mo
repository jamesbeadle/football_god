import Base "../types/base_types";
import App "../types/app_types";

module {

  public class KYCManager() {

    private var kycProfiles: [(Base.PrincipalId, App.ShuftiResponse)] = [];

    public func getStableKYCProfiles() : [(Base.PrincipalId, App.ShuftiResponse)]{
        return kycProfiles;
    };

    public func setStableKYCProfiles(stable_kyc_profiles: [(Base.PrincipalId, App.ShuftiResponse)]){
        kycProfiles := stable_kyc_profiles;
    };

    //Shufti send response 

    //shufti call back
        //verify
        //reject

    

  };
};
