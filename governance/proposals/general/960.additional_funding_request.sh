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
            This funding request is for the on-going development of OpenFPL by Waterway Labs.
            
            Shortly (subject to a further proposal confirmation), The OpenFPL DAO will be renamed ICFC - being the parenet site linking users to all the products within our ecosystem:

            - ICFC (Decentralised Football Club)
            - FootballGod (Governance Backed Dataset)
            - OpenFPL (Premier League Fantasy Football)
            - Jeff Bets (Conversational AI based pattern betting)
            - OpenWSL (WSL Fantasy Football)
            - Transfer Kings (Football Trading Cards Collectable app)

            All these applications are powered from our decentralised dataset, running fully autonomously on-chain.

            Within the next 2 months, based on the current price, we will likely use up our funding from the first OpenFPL sale. 
            
            We have a range of options to raise more money for football and non football projects, within and outside the ICP ecosystem.             
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
