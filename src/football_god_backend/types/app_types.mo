import Base "base_types";
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
        maxBetLimit: Nat64;
        monthlyBetLimit: Nat64;
        monthlyBetTotals: [(Nat16, (Base.CalendarMonth, Nat64))];
    };

};
