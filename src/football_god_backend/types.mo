import List "mo:base/List";

module Types {

    public type PrincipalId = Text;

    public type Error = {
        #NotFound;
        #AlreadyExists;
        #NotAuthorized;
        #NotAllowed;
        #DecodeError;
    };

    public type DataCache = {
        category : Text;
        hash : Text;
    };



};
