import Types "types";
import Result "mo:base/Result";
import Map "mo:base/HashMap";
import Text "mo:base/Text";
import Principal "mo:base/Principal";

module {
    
  public class Profiles(){

    private type PrincipalName = Text;

    private var userProfiles = Map.HashMap<PrincipalName, Types.Profile>(0, Text.equal, Text.hash);

    public func updateProfile(principalName: PrincipalName, displayName: Text, wallet: Text) : Result.Result<(), Types.Error> {
        
        let updatedProfile: Types.Profile = {
            displayName = displayName;
            wallet = wallet;
        };

        let existingProfile = switch(userProfiles.get(principalName)) {
            case null {
                let nameTaken = isDisplayNameTaken(updatedProfile.displayName);
                if(nameTaken){
                    return #err(#NotAllowed);
                };
                userProfiles.put(principalName, updatedProfile);
                return #ok(());
            };
            case (?existingProfile) {
                let nameChanged = updatedProfile.displayName != existingProfile.displayName;
                if(nameChanged){
                    let nameTaken = isDisplayNameTaken(updatedProfile.displayName);
                    if(nameTaken){
                        return #err(#NotAllowed);
                    };
                };
                userProfiles.put(principalName, updatedProfile);
                return #ok(());
            };
        };
    };

    public func checkForProfile(principalName: Text) : Bool {
        switch (userProfiles.get(principalName)) {
            case null { return false };
            case _ { return true };
        };
    };

    public func isDisplayNameTaken(displayName: Text) : Bool {
        
        for(x in userProfiles.vals()){
            if(x.displayName == displayName){
                return true;
            }
        };

        return false;
    };

  }
}
