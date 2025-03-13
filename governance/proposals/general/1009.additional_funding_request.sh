#!/bin/bash

# Set current directory to the directory this script is in
SCRIPT=$(readlink -f "$0")
SCRIPT_DIR=$(dirname "$SCRIPT")
cd $SCRIPT_DIR

# Call the function to configure the neuron that has just been created

echo "Transfer funds Waterway Labs"

PROPOSAL="(
    record {  
        title = \"Transfer 2,000 ICP to Waterway Labs\";  
        url = \"https://waterwaylabs.xyz\";  
        summary = \"
            This funding request is for the on-going development of OpenFPL by Waterway Labs.
            
            OpenFPL DAO has now been renamed ICFC - being the parenet site linking users to all the products within our ecosystem:

            - ICFC (Decentralised Football Club)
            - FootballGod (Governance Backed Dataset)
            - OpenFPL (Premier League Fantasy Football)
            - Jeff Bets (Conversational AI based pattern betting)
            - OpenWSL (WSL Fantasy Football)
            - Transfer Kings (Football Trading Cards Collectable app)

            All these applications are powered from our decentralised dataset, running fully autonomously on-chain.

            The only update we have on the gambling license is there are no issues and we are expecting costs to come through at any moment to finalise this process.

            Base on the continual drop of the price of ICP, our runway is short and intend to monetise the GolfPad project within the next 30 days.
            
            There will be no GolfPad presale, with ICFC neuron holders receiving 12% of the token based on their voting power shortly before the sale.

            GolfPad, like the ICFC will be a proof-of-stake membership platform, requiring users to also be owners of the platform to use the service through having a max staked neuron.

            More information will come soon, please follow along at https://x.com/icfc_app
        \";
        action = opt variant {  
            TransferSnsTreasuryFunds = record {
                from_treasury=1:int32; 
                amount_e8s=200000000000:nat64; 
                to_principal=opt principal \"agy5w-dlcen-pkrgo-pgfrz-3eqf2-xfwvr-qcvwn-nlhyu-77fsb-wgc37-nqe\"; 
                to_subaccount = null;
                memo=null;   
            }
        };  
    })"

../../utils/submit_proposal.sh "$PROPOSAL"
