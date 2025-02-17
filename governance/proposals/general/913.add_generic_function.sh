

# Set current directory to the directory this script is in
SCRIPT=$(readlink -f "$0")
SCRIPT_DIR=$(dirname "$SCRIPT")
cd $SCRIPT_DIR

PROPOSAL="(
    record {
        title = \"Create Move Fixture Callback Function\";          
        url = \"https://github.com/jamesbeadle/football_god/blob/master/src/data_canister/main.mo\";        
        summary = \"Proposal to create the endpoint for adding the callback function to move a fixture within the data canister.\";
        action = opt variant {
            AddGenericNervousSystemFunction = record {
                id = 61000 : nat64;
                name = \"Move Fixture\";
                description = opt \"Function to move a fixture.\";
                function_type = opt variant { 
                    GenericNervousSystemFunction = record { 
                        validator_canister_id = opt principal \"52fzd-2aaaa-aaaal-qmzsa-cai\"; 
                        target_canister_id = opt principal \"52fzd-2aaaa-aaaal-qmzsa-cai\"; 
                        validator_method_name = opt \"validateMoveFixture\";                         
                        target_method_name = opt \"moveFixture\";
                    } 
                };
            }
        };
    }
)"

../../utils/submit_proposal.sh "$PROPOSAL"
