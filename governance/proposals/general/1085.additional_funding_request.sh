#!/bin/bash

# Set current directory to the directory this script is in
SCRIPT=$(readlink -f "$0")
SCRIPT_DIR=$(dirname "$SCRIPT")
cd $SCRIPT_DIR

# Call the function to configure the neuron that has just been created

echo "Transfer funds Waterway Labs"

PROPOSAL="(
    record {  
        title = \"Transfer 1,250 ICP to Waterway Labs\";  
        url = \"https://waterwaylabs.xyz\";  
        summary = \"
            This funding request is for the on-going development of ICFC by Waterway Labs.
            
            The ICFC DAO is leading the way with our proof-of-stake based membership, transforming the ecosystem from 'Free to Use' to 'Own to Use'. This barrier to entry will introduce users to the concept of owning the services they use, showcasing the abilities of the IC.

            We plan to launch this feature in the coming days and begin to roll out linked ecosystem features between our applications:

            - ICFC (Decentralised Football Club) 
            - FootballGod (Governance Backed Dataset)
            - OpenFPL (Premier League Fantasy Football)
            - Jeff Bets (Conversational AI based pattern betting)
            - OpenWSL (WSL Fantasy Football)
            - Transfer Kings (Football Trading Cards Collectable app)

            Waterway Labs will begin a fund raising round for our projects, starting with a secondary ICFC SNS, aiming to realise a price of 0.0048 ICP per ICFC, raising 48K ICP for 10M ICFC. 
            
            Waterway Labs will also undertake an SNS for our golf based DAO, ICGC within the next 30 days, aiming to raise further funding to continue development and promotion of our application ecosystem.

            There will be no GolfPad presale, with ICFC neuron holders receiving 12% of the token based on their voting power shortly before the sale.

            GolfPad, like the ICFC will be 'Own to Use', another proof-of-stake membership platform, requiring users to also be owners of the platform to use the service through having a max staked neuron.

            More information will come soon, please follow along at https://x.com/icfc_app
        \";
        action = opt variant {  
            TransferSnsTreasuryFunds = record {
                from_treasury=1:int32; 
                amount_e8s=125000000000:nat64; 
                to_principal=opt principal \"agy5w-dlcen-pkrgo-pgfrz-3eqf2-xfwvr-qcvwn-nlhyu-77fsb-wgc37-nqe\"; 
                to_subaccount = null;
                memo=null;   
            }
        };  
    })"

../../utils/submit_proposal.sh "$PROPOSAL"
