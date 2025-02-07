

# Set current directory to the directory this script is in
SCRIPT=$(readlink -f "$0")
SCRIPT_DIR=$(dirname "$SCRIPT")
cd $SCRIPT_DIR

PROPOSAL="(
    record {
        title = \"Remove Callback Function\";          
        url = \"https://github.com/jamesbeadle/football_god/blob/master/src/data_canister/main.mo\";        
        summary = \"Proposal to remove the old validateRetirePlayer endpoint under function id 14000.\";
        action = opt variant {
            RemoveGenericNervousSystemFunction = 14000 : nat64
        };
    }
)"

../../utils/submit_proposal.sh "$PROPOSAL"
