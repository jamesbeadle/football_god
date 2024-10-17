import Account "../utilities/Account";
import FPLLedger "../interfaces/FPLLedger";
import Nat64 "mo:base/Nat64";
import Principal "mo:base/Principal";
import Buffer "mo:base/Buffer";
import Nat8 "mo:base/Nat8";
import Blob "mo:base/Blob";

module {

  public class Book() {

    private let ledger : FPLLedger.Interface = actor (FPLLedger.CANISTER_ID);
    
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

    public func getTotalBalance(defaultAccount : Principal, user : Principal) : async Nat {
      let balance = await ledger.icrc1_balance_of({owner = defaultAccount; subaccount = ?Account.principalToSubaccount(user)});
      return balance;
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

  };
};



