import Base "base_types";
import BettingTypes "betting_types";
import Text "mo:base/Text";
import ShuftiTypes "shufti_types";
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
        termsAcceptedDate: Int;
        username : Text; 
        profilePicture: ?Blob;
        profilePictureExtension: Text;
        withdrawalAddress: Text;
        joinedDate: Int;
        accountOnPause: Bool;
        pauseEndDate: Int;
        maxBetLimit: Nat64;
        maxBetLimitSet: Int;
        monthlyBetLimit: Nat64;
        monthlyBetLimitSet: Int;
        monthlyBetTotals: [(Nat16, [(Base.CalendarMonth, Nat64)])];
        monthlyProfitLoss: [(Nat16, [(Base.CalendarMonth, Nat64)])];
        bets: [BettingTypes.BetSlip];
        kycComplete: Bool;
        kycSubmissionDate: Int;
        kycApprovalDate: Int;
        kycRef: Text;
    };

    public type KYCProfile = {
        principalId: Base.PrincipalId;
        reference: Text;
        shuftiResponse: ?ShuftiTypes.ShuftiResponse;
        kycSubmissionDate: Int;
        kycApprovalDate: Int;
    }

};
