

dfx canister --ic call detjl-sqaaa-aaaaq-aacqa-cai manage_neuron '(
  record {
    subaccount = blob "d2ccf59abe1741c21c35da7e3863d5d14c97d9b82b36045f4a8d4c336864f6dc";
    command = opt variant {
      MakeProposal = record {
        title = "Create Update Club Callback Function";          
        url = "https://github.com/jamesbeadle/football_god/blob/master/src/data_canister/main.mo";        
        summary = "Proposal to create the endpoint for adding the callback function to update a club within the data canister.";
        action = opt variant {
            AddGenericNervousSystemFunction = record {
                id = 62000 : nat64;
                name = "Update Club";
                description = opt "Function to update a club.";
                function_type = opt variant { 
                    GenericNervousSystemFunction = record { 
                        topic = opt variant { ApplicationBusinessLogic };
                        validator_canister_id = opt principal "52fzd-2aaaa-aaaal-qmzsa-cai"; 
                        target_canister_id = opt principal "52fzd-2aaaa-aaaal-qmzsa-cai"; 
                        validator_method_name = opt "validateUpdateClub";                         
                        target_method_name = opt "updateClub";
                    } 
                };
            }
        };
      }
    };
  },
)'