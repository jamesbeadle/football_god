import Float "mo:base/Float";
import Nat64 "mo:base/Nat64";
import Int64 "mo:base/Int64";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Management "./Management";
import Base "../types/base_types";

module {

    public func convertNat64ToFloat(input: Nat64) : Float {
        return Float.fromInt64(Int64.fromNat64(input));
    };

    public func convertFloatToNat64(input: Float) : Nat64 {
        return Nat64.fromIntWrap(Int64.toInt(Float.toInt64(input)));
    };

    public func updateCanister_(a : actor {}, backendCanisterController : ?Principal, IC : Management.Management) : async () {
        let cid = { canister_id = Principal.fromActor(a) };
        switch (backendCanisterController) {
        case (null) {};
        case (?controller) {
            await (
            IC.update_settings({
                canister_id = cid.canister_id;
                settings = {
                controllers = ?[controller];
                compute_allocation = ?1;
                memory_allocation = null;
                freezing_threshold = ?2_592_000;
                reserved_cycles_limit = null
                };
                sender_canister_version = null
            }),
            );
        };
        };
    };

    public func validUsername(username : Text) : Bool {

      if (Text.size(username) < 3 or Text.size(username) > 20) {
        return false;
      };

      let isAlphanumeric = func(s : Text) : Bool {
        let chars = Text.toIter(s);
        for (c in chars) {
          if (not ((c >= 'a' and c <= 'z') or (c >= 'A' and c <= 'Z') or (c >= '0' and c <= '9'))) {
            return false;
          };
        };
        return true;
      };

      if (not isAlphanumeric(username)) {
        return false;
      };

      return true;
    };

    public func validProfilePicture(profilePicture : Blob) : Bool {
      let sizeInKB = Array.size(Blob.toArray(profilePicture)) / 1024;
      return (sizeInKB > 0 and sizeInKB <= 500);
    };

};
