import Types "types";
import Result "mo:base/Result";
import Map "mo:base/HashMap";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import SHA224 "SHA224";
import CRC32 "CRC32";

import Nat8 "mo:base/Nat8";
import Nat32 "mo:base/Nat32";
import Buffer "mo:base/Buffer";
import Blob "mo:base/Blob";
import Array "mo:base/Array";

module {
    
  public class Profiles(){

    private type PrincipalName = Text;

    private var userProfiles = Map.HashMap<PrincipalName, Types.Profile>(0, Text.equal, Text.hash);

    public func updateProfile(principalName: PrincipalName, displayName: Text, wallet: Text) : Result.Result<(), Types.Error> {
        
        let updatedProfile: Types.Profile = {
            displayName = displayName;
            wallet = wallet;
            depositAddress = principalToSubaccount(Principal.fromText(principalName));
        };

        let existingProfile = switch(userProfiles.get(principalName)) {
            case null {
                let nameValid = isDisplayNameValid(updatedProfile.displayName);
                if(nameValid){
                    return #err(#NotAllowed);
                };
                userProfiles.put(principalName, updatedProfile);
                return #ok(());
            };
            case (?existingProfile) {
                let nameChanged = updatedProfile.displayName != existingProfile.displayName;
                if(nameChanged){
                    let nameValid = isDisplayNameValid(updatedProfile.displayName);
                    if(nameValid){
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

    public func getProfile(principalName: Text) : ?Types.Profile {
        return userProfiles.get(principalName);
    };

    public func getPublicProfile(principalName: Text) : ?Types.Profile {
        switch (userProfiles.get(principalName)) {
            case (null) { return null };
            case (?profile) { 
                
                let publicProfile = {
                    displayName = profile.displayName;
                    wallet = "";
                    depositAddress = Blob.fromArrayMut(Array.init(32, 0 : Nat8));
                };
                
                return ?publicProfile;
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


        for(x in userProfiles.vals()){
            if(x.displayName == displayName){
                return true;
            }
        };

        return false;
    };

    public func principalToSubaccount(principal: Principal) : Blob {
        let idHash = SHA224.Digest();
        idHash.write(Blob.toArray(Principal.toBlob(principal)));
        let hashSum = idHash.sum();
        let crc32Bytes = beBytes(CRC32.ofArray(hashSum));
        let buf = Buffer.Buffer<Nat8>(32);
        let blob = Blob.fromArray(Array.append(crc32Bytes, hashSum));

        return blob;
    };

    func beBytes(n: Nat32) : [Nat8] {
        func byte(n: Nat32) : Nat8 {
        Nat8.fromNat(Nat32.toNat(n & 0xff))
        };
        [byte(n >> 24), byte(n >> 16), byte(n >> 8), byte(n)]
    };


  }
}
