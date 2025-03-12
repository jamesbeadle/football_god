
#!/bin/bash

# Set current directory to the directory this script is in
SCRIPT=$(readlink -f "$0")
SCRIPT_DIR=$(dirname "$SCRIPT")
cd $SCRIPT_DIR

PROPOSAL="(
    record {  
        title = \"Motion to rebrand OpenFPL as ICFC.\";  
        url = \"https://icfc.app/whitepaper\";  
        summary = \"
            OpenFPL began as a simple fantasy football application which has quickly evolved into an ecosystem of apps.

            We believe it is time to rebrand OpenFPL to ICFC (Internet Computer Football Club).

            Please read the following whitepaper:
            https://icfc.app/whitepaper\

            And see the team announcement for further information:
            https://x.com/zbeadle/status/1899063862994907295?s=46&t=61fjP31_VSWWbuw4RAlnAg
            
            Passing of this proposal confirms the DAO's wish for us to rebrand OpenFPL and rename the DAO and it's utility token to ICFC.

            This proposal also confirms the DAO's agreement to proceed with a second decentralisation sale, decentralising a further 25M ICFC tokens from the DAO's treasury.    
        \";
        action = opt variant {  
        Motion = record {  
            motion_text = \"
            OpenFPL began as a simple fantasy football application which has quickly evolved into an ecosystem of apps.

            We believe it is time to rebrand OpenFPL to ICFC (Internet Computer Football Club).

            Please read the following whitepaper:
            https://icfc.app/whitepaper\

            And see the team announcement for further information:
            https://x.com/zbeadle/status/1899063862994907295?s=46&t=61fjP31_VSWWbuw4RAlnAg
            
            Passing of this proposal confirms the DAO's wish for us to rebrand OpenFPL and rename the DAO and it's utility token to ICFC.

            This proposal also confirms the DAO's agreement to proceed with a second decentralisation sale, decentralising a further 25M ICFC tokens from the DAO's treasury.
        \";  
        }  
    };  
})"

../../utils/submit_proposal.sh "$PROPOSAL"
