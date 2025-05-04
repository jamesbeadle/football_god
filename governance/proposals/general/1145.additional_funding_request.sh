#!/bin/bash

# Set current directory to the directory this script is in
SCRIPT=$(readlink -f "$0")
SCRIPT_DIR=$(dirname "$SCRIPT")
cd $SCRIPT_DIR

# Call the function to configure the neuron that has just been created

echo "Transfer funds Waterway Labs"

PROPOSAL="(
    record {  
        title = \"Transfer 1,000 ICP to Waterway Labs\";  
        url = \"https://waterwaylabs.xyz\";  
        summary = \"
            This funding request is for the on-going costs incurred by Waterway Labs in relation to the development of the ICFC ecosystem.

            As this is the last of our available funding, we want to assure people that the ICFC ecosystem will continue to be developed.

            The company has no more overheads, key members of staff like John & Kelly will continue in their respective roles - ensuring we still have a team to deliver everything we need. 

            We will attempt an ICGC SNS soon and react to the outcome of that to obtain more funding.

            Waterway Labs has also invested in future projects, holding designs for ICF1, OpenBook, OpenBeats and others - we aim to monetise these in due course to obtain more funding.

            John and I are also training an AI to build DAOs based on the programming design patterns we are implementing, 
            this will be used to assist with the development of our projects, deliver new features and we hope become a further revenue stream so we can promote ICFC etc.  
        \";
        action = opt variant {  
            TransferSnsTreasuryFunds = record {
                from_treasury=1:int32; 
                amount_e8s=100000000000:nat64; 
                to_principal=opt principal \"agy5w-dlcen-pkrgo-pgfrz-3eqf2-xfwvr-qcvwn-nlhyu-77fsb-wgc37-nqe\"; 
                to_subaccount = null;
                memo=null;   
            }
        };  
    })"

../../utils/submit_proposal.sh "$PROPOSAL"
