import Timer "mo:base/Timer";
import Int "mo:base/Int";
//500 Profiles per canister
//setMaxBetLimit    
//setMonthlyBetLimit
    //When set, it cannot be increased for 30 days.
//placeBet
     //private function to update monthly bet totals should be added when a bet is placed

actor class _ProfileCanister() {

    

  system func preupgrade() {
  };

  system func postupgrade() {
    ignore Timer.setTimer<system>(#nanoseconds(Int.abs(1)), postUpgradeCallback); 
  };
  
  private func postUpgradeCallback() : async (){
    
  };

};
