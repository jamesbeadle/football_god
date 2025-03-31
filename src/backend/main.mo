
/* ----- Mops Packages ----- */

import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Timer "mo:base/Timer";


/* ----- Canister Definition Files ----- */

/* ----- Queries ----- */

/* ----- Commands ----- */

/* ----- Managers ----- */


/* ----- Only Stable Variables Should Use Types ----- */
import Base "mo:waterway-mops/BaseTypes";
import Ids "mo:waterway-mops/Ids";
import BaseTypes "mo:waterway-mops/BaseTypes";
import BaseQueries "mo:waterway-mops/queries/BaseQueries";
import T "types/app_types";


/* ----- Application Environment & Utility Files ----- */ 
import Environment "environment";
import AppQueries "./queries/app_queries";


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
  
  public shared query func getAppStatus(dto: BaseQueries.GetAppStatus) : async Result.Result<BaseQueries.AppStatus, T.Error> {
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
      stable_profile_canister_ids := userManager.getStableProfileCanisterIds(); // TODO: John, let's see what's here, remove and get cycles back
      stable_unique_profile_canister_ids := userManager.getStableUniqueProfileCanisterIds();
      stable_active_profile_canister_id := userManager.getStableActiveProfileCanisterId();
      stable_usernames := userManager.getStableUsernames();
  };

  private func setManagerStableVariables(){
    userManager.setStableProfileCanisterIds(stable_profile_canister_ids);
    userManager.setStableUniqueProfileCanisterIds(stable_unique_profile_canister_ids);
    userManager.setStableActiveProfileCanisterId(stable_active_profile_canister_id);
    userManager.setStableUsernames(stable_usernames);
  };

  private func postUpgradeCallback() : async (){
  };


  /* ----- Dynamic Canister Wasm Upgrade Functions ----- */ 

};
