import Text "mo:base/Text";
module ShuftiTypes {

    public type ShuftiResponse = {
        #ShuftiAcceptedResponse : ShuftiAcceptedResponse;
        #ShuftiRejectedResponse : ShuftiRejectedResponse ;
    };

    public type ShuftiAcceptedResponse = {
        reference: Text;
        event: Text;
    };

    public type ShuftiRejectedResponse = {
        reference: Text;
        event: Text;
    };

};
