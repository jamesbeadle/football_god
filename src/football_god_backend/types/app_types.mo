import Base "base_types";
import BettingTypes "betting_types";
module AppTypes {

    public type Error = {
        #NotFound;
        #AlreadyExists;
        #NotAuthorized;
        #NotAllowed;
        #DecodeError;
    };

    public type Profile = {
        principalId : Base.PrincipalId;
        username : Text; 
        profilePicture: ?Blob;
        withdrawalAddress: Text;
        completedKYC: Bool;
        accountOnPause: Bool;
        pauseDays: Nat;
        maxBetLimit: Nat64;
        maxBetLimitSet: Int;
        monthlyBetLimit: Nat64;
        monthlyBetLimitSet: Nat64;
        monthlyBetTotals: [(Nat16, (Base.CalendarMonth, Nat64))];
        monthlyProfitLoss: [(Nat16, (Base.CalendarMonth, Nat64))];
        bets: [BettingTypes.BetSlip];
        termsAccepted: Bool;
        termsAcceptedOn: Int;
    };

};
