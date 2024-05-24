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

    public func getUserAccountBalance(defaultAccount : Principal, user : Principal) : async Nat {
      let balance = await ledger.icrc1_balance_of({owner = defaultAccount; subaccount = ?Account.principalToSubaccount(user)});
      return balance;
    };

    public func canAffordEntry(defaultAccount : Principal, user : Principal) : async Bool {
      let balance = await ledger.icrc1_balance_of({owner = defaultAccount; subaccount = ?Account.principalToSubaccount(user)});
      return balance >= entry_fee;
    };

    public func transferEntryFee(defaultAccount : Principal, user : Principal) : async () {
      let _ = await ledger.icrc1_transfer({
        memo = ?Text.encodeUtf8("0");
        from_subaccount = ?Account.principalToSubaccount(user);
        to = {owner = defaultAccount; subaccount = ?Account.principalToSubaccount(user)};
        amount = entry_fee - fpl_fee ;
        fee = ?fpl_fee;
        created_at_time =?Nat64.fromNat(Int.abs(Time.now()));
      });
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

    //withdraw ICP
    public func withdrawICP(defaultAccount : Principal, user : Principal, amount : Float, walletAddress : Text) : async Result.Result<(), Types.Error> {

      if (amount <= 0) {
        return #err(#NotAllowed);
      };

      let e8Amount = Nat64.toNat(Int64.toNat64(Float.toInt64(amount * 1e8)));
      let balance = await ledger.icrc1_balance_of({owner = defaultAccount; subaccount = ?Account.principalToSubaccount(user)});
    
      if (balance < fpl_fee) {
        return #err(#NotAllowed);
      };

      let withdrawable: Int = balance - fpl_fee;

      if (e8Amount >= withdrawable) {
        return #err(#NotAllowed);
      };

      let account_id = Account.decode(walletAddress);
      switch account_id {
        case (#ok array) {

          if (not Account.validateAccountIdentifier(Blob.fromArray(array))) {
            return #err(#NotAllowed);
          };

          let _ = await ledger.icrc1_transfer({
            memo = ?Text.encodeUtf8("0");
            from_subaccount = ?Account.principalToSubaccount(user);
            to = { owner = defaultAccount; subaccount = ?Blob.fromArray(array)};
            amount = e8Amount - fpl_fee ;
            fee = ?fpl_fee;
            created_at_time =?Nat64.fromNat(Int.abs(Time.now()));
          });

          return #ok(());
        };
        case (#err err) {
          return #err(#NotAllowed);
        };
      };
    };

    public func burnDAOFee(defaultAccount : Principal, e8Amount: Nat) : async Result.Result<(), Types.Error> {
      let balance = await ledger.icrc1_balance_of({owner = defaultAccount; subaccount = ?Account.defaultSubaccount()});   
    
      if (balance <= fpl_fee) {
        return #err(#NotAllowed);
      };
      let _ = await ledger.icrc1_transfer({
        memo = ?Text.encodeUtf8("0");
        from_subaccount = null;
        to = { owner = Principal.fromText(Environment.OPENFPL_GOVERNANCE_CANISTER_ID); subaccount = null};
        amount = e8Amount - fpl_fee ;
        fee = ?fpl_fee;
        created_at_time =?Nat64.fromNat(Int.abs(Time.now()));
      });

      return #ok;
    };

  };
};



