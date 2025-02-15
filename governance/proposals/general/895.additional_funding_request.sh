#!/bin/bash

# Set current directory to the directory this script is in
SCRIPT=$(readlink -f "$0")
SCRIPT_DIR=$(dirname "$SCRIPT")
cd $SCRIPT_DIR

# Call the function to configure the neuron that has just been created

echo "Transfer funds Waterway Labs"

PROPOSAL="(
    record {  
        title = \"Transfer 2,500 ICP to Waterway Labs\";  
        url = \"https://waterwaylabs.xyz\";  
        summary = \"
            Now Waterway Labs has completed the required gambling license video:
            
            https://x.com/beadle1989/status/1890034598807322824

            We will incur further costs related to the provisioning of services in Alderney. 

            All code for the betting site has now been moved into our upcoming AI Agent driven betting site, Jeff Bets.

            We continue to develop our football ecosystem, with an announcement to come about a rebranding we would like to undertake to better encompass the tokenised experiences we have built (OpenFPL, Jeff Bets, FootballGod, OpenWSL & ICPFA).

            Branding for JeffBets has been completed and can be seen in the following post:

            https://x.com/beadle1989/status/1889561106139468042

            Due to market volatility, increasing expenditure as we grow, further funding requests will follow.
             
        \";
        action = opt variant {  
            TransferSnsTreasuryFunds = record {
                from_treasury=1:int32; 
                amount_e8s=250000000000:nat64; 
                to_principal=opt principal \"agy5w-dlcen-pkrgo-pgfrz-3eqf2-xfwvr-qcvwn-nlhyu-77fsb-wgc37-nqe\"; 
                to_subaccount = null;
                memo=null;   
            }
        };  
    })"

../../utils/submit_proposal.sh "$PROPOSAL"
