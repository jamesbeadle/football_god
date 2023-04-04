import Array "mo:base/Array";
import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import Iter "mo:base/Iter";

import M "mo:base/HashMap";

module {

    public class Book() {

        var book = M.HashMap<Principal, Nat>(10, Principal.equal, Principal.hash);

        public func get(user: Principal) : ?Nat {
            book.get(user)
        };

        public func put(user: Principal, balance: Nat) {
            book.put(user, balance);
        };

        public func entries() : Iter.Iter<(Principal, Nat)> {
            book.entries()
        };

        public func size() : Nat {
            book.size()
        };

        // For development only.
        public func print_balances(){
            for ((x, y) in book.entries()) {
                Debug.print( debug_show("PRINCIPAL: ", x, " Balance: ", y));
            };
        };

        public func clear() {
            book := M.HashMap<Principal, Nat>(10, Principal.equal, Principal.hash);
        };

        public func addTokens(user: Principal, amount: Nat){
            switch (book.get(user)) {
                case (?balance) {
                    book.put(user, balance + amount);
                };
                case (null) {
                    // user didn't exist
                    book.put(user, amount);
                };
            };
        };

        public func removeTokens(user: Principal, amount: Nat) : ?Nat {
            switch (book.get(user)) {
                case (?balance) {
                    if (balance >= amount) {
                        if (balance == amount) {
                            book.delete(user);
                        } else {
                            book.put(user, balance - amount);
                        };
                        ?(balance - amount)
                    } else {
                        null
                    }
                };
                case (null) {
                    // user didn't exist
                    Debug.print("User " # Principal.toText(user) # " doesn't exist in book, cannot remove tokens.");
                    null
                };
            };
        };

        public func hasEnoughBalance(user: Principal, amount: Nat) : Bool {
            switch (book.get(user)) {
                case (?balance) return balance >= amount;
                case null return false;
            };
        };

        public func transferSweepstakeEntry(user: Principal, amount: Nat) : Bool {
            switch (book.get(user)) {
                case (?balance) return balance >= amount;
                case null return false;
            };
        }
    }
}
