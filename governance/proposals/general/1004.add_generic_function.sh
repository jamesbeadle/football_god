

# Set current directory to the directory this script is in
SCRIPT=$(readlink -f "$0")
SCRIPT_DIR=$(dirname "$SCRIPT")
cd $SCRIPT_DIR

PROPOSAL="(
    record {
        title = \"Create Postpone Fixture Callback Function\";          
        url = \"https://github.com/jamesbeadle/football_god/blob/master/src/data_canister/main.mo\";        
        summary = \"Proposal to create the endpoint for adding the callback function to postpone a fixture within the data canister.\";
        action = opt variant {
            AddGenericNervousSystemFunction = record {
                id = 65000 : nat64;
                name = \"Postpone a Fixture\";
                description = opt \"Function to postpone a fixture.\";
                function_type = opt variant { 
                    GenericNervousSystemFunction = record { 
                        topic = opt variant { ApplicationBusinessLogic };
                        validator_canister_id = opt principal \"52fzd-2aaaa-aaaal-qmzsa-cai\"; 
                        target_canister_id = opt principal \"52fzd-2aaaa-aaaal-qmzsa-cai\"; 
                        validator_method_name = opt \"validatePostponeFixture\";                         
                        target_method_name = opt \"postponeFixture\";
                    } 
                };
            }
        };
    }
)"

../../utils/submit_proposal.sh "$PROPOSAL"
