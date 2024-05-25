import Account "Account";
import FPLLedger "FPLLedger";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Int64 "mo:base/Int64";
import Nat64 "mo:base/Nat64";
import Types "types";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Buffer "mo:base/Buffer";
import Text "mo:base/Text";
import Blob "mo:base/Blob";
import DTOs "DTOs";
import Environment "environment";

module {

  public class Book() {

    private let ledger : FPLLedger.Interface = actor (FPLLedger.CANISTER_ID);
    let entry_fee : Nat = 100_000_000_000;
    let fpl_fee : Nat = 100_000;

    public func getGameweekPotBalance(owner : Principal, subaccount : Account.Subaccount) : async Nat64 {
      let balance = await ledger.icrc1_balance_of({owner; subaccount = ?subaccount});
      return Int64.toNat64(Float.toInt64(Float.fromInt64(Int64.fromNat64(Nat64.fromNat(balance))) * 0.95));
    };

    public func getUserAccountBalance(userPrincipalId : Principal) : async Nat {
      let balance = await ledger.icrc1_balance_of({owner = userPrincipalId; subaccount = null});
      return balance;
    };

    public func canAffordEntry(defaultAccount : Principal, user : Principal) : async Bool {
      let balance = await ledger.icrc1_balance_of({owner = defaultAccount; subaccount = ?Account.principalToSubaccount(user)});
      return balance >= entry_fee;
    };

    public func getTotalBalance(defaultAccount : Principal, user : Principal) : async Nat {
      let balance = await ledger.icrc1_balance_of({owner = defaultAccount; subaccount = ?Account.principalToSubaccount(user)});
      return balance;
    };

    public func transferWinnings(defaultAccount : Principal, user : Principal, amount : Float) : async () {
      let e8Amount = Nat64.toNat(Int64.toNat64(Float.toInt64(amount * 1e8)));
      let _ = await ledger.icrc1_transfer({
        memo = ?Text.encodeUtf8("0");
        from_subaccount = null;
        to = {owner = defaultAccount; subaccount = ?Account.principalToSubaccount(user)};
        amount = e8Amount - fpl_fee ;
        fee = ?fpl_fee;
        created_at_time =?Nat64.fromNat(Int.abs(Time.now()));
      });
    };

  };
};



