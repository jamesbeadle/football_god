import Types "types";
import Result "mo:base/Result";
import List "mo:base/List";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Account "Account";

import Nat8 "mo:base/Nat8";
import Nat32 "mo:base/Nat32";
import Nat64 "mo:base/Nat64";
import Buffer "mo:base/Buffer";
import Blob "mo:base/Blob";
import Array "mo:base/Array";

module {
    
  public class Profiles(){

    private var userProfiles = List.nil<Types.Profile>();

    public func setData(stable_profiles: [Types.Profile]){
        userProfiles := List.fromArray(stable_profiles);
    };
    
    public func getProfiles() : [Types.Profile] {
        return List.toArray(List.map<Types.Profile, Types.Profile>(userProfiles, func (profile: Types.Profile): Types.Profile {
            return {
                principalName = profile.principalName; 
                displayName = profile.displayName;
                depositAddress = profile.depositAddress;
                wallet = ""; 
                balance = 0;
            };
        }));
    };
    
    public func updateProfile(principalName: Types.PrincipalName, displayName: Text, wallet: Text) : Result.Result<(), Types.Error> {
        
        let updatedProfile: Types.Profile = {
            principalName = principalName;
            displayName = displayName;
            wallet = wallet;
            depositAddress = Account.principalToSubaccount(Principal.fromText(principalName));
            balance = 0;
        };
        
        let existingProfile = List.find<Types.Profile>(userProfiles, func (profile: Types.Profile): Bool {
            return profile.principalName == principalName;
        });

        switch (existingProfile) {
            case (null) { 
                let nameValid = isDisplayNameValid(updatedProfile.displayName);
                if(not nameValid){
                    return #err(#NotAllowed);
                };
                var newProfilesList = List.nil<Types.Profile>();
                newProfilesList := List.push(updatedProfile, newProfilesList);
                userProfiles := List.append(userProfiles, newProfilesList);
                return #ok(());
             };
            case (?existingProfile) {
                let nameChanged = updatedProfile.displayName != existingProfile.displayName;
                if(nameChanged){
                    let nameValid = isDisplayNameValid(updatedProfile.displayName);
                    if(not nameValid){
                        return #err(#NotAllowed);
                    };
                };

                userProfiles := List.map<Types.Profile, Types.Profile>(userProfiles, func (profile: Types.Profile): Types.Profile {
                    if (profile.principalName == principalName) {
                        { 
                            principalName = profile.principalName; 
                            displayName = displayName;
                            wallet = wallet; 
                            depositAddress = profile.depositAddress;
                            balance = 0;
                        }
                    } else { profile }
                });

                return #ok(());
            };
        };
    };

    public func checkForProfile(principalName: Text) : Bool {
        let existingProfile = List.find<Types.Profile>(userProfiles, func (profile: Types.Profile): Bool {
            return profile.principalName == principalName;
        });
        switch (existingProfile) {
            case null { return false };
            case _ { return true };
        };
    };

    public func getProfile(principalName: Text) : ?Types.Profile {
        let foundProfile = List.find<Types.Profile>(userProfiles, func (profile: Types.Profile): Bool {
            return profile.principalName == principalName;
        });

        switch (foundProfile) {
            case (null) { return null; };
            case (?profile) { return ?profile; };
        };
    };

    public func getPublicProfile(principalName: Text) : ?Types.Profile {
        let foundProfile = List.find<Types.Profile>(userProfiles, func (profile: Types.Profile): Bool {
            return profile.principalName == principalName;
        });

        switch (foundProfile) {
            case (null) { return null; };
            case (?profile) { 
                let profileInfo = {
                    principalName = "";
                    displayName = profile.displayName;
                    wallet = "";
                    depositAddress = Blob.fromArrayMut(Array.init(32, 0 : Nat8));
                    balance = Nat64.fromNat(0);
                };
                return ?profileInfo;
            };
        };
    };
    
    public func isDisplayNameValid(displayName: Text) : Bool {
        
        if (Text.size(displayName) < 3) {
            return false;
        };

         let isAlphanumeric = func (s: Text): Bool {
            let chars = Text.toIter(s);
            for (c in chars) {
                if (not((c >= 'a' and c <= 'z') or (c >= 'A' and c <= 'Z') or (c >= '0' and c <= '9'))) {
                    return false;
                };
            };
            return true;
        };

        if (not isAlphanumeric(displayName)) {
            return false;
        };

        let foundProfile = List.find<Types.Profile>(userProfiles, func (profile: Types.Profile): Bool {
            return profile.displayName == displayName;
        });

        if(foundProfile != null){
            return false;
        };

        return true;
    };


  }
}
