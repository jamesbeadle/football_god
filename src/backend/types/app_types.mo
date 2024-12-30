import Base "base_types";
import BettingTypes "betting_types";
module AppTypes {

    public type Error = {
        #NotFound;
        #AlreadyExists;
        #NotAuthorized;
        #NotAllowed;
        #DecodeError;
        #CanisterCreateError;
        #CanisterFull;
        #InvalidData;
    };

    public type Profile = {
        principalId : Base.PrincipalId;
        username : Text; 
        profilePicture: ?Blob;
        profilePictureExtension: Text;
        withdrawalAddress: Text;
        joinedDate: Int;
        completedKYC: Bool;
        kycReference: Text;
        kycSubmissionDate: Int;
        kycApprovalDate: Int;
        accountOnPause: Bool;
        pauseEndDate: Int;
        maxBetLimit: Nat64;
        maxBetLimitSet: Int;
        monthlyBetLimit: Nat64;
        monthlyBetLimitSet: Int;
        monthlyBetTotals: [(Nat16, [(Base.CalendarMonth, Nat64)])];
        monthlyProfitLoss: [(Nat16, [(Base.CalendarMonth, Nat64)])];
        bets: [BettingTypes.BetSlip];
        termsAccepted: Bool;
        termsAcceptedOn: Int;
    };

};
