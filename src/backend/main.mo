
/* ----- Mops Packages ----- */

import Int "mo:base/Int";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Timer "mo:base/Timer";


/* ----- Canister Definition Files ----- */

/* ----- Queries ----- */

/* ----- Commands ----- */

/* ----- Managers ----- */


/* ----- Only Stable Variables Should Use Types ----- */
import Ids "mo:waterway-mops/Ids";
import BaseTypes "mo:waterway-mops/BaseTypes";
import BaseQueries "mo:waterway-mops/queries/BaseQueries";
import Enums "mo:waterway-mops/Enums";


/* ----- Application Environment & Utility Files ----- */ 

actor Self {


  /* ----- Stable Canister Variables ----- */ 

  private stable var stable_profile_canister_ids: [(Ids.PrincipalId, Ids.CanisterId)] = [];
  private stable var stable_unique_profile_canister_ids: [Ids.CanisterId] = [];
  private stable var stable_active_profile_canister_id: Text = "";
  private stable var stable_app_status: BaseTypes.AppStatus = { 
    onHold = true; 
    version = ""; 
  };  


  /* ----- Domain Object Managers ----- */
  
  
  /* ----- General App Queries ----- */
  
  public shared query func getAppStatus(dto: BaseQueries.GetAppStatus) : async Result.Result<BaseQueries.AppStatus, Enums.Error> {
    return #ok(stable_app_status);
  };

  
  /* ----- Canister Lifecycle Management ----- */
  
  system func preupgrade() {
    getManagerStableVariables();

  };

  system func postupgrade() {
    setManagerStableVariables();

  
    ignore Timer.setTimer<system>(#nanoseconds(Int.abs(1)), postUpgradeCallback); 
  };

  private func getManagerStableVariables(){
  };

  private func setManagerStableVariables(){
  };

  private func postUpgradeCallback() : async (){
  };


  /* ----- Dynamic Canister Wasm Upgrade Functions ----- */ 

};
