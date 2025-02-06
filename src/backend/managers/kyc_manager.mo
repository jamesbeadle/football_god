import Base "../types/base_types";
import Buffer "mo:base/Buffer";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Time "mo:base/Time";
import ShuftiTypes "../types/shufti_types";
import AppTypes "../types/app_types";

module {

  public class KYCManager() {

    private var kycProfiles: [(Base.PrincipalId, AppTypes.KYCProfile)] = []; 

    public func getStableKYCProfiles() : [(Base.PrincipalId, AppTypes.KYCProfile)]{
        return kycProfiles;
    };

    public func setStableKYCProfiles(stable_kyc_profiles: [(Base.PrincipalId, AppTypes.KYCProfile)]){
        kycProfiles := stable_kyc_profiles;
    };

    public func getKYCProfile(principalId: Base.PrincipalId) : ?AppTypes.KYCProfile {
      let profileResult = Array.find<(Base.PrincipalId, AppTypes.KYCProfile)>(kycProfiles, func(entry: (Base.PrincipalId, AppTypes.KYCProfile)) : Bool {
        return entry.0 == principalId;
      });
      switch(profileResult) {
        case(?profile) { return ?profile.1 };
        case(null) { return null };
      };
    };

    public func storeKYCReference(reference: Text, principalId: Text){
      let profileBuffer = Buffer.fromArray<(Base.PrincipalId, AppTypes.KYCProfile)>(kycProfiles);
      profileBuffer.add((principalId, {
        kycApprovalDate = 0;
        kycSubmissionDate = Time.now();
        principalId = principalId;
        reference = reference;
        shuftiResponse = null;
      }));
      kycProfiles := Buffer.toArray(profileBuffer);
    };

    public func storeVerificationResponse(response: ShuftiTypes.ShuftiResponse) : ?Base.PrincipalId {
      
      switch(response){
        case (#ShuftiAcceptedResponse accepted){
          let reference = extractReference(accepted.reference);
          let profileResult = Array.find<(Base.PrincipalId, AppTypes.KYCProfile)>(kycProfiles, 
            func(entry: (Base.PrincipalId, AppTypes.KYCProfile)) : Bool {
              entry.1.reference == reference;
          });          
      
          switch(profileResult){
            case (?kycProfile){
              kycProfiles := Array.map<(Base.PrincipalId, AppTypes.KYCProfile), (Base.PrincipalId, AppTypes.KYCProfile)>(kycProfiles, func(entry: (Base.PrincipalId, AppTypes.KYCProfile)) {
                if(entry.0 == kycProfile.0 and entry.1.reference == reference){
                  return (kycProfile.0, {
                    kycApprovalDate = Time.now();
                    kycSubmissionDate = entry.1.kycSubmissionDate;
                    principalId = entry.0;
                    reference = reference;
                    shuftiResponse = ?response;
                  })
                } else {
                  return entry;
                }
              });
            };
            case (null){}
          }
        };
        case (#ShuftiRejectedResponse rejected){
          let reference = extractReference(rejected.reference);

          let profileResult = Array.find<(Base.PrincipalId, AppTypes.KYCProfile)>(kycProfiles, 
            func(entry: (Base.PrincipalId, AppTypes.KYCProfile)) : Bool {
            entry.1.reference == reference;
          });          

          switch(profileResult){
            case (?kycProfile){
              kycProfiles := Array.map<(Base.PrincipalId, AppTypes.KYCProfile), (Base.PrincipalId, AppTypes.KYCProfile)>(kycProfiles, func(entry: (Base.PrincipalId, AppTypes.KYCProfile)) {
                if(entry.0 == kycProfile.0 and entry.1.reference == reference){
                  return (kycProfile.0, {
                    kycApprovalDate = 0;
                    kycSubmissionDate = entry.1.kycSubmissionDate;
                    principalId = entry.0;
                    reference = reference;
                    shuftiResponse = ?response;
                  })
                } else {
                  return entry;
                }
              });
            };
            case (null){}
          }
        };
      };
      return null;
    }
  };

  func dropLeft(t : Text, n : Nat) : Text {
    var i = n;
    let chars = t.chars();
    while (i > 0) {
      switch (chars.next()) {
        case null { return ""; };
        case (?_) {};
      };
      i -= 1;
    };
    return Text.fromIter(chars);
  };

  public func extractReference(input : Text) : Text {
    let prefix = "SP_REQUEST_";
    if (Text.startsWith(input, #text prefix)) {
      let skip = Text.size(prefix);
      let afterPrefix = dropLeft(input, skip);
      return Text.trimStart(afterPrefix, #char ' ');
    } else {
      return "";
    };
  };


};
