import Result "mo:base/Result";
import List "mo:base/List";
import Text "mo:base/Text";
import Nat64 "mo:base/Nat64";
import Blob "mo:base/Blob";
import Buffer "mo:base/Buffer";
import Array "mo:base/Array";
import Option "mo:base/Option";
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
    private var usernames: [(Base.PrincipalId, Text)] = [];
    
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
      if(not validUsername(dto.username, dto.principalId)){
        return #err(#NotAllowed);
      };
      let userProfileCanisterId = Array.find<(Base.PrincipalId, Base.CanisterId)>(profileCanisterIds, func(entry: (Base.PrincipalId, Base.CanisterId)) : Bool {
        entry.0 == dto.principalId;
      });

      switch(userProfileCanisterId){
        case (?foundCanisterId){
          let profile_canister = actor (foundCanisterId.1) : actor {
            updateUsername : (dto: RequestDTOs.UpdateUsernameDTO) -> async Result.Result<(), T.Error>;
          };
          return await profile_canister.updateUsername(dto);
        };
        case (null){
          return #err(#NotFound);
        }
      };
    };

    public func updateProfilePicture(dto: RequestDTOs.UpdateProfilePictureDTO) : async Result.Result<(), T.Error> {
      await checkOrCreateProfile(dto.principalId);
      if(not validProfilePicture(dto.profilePicture)){
        return #err(#NotAllowed);
      };
      let userProfileCanisterId = Array.find<(Base.PrincipalId, Base.CanisterId)>(profileCanisterIds, func(entry: (Base.PrincipalId, Base.CanisterId)) : Bool {
        entry.0 == dto.principalId;
      });

      switch(userProfileCanisterId){
        case (?foundCanisterId){
          let profile_canister = actor (foundCanisterId.1) : actor {
            updateProfilePicture : (dto: RequestDTOs.UpdateProfilePictureDTO) -> async Result.Result<(), T.Error>;
          };
          return await profile_canister.updateProfilePicture(dto);
        };
        case (null){
          return #err(#NotFound);
        }
      };
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
          let profile_canister = actor (foundCanisterId.1) : actor {
            updateWithdrawalAddress : (dto: RequestDTOs.UpdateWithdrawalAddressDTO) -> async Result.Result<(), T.Error>;
          };
          return await profile_canister.updateWithdrawalAddress(dto);
        };
        case (null){
          return #err(#NotFound);
        }
      }
    };

    public func pauseAccount(dto: RequestDTOs.PauseAccountDTO) : async Result.Result<(), T.Error> {
      await checkOrCreateProfile(dto.principalId);
      let userProfileCanisterId = Array.find<(Base.PrincipalId, Base.CanisterId)>(profileCanisterIds, func(entry: (Base.PrincipalId, Base.CanisterId)) : Bool {
        entry.0 == dto.principalId;
      });

      switch(userProfileCanisterId){
        case (?foundCanisterId){
          let profile_canister = actor (foundCanisterId.1) : actor {
            pauseAccount : (dto: RequestDTOs.PauseAccountDTO) -> async Result.Result<(), T.Error>;
          };
          return await profile_canister.pauseAccount(dto);
        };
        case (null){
          return #err(#NotFound);
        }
      };
    };

    public func setMaxBetLimit(dto: RequestDTOs.SetMaxBetLimit) : async Result.Result<(), T.Error> {
      await checkOrCreateProfile(dto.principalId);
      let userProfileCanisterId = Array.find<(Base.PrincipalId, Base.CanisterId)>(profileCanisterIds, func(entry: (Base.PrincipalId, Base.CanisterId)) : Bool {
        entry.0 == dto.principalId;
      });

      switch(userProfileCanisterId){
        case (?foundCanisterId){
          let profile_canister = actor (foundCanisterId.1) : actor {
            setMaxBetLimit : (dto: RequestDTOs.SetMaxBetLimit) -> async Result.Result<(), T.Error>;
          };
          return await profile_canister.setMaxBetLimit(dto);
        };
        case (null){
          return #err(#NotFound);
        }
      };
    };

    public func setMonthlyBetLimit(dto: RequestDTOs.SetMonthlyBetLimitDTO) : async Result.Result<(), T.Error> {
      await checkOrCreateProfile(dto.principalId);
      let userProfileCanisterId = Array.find<(Base.PrincipalId, Base.CanisterId)>(profileCanisterIds, func(entry: (Base.PrincipalId, Base.CanisterId)) : Bool {
        entry.0 == dto.principalId;
      });

      switch(userProfileCanisterId){
        case (?foundCanisterId){
          let profile_canister = actor (foundCanisterId.1) : actor {
            setMonthlyBetLimit : (dto: RequestDTOs.SetMonthlyBetLimitDTO) -> async Result.Result<(), T.Error>;
          };
          return await profile_canister.setMonthlyBetLimit(dto);
        };
        case (null){
          return #err(#NotFound);
        }
      };
    };

    public func placeBet(dto: RequestDTOs.SubmitBetslipDTO) : async Result.Result<BettingTypes.BetSlip, T.Error> {
      await checkOrCreateProfile(dto.principalId);
      let userProfileCanisterId = Array.find<(Base.PrincipalId, Base.CanisterId)>(profileCanisterIds, func(entry: (Base.PrincipalId, Base.CanisterId)) : Bool {
        entry.0 == dto.principalId;
      });

      switch(userProfileCanisterId){
        case (?foundCanisterId){
          let profile_canister = actor (foundCanisterId.1) : actor {
            placeBet : (dto: RequestDTOs.SubmitBetslipDTO) -> async Result.Result<BettingTypes.BetSlip, T.Error>;
          };
          return await profile_canister.placeBet(dto);
        };
        case (null){
          return #err(#NotFound);
        }
      };
    };

    public func settleBet(betslip: BettingTypes.BetSlip) : async () {

      //Get the fixture from the data canister

      //Evaluate each selection on each betslip in accordance with the bet type to determine winnings

      //Pay winnings to user

      //Settle the bet win lose with winnings if applicable in users canister

      //Update the users totals for months etc
    };

    public func getBets(dto: RequestDTOs.GetBetsDTO) : async Result.Result<[BettingTypes.BetSlip], T.Error>{
      await checkOrCreateProfile(dto.principalId);
      let userProfileCanisterId = Array.find<(Base.PrincipalId, Base.CanisterId)>(profileCanisterIds, func(entry: (Base.PrincipalId, Base.CanisterId)) : Bool {
        entry.0 == dto.principalId;
      });

      switch(userProfileCanisterId){
        case (?foundCanisterId){
          let profile_canister = actor (foundCanisterId.1) : actor {
            getBets : (dto: RequestDTOs.GetBetsDTO) -> async Result.Result<[BettingTypes.BetSlip], T.Error>;
          };
          return await profile_canister.getBets(dto);
        };
        case (null){
          return #err(#NotFound);
        }
      };
    };

    private func checkOrCreateProfile(principalId: Base.PrincipalId) : async () {
      //ensure create and set active first profile canister
      //TODO
    };

    public func withdraw(dto: RequestDTOs.WithdrawDTO) : async Result.Result<(), T.Error> {

      //TODO: ADD WITHDRAWAL CODE
      return #err(#NotFound);
    };

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

    private func validUsername(username : Text, potentialPrincipalId: Base.PrincipalId) : Bool {

      if (Text.size(username) < 3 or Text.size(username) > 20) {
        return false;
      };

      let isAlphanumeric = func(s : Text) : Bool {
        let chars = Text.toIter(s);
        for (c in chars) {
          if (not ((c >= 'a' and c <= 'z') or (c >= 'A' and c <= 'Z') or (c >= '0' and c <= '9'))) {
            return false;
          };
        };
        return true;
      };

      if (not isAlphanumeric(username)) {
        return false;
      };

      //TODO: ALSO CHECK IF THE USERNAME IS ALREADY TAKEN
      let foundUsername = Array.find<(Base.PrincipalId, Text)>(usernames, func(entry: (Base.PrincipalId, Text)) : Bool {
        entry.1 == username and entry.0 != potentialPrincipalId;
      });

      if(Option.isSome(foundUsername)){
        return false;
      };


      return true;
    };

    private func validProfilePicture(profilePicture : Blob) : Bool {
      let sizeInKB = Array.size(Blob.toArray(profilePicture)) / 1024;
      return (sizeInKB > 0 and sizeInKB <= 500);
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

    public func getStableUsernames() : [(Base.PrincipalId, Text)] {
      return usernames;
    };

    public func setStableUsernames(stable_usernames: [(Base.PrincipalId, Text)]) {
      usernames := stable_usernames;
    };

  };
};
