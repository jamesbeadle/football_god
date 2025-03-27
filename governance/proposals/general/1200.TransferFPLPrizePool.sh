#!/bin/bash

# Set current directory to the directory this script is in
SCRIPT=$(readlink -f "$0")
SCRIPT_DIR=$(dirname "$SCRIPT")
cd $SCRIPT_DIR

# Call the function to configure the neuron that has just been created

echo "Transfer"

PROPOSAL="(
    record {  
        title = \"Transfer 10M ICFC to the ICFC backend canister for a 2nd SNS.\";  
        url = \"https://nns.ic0.app/proposal/?u=gyito-zyaaa-aaaaq-aacpq-cai&proposal=86\";  
        summary = \"
            Transfer 10,000,000 ICFC to the ICFC backend canister for a secondary decentralisation sale with a price of 0.0048 ICP per ICFC, 
            raising 48,000 ICP from 10,000,000 ICFC.

            Tokens from this decentralisation sale will be distributed to participants:
            - 1/6 - 3 months after the sale completes.
            - 2/6 to 6/6 - 5 X 6 month intervals after the initial token distribution.
            
            Undistributed token balances will be visible via the ICFC site. 
            This process will enable us to add value to the project faster than people may potentially sell.

            We will target any future decentralisation sales at a higher price than this.
        \";
        action = opt variant {  
            TransferSnsTreasuryFunds = record {
               from_treasury=2:int32; 
               amount_e8s=1000000000000000:nat64; 
               to_principal=opt principal \"cfalf-4yaaa-aaaal-qshrq-cai\"; 
               to_subaccount=null; 
               memo=null;
            }  
        };  
    })"

../../utils/submit_proposal.sh "$PROPOSAL"
