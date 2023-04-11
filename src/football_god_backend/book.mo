import Account "Account";
import Ledger "canister:ledger";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Int64 "mo:base/Int64";
import Nat64 "mo:base/Nat64";
import Types "types";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Text "mo:base/Text";
import Blob "mo:base/Blob";
import Debug "mo:base/Debug";

module {
    
  public class Book(){
    
    let entry_fee: Nat64 = 100_000_000;
    let icp_fee: Nat64 = 10_000;
   
    public func getTotalBalance(defaultSubAccount: Account.AccountIdentifier) : async Nat64 {
        let balance = await Ledger.account_balance({ account = defaultSubAccount });
        return balance.e8s;
    };
   
    public func getGameweekPotBalance(defaultSubAccount: Account.AccountIdentifier) : async Float {
        let balance = await Ledger.account_balance({ account = defaultSubAccount });
        return Float.fromInt64(Int64.fromNat64(balance.e8s)) * 0.95;
    };

    public func getUserAccountBalance(defaultAccount: Principal, user: Principal) : async Nat64 {
        let source_account = Account.accountIdentifier(defaultAccount, Account.principalToSubaccount(user));
        let balance = await Ledger.account_balance({ account = source_account });
        return balance.e8s;
    };

    public func transferWinnings(defaultAccount: Principal, user: Principal, amount: Float) : async () {

        Debug.print(debug_show(user));
        Debug.print(debug_show(amount));

        let result = await Ledger.transfer({
          memo = 0;
          from_subaccount = null;
          to = Account.accountIdentifier(defaultAccount, Account.principalToSubaccount(user));
          amount = { e8s = Int64.toNat64(Float.toInt64(amount)) };
          fee = { e8s = icp_fee };
          created_at_time = ?{ timestamp_nanos = Nat64.fromNat(Int.abs(Time.now())) };
        });
        Debug.print(debug_show(result));
    };

    public func canAffordEntry(defaultAccount: Principal, user: Principal) : async Bool {
        let source_account = Account.accountIdentifier(defaultAccount, Account.principalToSubaccount(user));
        let balance = await Ledger.account_balance({ account = source_account });
        
        return balance.e8s >= entry_fee;
    };

    public func transferEntryFee(defaultAccount: Principal, user: Principal) : async () {
        let result = await Ledger.transfer({
          memo = 0;
          from_subaccount = ?Account.principalToSubaccount(user);
          to = Account.accountIdentifier(defaultAccount, Account.defaultSubaccount());
          amount = { e8s = entry_fee - icp_fee};
          fee = { e8s = icp_fee };
          created_at_time = ?{ timestamp_nanos = Nat64.fromNat(Int.abs(Time.now())) };
        });
    };

    //withdraw ICP
    public func withdrawICP(defaultAccount: Principal, user: Principal, amount: Float, walletAddress: Text) : async Result.Result<(), Types.Error> {
        
        let e8Amount = Int64.toNat64(Float.toInt64(amount * 1e8));
        let source_account = Account.accountIdentifier(defaultAccount, Account.principalToSubaccount(user));
        let balance = await Ledger.account_balance({ account = source_account });
        
        if(balance.e8s < icp_fee){
            return #err(#NotAllowed);
        };

        let withdrawable = balance.e8s - icp_fee;

        if(e8Amount >= withdrawable){
            return #err(#NotAllowed);
        };

        let account_id = Account.decode(walletAddress);
        switch account_id {
            case (#ok array) {
                let result = await Ledger.transfer({
                    memo: Nat64    = 0;
                    from_subaccount = ?Account.principalToSubaccount(user);
                    to = Blob.fromArray(array);
                    amount = { e8s = e8Amount };
                    fee = { e8s = icp_fee };
                    created_at_time = ?{ timestamp_nanos = Nat64.fromNat(Int.abs(Time.now())) };
                });

                return #ok(());
            };
            case (#err err) {
                return #err(#NotAllowed);
            };
        };
    };

    public func transferAdminFee(defaultAccount: Principal, walletAddress: Text) : async Result.Result<(), Types.Error> {
        
        let source_account = Account.accountIdentifier(defaultAccount, Account.defaultSubaccount());
        let balance = await Ledger.account_balance({ account = source_account });
        
        let account_id = Account.decode(walletAddress);
        switch account_id {
            case (#ok array) {
                let result = await Ledger.transfer({
                    memo: Nat64    = 0;
                    from_subaccount = null;
                    to = Blob.fromArray(array);
                    amount = { e8s = balance.e8s - icp_fee };
                    fee = { e8s = icp_fee };
                    created_at_time = ?{ timestamp_nanos = Nat64.fromNat(Int.abs(Time.now())) };
                });
                Debug.print(debug_show(result));

                return #ok(());
            };
            case (#err err) {
                return #err(#NotAllowed);
            };
        };
    };

    public func getProfileBalances(defaultAccount: Principal, profiles: [Types.Profile]) : async [Types.Profile] {
        
        var profilesWithBalances: [Types.Profile] = [];

        for (i in Iter.range(0, profiles.size() - 1)) {
            let source_account = Account.accountIdentifier(defaultAccount, Account.principalToSubaccount(Principal.fromText(profiles[i].principalName)));
            let balance = await Ledger.account_balance({ account = source_account });

            let updatedProfile = {
                principalName = profiles[i].principalName;
                displayName = profiles[i].displayName;
                wallet = profiles[i].wallet;
                depositAddress = profiles[i].depositAddress;
                balance = balance.e8s;
            };

            let buffer = Buffer.fromArray<Types.Profile>(profilesWithBalances);
            buffer.add(updatedProfile);

            profilesWithBalances := Buffer.toArray(buffer);
        };

        return profilesWithBalances;
    };

  }
}
