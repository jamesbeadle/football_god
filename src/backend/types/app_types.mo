import Base "mo:waterway-mops/BaseTypes";
import Text "mo:base/Text";
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
        #FailedInterCanisterCall;
    };

    public type Profile = {
        principalId : Base.PrincipalId;
        termsAcceptedDate: Int;
        username : Text; 
        profilePicture: ?Blob;
        profilePictureExtension: Text;
        withdrawalAddress: Text;
        joinedDate: Int;
    };

};
