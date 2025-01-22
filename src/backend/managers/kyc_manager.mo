import Base "../types/base_types";
import App "../types/app_types";
import Buffer "mo:base/Buffer";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Array "mo:base/Array";
import ShuftiTypes "../types/shufti_types";
import T "../types/app_types";

module {

  public class KYCManager() {

    private var kycReferences: [(Base.PrincipalId, Text)] = [];
    private var kycProfiles: [(Base.PrincipalId, ShuftiTypes.ShuftiResponse)] = []; 

    public func getStableKYCReferences() : [(Base.PrincipalId, Text)]{
        return kycReferences;
    };

    public func setStableKYCReferences(stable_kyc_references: [(Base.PrincipalId, Text)]){
        kycReferences := stable_kyc_references;
    };

    public func getStableKYCProfiles() : [(Base.PrincipalId, ShuftiTypes.ShuftiResponse)]{
        return kycProfiles;
    };

    public func setStableKYCProfiles(stable_kyc_profiles: [(Base.PrincipalId, ShuftiTypes.ShuftiResponse)]){
        kycProfiles := stable_kyc_profiles;
    };

    public func storeKYCReference(reference: Text, principalId: Text){
      let referenceBuffer = Buffer.fromArray<(Base.PrincipalId, Text)>(kycReferences);
      referenceBuffer.add((principalId, reference));
      kycReferences := Buffer.toArray(referenceBuffer);
    };

    public func storeVerificationResponse(response: ShuftiTypes.ShuftiResponse) : ?Base.PrincipalId {

      let responseBuffer = Buffer.fromArray<(Base.PrincipalId, ShuftiTypes.ShuftiResponse)>(kycProfiles);

      switch(response){
        case (#ShuftiAcceptedResponse accepted){
          let reference = extractReference(accepted.reference);

          let kycReferenceResult = Array.find<(Base.PrincipalId, Text)>(kycReferences, 
            func(entry: (Base.PrincipalId, Text)) : Bool {
            entry.0 == reference;
          });

          switch(kycReferenceResult){
            case (?kycReference){
              responseBuffer.add(kycReference.0, response);
              kycProfiles := Buffer.toArray(responseBuffer);
              return ?kycReference.0;
            };
            case (null){}
          }
        };
        case (#ShuftiRejectedResponse rejected){
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
