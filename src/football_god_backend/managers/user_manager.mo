import Result "mo:base/Result";
import List "mo:base/List";
import Text "mo:base/Text";
import Nat64 "mo:base/Nat64";
import Blob "mo:base/Blob";
import Buffer "mo:base/Buffer";
import Array "mo:base/Array";
import Account "../utilities/Account";
import T "../types/app_types";
import Base "../types/base_types";
import RequestDTOs "../dtos/request_DTOs";
import ResponseDTOs "../dtos/response_DTOs";
import BettingTypes "../types/betting_types";

module {

  public class UserManager() {

    private var profileCanisterIds: [(Base.PrincipalId, Base.CanisterId)] = [];
    private var uniqueProfileCanisterIds: [Base.CanisterId] = [];
    private var activeProfileCanisterId = "";

    public func getProfile(principalId : Text) : async Result.Result<ResponseDTOs.ProfileDTO, T.Error> {
      await checkOrCreateProfile(principalId);
      let profileCanisterId = Array.find(profileCanisterIds, func(profileCanisterEntry: (Base.PrincipalId, Base.CanisterId)) : Bool {
        profileCanisterEntry.0 == principalId;
      });

      switch(profileCanisterId){
        case (?foundCanisterId){
          let profile_canister = actor (foundCanisterId.1) : actor {
            getProfile : (principalId : Text) -> async Result.Result<ResponseDTOs.ProfileDTO, T.Error>;
          };
          return await profile_canister.getProfile(principalId);
        };
        case (null){
          return #err(#NotFound);
        }
      };
    };
      
    public func updateUsername(dto: RequestDTOs.UpdateUsernameDTO) : async Result.Result<(), T.Error> {
      await checkOrCreateProfile(dto.principalId);
      return #err(#NotFound); //TODO
    };

    public func updateProfilePicture(dto: RequestDTOs.UpdateProfilePictureDTO) : async Result.Result<(), T.Error> {
      await checkOrCreateProfile(dto.principalId);
      return #err(#NotFound); //TODO
    };

    public func updateWithdrawalAddress(dto: RequestDTOs.UpdateWithdrawalAddressDTO) : async Result.Result<(), T.Error> {
      await checkOrCreateProfile(dto.principalId);
      if(not validWithdrawalAddress(dto.withdrawalAddress)){
        return #err(#NotAllowed);
      };
      let userProfileCanisterId = Array.find<(Base.PrincipalId, Base.CanisterId)>(profileCanisterIds, func(entry: (Base.PrincipalId, Base.CanisterId)) : Bool {
        entry.0 == dto.principalId;
      });

      switch(userProfileCanisterId){
        case (?foundCanisterId){

          //create an instance of the user profile canister and call update method
          

          return #ok();
        };
        case (null){
          return #err(#NotFound);
        }
      }
    };

    public func pauseAccount(dto: RequestDTOs.PauseAccountDTO) : async Result.Result<(), T.Error> {
      await checkOrCreateProfile(dto.principalId);
      return #err(#NotFound); //TODO
    };

    public func setMaxBetLimit(dto: RequestDTOs.SetMaxBetLimit) : async Result.Result<(), T.Error> {
      await checkOrCreateProfile(dto.principalId);
      
      //When set, it cannot be increased for 30 days.

      //TODO: Cannot change if changed or set in the last 30 days
      return #err(#NotFound); //TODO
    };

    public func setMonthlyBetLimit(dto: RequestDTOs.SetMonthlyBetLimitDTO) : async Result.Result<(), T.Error> {
      await checkOrCreateProfile(dto.principalId);
      
      //When set, it cannot be increased for 30 days.
     
    //TODO: Cannot change if changed or set in the last 30 days
      return #err(#NotFound); //TODO
    };

    public func placeBet(dto: RequestDTOs.SubmitBetslipDTO) : async Result.Result<BettingTypes.BetSlip, T.Error> {
      await checkOrCreateProfile(dto.principalId);
      return #err(#NotFound); //TODO
      //private function to update monthly bet totals should be added when a bet is placed
    };

    public func settleBet(betslip: BettingTypes.BetSlip) : async () {

      //Get the fixture from the data canister

      //Evaluate each selection on each betslip in accordance with the bet type to determine winnings

      //Pay winnings to user

      //Settle the bet win lose with winnings if applicable in users canister

      //Update the users totals for months etc
    };

    public func getBets(dto: RequestDTOs.GetBetsDTO) : async Result.Result<(), T.Error>{
      return #err(#NotFound); //TODO
    };

    private func checkOrCreateProfile(principalId: Base.PrincipalId) : async () {
      //TODO
    };

    //TODO: ADD WITHDRAWAL CODE

    private func validWithdrawalAddress(withdrawalAddress : Text) : Bool {
      let account_id = Account.decode(withdrawalAddress);
      switch account_id {
        case (#ok array) {
          if (Account.validateAccountIdentifier(Blob.fromArray(array))) {
            return true;
          };
        };
        case (#err _) { return false; };
      };
      return false;
    };

    //Stable storage functions

    public func getStableProfileCanisterIds() : [(Base.PrincipalId, Base.CanisterId)] {
      return profileCanisterIds;
    };

    public func setStableProfileCanisterIds(stable_profile_canister_ids: [(Base.PrincipalId, Base.CanisterId)]) {
      profileCanisterIds := stable_profile_canister_ids;
    };

    public func getStableUniqueProfileCanisterIds () : [Base.CanisterId] {
      return uniqueProfileCanisterIds;
    };

    public func setStableUniqueProfileCanisterIds(stable_unique_profile_canister_ids: [Base.CanisterId]){
      uniqueProfileCanisterIds := stable_unique_profile_canister_ids;
    };

    public func getStableActiveProfileCanisterId() : Base.CanisterId {
      return activeProfileCanisterId;
    };

    public func setStableActiveProfileCanisterId(stable_active_profile_canister_id: Base.CanisterId) {
      activeProfileCanisterId := stable_active_profile_canister_id;
    };

  };
};
