
/* ----- Mops Packages ----- */

import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Timer "mo:base/Timer";


/* ----- Canister Definition Files ----- */

import ProfileCanister "canister_definitions/profile-canister";


/* ----- Queries ----- */

/* ----- Commands ----- */

/* ----- Managers ----- */

import UserManager "managers/user_manager";


/* ----- Only Stable Variables Should Use Types ----- */
import Base "mo:waterway-mops/BaseTypes";
import FootballTypes "mo:waterway-mops/FootballTypes";
import T "types/app_types";


/* ----- Application Environment & Utility Files ----- */ 
import Environment "environment";


actor Self {


  /* ----- Stable Canister Variables ----- */ 

  private stable var stable_profile_canister_ids: [(Base.PrincipalId, Base.CanisterId)] = [];
  private stable var stable_unique_profile_canister_ids: [Base.CanisterId] = [];
  private stable var stable_active_profile_canister_id: Text = "";
  private stable var stable_app_status: MopsTypes.AppStatus = { 
    onHold = true; 
    version = ""; 
  };  


  /* ----- Domain Object Managers ----- */ 

  private let userManager = UserManager.UserManager(); 
  
  
  /* ----- General App Queries ----- */
  
  public shared query func getAppStatus() : async Result.Result<ResponseDTOs.AppStatusDTO, T.Error> {
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
