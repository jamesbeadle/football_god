import Float "mo:base/Float";
import Nat64 "mo:base/Nat64";
import Int64 "mo:base/Int64";
import Principal "mo:base/Principal";
import Management "./Management";

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

};
