import Timer "mo:base/Timer";
import Int "mo:base/Int";
import Result "mo:base/Result";
import ResponseDTOs "../dtos/response_DTOs";
import RequestDTOs "../dtos/request_DTOs";
import T "../types/app_types";
import BettingTypes "../types/betting_types";
import Base "../types/base_types";
actor class _ProfileCanister() {
  
//500 Profiles per canister
//setMaxBetLimit    
//setMonthlyBetLimit
    //When set, it cannot be increased for 30 days.
//placeBet
     //private function to update monthly bet totals should be added when a bet is placed
//updateSettledBet
    //Update the users totals for months etc

  public shared ({caller }) func getProfile(principalId: Text) : async Result.Result<ResponseDTOs.ProfileDTO, T.Error>{
    return #err(#NotFound);
  };

  public shared ({caller }) func updateUsername(dto: RequestDTOs.UpdateUsernameDTO) : async Result.Result<(), T.Error>{
    return #err(#NotFound);
  };

  public shared ({caller }) func updateProfilePicture(dto: RequestDTOs.UpdateProfilePictureDTO) : async Result.Result<(), T.Error>{
    return #err(#NotFound);
  };
  
  public shared ({caller }) func updateWithdrawalAddress(dto: RequestDTOs.UpdateWithdrawalAddressDTO) : async Result.Result<(), T.Error>{
    return #err(#NotFound);
  };
  
  public shared ({caller }) func pauseAccount(dto: RequestDTOs.PauseAccountDTO) : async Result.Result<(), T.Error>{
    return #err(#NotFound);
  };
  
  public shared ({caller }) func setMaxBetLimit(dto: RequestDTOs.SetMaxBetLimit) : async Result.Result<(), T.Error>{
    return #err(#NotFound);
  };
  
  public shared ({caller }) func setMonthlyBetLimit(dto: RequestDTOs.SetMonthlyBetLimitDTO) : async Result.Result<(), T.Error>{
    return #err(#NotFound);
  };
  
  public shared ({caller }) func placeBet(dto: RequestDTOs.SubmitBetslipDTO) : async Result.Result<BettingTypes.BetSlip, T.Error>{
    return #err(#NotFound);
  };
  
  public shared ({caller }) func getBets(dto: RequestDTOs.GetBetsDTO) : async Result.Result<[BettingTypes.BetSlip], T.Error>{
    return #err(#NotFound);
  };
  
  public shared ({caller }) func updateSettledBet(principalId: Base.PrincipalId, betslip: BettingTypes.BetSlip) : async (){
    
  };
  
  public shared ({caller }) func createProfile(principalId: Text) : async Result.Result<(), T.Error>{
    return #err(#NotFound);
  };
  
  public shared ({caller }) func canisterFull() : async Bool{
    return false; //TODO
  };
  
  public shared ({caller }) func voidBet(betslip: BettingTypes.BetSlip) : async (){

  };

  system func preupgrade() {
  };

  system func postupgrade() {
    ignore Timer.setTimer<system>(#nanoseconds(Int.abs(1)), postUpgradeCallback); 
  };
  
  private func postUpgradeCallback() : async (){
    
  };
};