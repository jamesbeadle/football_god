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
        withdrawalPrincipalId: Base.PrincipalId;
    };

};
