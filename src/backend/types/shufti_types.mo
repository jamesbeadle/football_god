import Text "mo:base/Text";
module ShuftiTypes {

    public type ShuftiResponse = {
        #ShuftiAcceptedResponse : ShuftiAcceptedResponse;
        #ShuftiRejectedResponse : ShuftiRejectedResponse ;
    };

    public type ShuftiAcceptedResponse = {
        reference: Text;
        event: Text;
        verification_result: ShuftiVerificationResponse;
        verification_data: ShuftiVerificationData;
        info: ShuftiVerificationInfo;
        additional_data: ShuftiAdditionalData;
    };

    public type ShuftiVerificationResponse = 
    {
        face: {
            face: Int
        };
        document: {
            name: Int;
            dob: Int;
            age: Int;
            expiry_date: Int;
            issue_date: Int;
            document_number: Int;
            document: Int;
            gender  : Text
        };
        address: {
            name: Int;
            full_address: Int;
        };
    };

    public type ShuftiVerificationData =
    {
        face: {
            duplicate_account_detected : Text;
        };
        document: {
            name: {
                first_name: Text;
                middle_name: Text;
                last_name: Text;
            };
            dob: Text;
            age:  Int;
            issue_date: Text;
            expiry_date: Text;
            document_number: Text;
            selected_type: [Text];
            supported_types: [Text];
            gender:  Text;
        };
        address: {
            name: {
                first_name: Text;
                middle_name: Text;
                last_name: Text
            };
            full_address: Text;
            selected_type: [Text];
            supported_types: [Text]
            }
        };

        public type ShuftiVerificationInfo = 
        {
            agent: {
                is_desktop: Bool;
                is_phone: Bool;
                useragent: Text;
                device_name: Text;
                browser_name: Text;
                platform_name: Text
            };
            geolocation: {
                host: Text;
                ip: Text;
                rdns: Text;
                asn: Text;
                isp: Text;
                country_name: Text;
                country_code: Text;
                region_name: Text;
                region_code: Text;
                city: Text;
                postal_code: Text;
                continent_name: Text;
                continent_code: Text;
                latitude: Text;
                longitude: Text;
                metro_code: Text;
                timezone: Text;
            }
        };

        public type ShuftiAdditionalData =
         {
            document: {
                proof: {
                    height: Text;
                    country: Text;
                    authority: Text;
                    last_name: Text;
                    first_name: Text;
                    issue_date: Text;
                    expiry_date: Text;
                    nationality: Text;
                    country_code: Text;
                    document_type: Text;
                    place_of_birth: Text;
                    document_number: Text;
                    personal_number: Text;
                    dob: Text;
                    age:  Int;
                    gender:  Text;
                }
            }
        };

        public type ShuftiRejectedResponse = {

        };

};
