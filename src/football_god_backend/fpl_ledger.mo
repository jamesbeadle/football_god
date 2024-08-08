import Account "Account";
import FPLLedger "FPLLedger";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Int64 "mo:base/Int64";
import Nat64 "mo:base/Nat64";
import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Buffer "mo:base/Buffer";
import Nat8 "mo:base/Nat8";
import Blob "mo:base/Blob";

module {

  public class Book() {

    private let ledger : FPLLedger.Interface = actor (FPLLedger.CANISTER_ID);
    let entry_fee : Nat = 10_000_000_000;
    let fpl_fee : Nat = 100_000;
    
    public func getPotBalance(owner : Principal) : async Nat64 {
      let balance = await ledger.icrc1_balance_of({owner; subaccount = ?Account.defaultSubaccount()});
      return Nat64.fromNat(balance);
    };

    public func getUserAccountBalance(userPrincipalId : Principal) : async Nat {
      let balance = await ledger.icrc1_balance_of({owner = userPrincipalId; subaccount = null});
      return balance;
    };

    public func getUserSubaccountBalance(owner: Principal, caller : Principal) : async Nat {
      let balance = await ledger.icrc1_balance_of({owner = owner; subaccount = ?principalToSubaccount(caller)});
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

    public func payEuro2024EntryFee(defaultAccount : Principal, caller : Principal) : async FPLLedger.TransferResult {
      return await ledger.icrc1_transfer({
        memo = ?Text.encodeUtf8("0");
        from_subaccount = ?principalToSubaccount(caller);
        to = { owner = defaultAccount; subaccount = ?Account.defaultSubaccount()};
        amount = entry_fee - fpl_fee - fpl_fee;
        fee = ?fpl_fee;
        created_at_time =?Nat64.fromNat(Int.abs(Time.now()));
      });
    };

    public func transferBalanceBack(defaultAccount : Principal, caller : Principal, balance: Nat) : async FPLLedger.TransferResult {
      return await ledger.icrc1_transfer({
        memo = ?Text.encodeUtf8("0");
        from_subaccount = ?principalToSubaccount(caller);
        to = { owner = defaultAccount; subaccount = ?Account.defaultSubaccount()};
        amount = balance - fpl_fee;
        fee = ?fpl_fee;
        created_at_time =?Nat64.fromNat(Int.abs(Time.now()));
      });
    };

    public func transferFPLToJames(defaultAccount : Principal, james : Principal) : async FPLLedger.TransferResult {
      let e8Amount = await getPotBalance(defaultAccount);
      let e8s = Nat64.toNat(e8Amount);
      return await ledger.icrc1_transfer({
        memo = ?Text.encodeUtf8("0");
        from_subaccount = ?Account.defaultSubaccount();
        to = {owner = james; subaccount = null};
        amount = e8s - fpl_fee;
        fee = ?fpl_fee;
        created_at_time =?Nat64.fromNat(Int.abs(Time.now()));
      });
    };

    private func principalToSubaccount(principal : Principal) : Blob {
      var sub = Buffer.Buffer<Nat8>(32);
      let subaccount_blob = Principal.toBlob(principal);

      sub.add(Nat8.fromNat(subaccount_blob.size()));
      sub.append(Buffer.fromArray<Nat8>(Blob.toArray(subaccount_blob)));
      while (sub.size() < 32) {
      sub.add(0);
      };

      Blob.fromArray(Buffer.toArray(sub));
    };

    public func transferWinnings(user : Principal, amount : Float) : async () {
      let e8Amount = Nat64.toNat(Int64.toNat64(Float.toInt64(amount * 1e8)));
      let _ = await ledger.icrc1_transfer({
        memo = ?Text.encodeUtf8("0");
        from_subaccount = ?Account.defaultSubaccount();
        to = {owner = user; subaccount = null};
        amount = e8Amount - fpl_fee ;
        fee = ?fpl_fee;
        created_at_time =?Nat64.fromNat(Int.abs(Time.now()));
      });
    };
    
    public func checkCallerPaidButNoEntry(owner: Principal, caller: Principal) : async Bool {
      let balance = await ledger.icrc1_balance_of({owner; subaccount = ?principalToSubaccount(caller)});
      let requiredAmount: Nat = entry_fee - fpl_fee;
      return balance >= requiredAmount;
    };

  };
};



