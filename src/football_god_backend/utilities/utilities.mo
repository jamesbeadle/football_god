import Float "mo:base/Float";
import Nat64 "mo:base/Nat64";
import Int64 "mo:base/Int64";

module {

    public func convertNat64ToFloat(input: Nat64) : Float {
        return Float.fromInt64(Int64.fromNat64(input));
    };

    public func convertFloatToNat64(input: Float) : Nat64 {
        return Nat64.fromIntWrap(Int64.toInt(Float.toInt64(input)));
    };

};
