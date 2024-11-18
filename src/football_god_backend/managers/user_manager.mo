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
      return #err(#NotFound);
    };

    public func updateProfilePicture(dto: RequestDTOs.UpdateProfilePictureDTO) : async Result.Result<(), T.Error> {
      return #err(#NotFound);
    };

    public func updateWithdrawalAddress(dto: RequestDTOs.UpdateWithdrawalAddressDTO) : async Result.Result<(), T.Error> {
      return #err(#NotFound);
    };

    public func pauseAccount(dto: RequestDTOs.PauseAccountDTO) : async Result.Result<(), T.Error> {
      return #err(#NotFound);
    };

    public func setMaxBetLimit(dto: RequestDTOs.SetMaxBetLimit) : async Result.Result<(), T.Error> {

      //When set, it cannot be increased for 30 days.

      //TODO: Cannot change if changed or set in the last 30 days
      return #err(#NotFound);
    };

    public func setMonthlyBetLimit(dto: RequestDTOs.SetMonthlyBetLimitDTO) : async Result.Result<(), T.Error> {
     
      //When set, it cannot be increased for 30 days.
     
    //TODO: Cannot change if changed or set in the last 30 days
      return #err(#NotFound);
    };

    public func addPlacedBet(dto: RequestDTOs.SubmitBetslipDTO) : async Result.Result<BettingTypes.BetSlip, T.Error> {
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

    /*


    public func createProfile(principalId : Base.PrincipalId, username : Text, withdrawalAddress : Text) : () {

      let updatedProfile : T.Profile = {
        principalId = principalId;
        username = username;
        withdrawalAddress = withdrawalAddress;
      };

      let existingProfile = List.find<T.Profile>(
        userProfiles,
        func(profile : T.Profile) : Bool {
          return profile.principalId == principalId;
        },
      );

      switch (existingProfile) {
        case (null) {
          var newProfilesList = List.nil<T.Profile>();
          newProfilesList := List.push(updatedProfile, newProfilesList);
          userProfiles := List.append(userProfiles, newProfilesList);
        };
        case (?existingProfile) {};
      };
    };

    public func updateUsername(principalId : Base.PrincipalId, username : Text) : Result.Result<(), T.Error> {

      let existingProfile = List.find<T.Profile>(
        userProfiles,
        func(profile : T.Profile) : Bool {
          return profile.principalId == principalId;
        },
      );

      switch (existingProfile) {
        case (null) {
          return #err(#NotFound);
        };
        case (?existingProfile) {

          if (existingProfile.principalId == principalId) {
            return #ok(());
          };

          let updatedProfile : T.Profile = {
            principalId = existingProfile.principalId;
            username = username;
            withdrawalAddress = existingProfile.withdrawalAddress;
          };

          let nameValid = isDisplayNameValid(updatedProfile.username);
          if (not nameValid) {
            return #err(#NotAllowed);
          };

          userProfiles := List.map<T.Profile, T.Profile>(
            userProfiles,
            func(profile : T.Profile) : T.Profile {
              if (profile.principalId == principalId) { updatedProfile } else {
                profile;
              };
            },
          );

          return #ok(());
        };
      };
    };

    public func updateWithdrawalAddress(principalId : Base.PrincipalId, withdrawalAddress : Text) : Result.Result<(), T.Error> {

      let existingProfile = List.find<T.Profile>(
        userProfiles,
        func(profile : T.Profile) : Bool {
          return profile.principalId == principalId;
        },
      );

      switch (existingProfile) {
        case (null) {
          return #err(#NotFound);
        };
        case (?existingProfile) {

          if (existingProfile.withdrawalAddress == withdrawalAddress) {
            return #ok(());
          };

          let updatedProfile : T.Profile = {
            principalId = existingProfile.principalId;
            username = existingProfile.username;
            withdrawalAddress = withdrawalAddress;
          };

          userProfiles := List.map<T.Profile, T.Profile>(
            userProfiles,
            func(profile : T.Profile) : T.Profile {
              if (profile.principalId == principalId) { updatedProfile } else {
                profile;
              };
            },
          );

          return #ok(());
        };
      };
    };

    public func isDisplayNameValid(principalId : Text) : Bool {

      if (Text.size(principalId) < 3 or Text.size(principalId) > 20) {
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

      if (not isAlphanumeric(principalId)) {
        return false;
      };

      let foundProfile = List.find<T.Profile>(
        userProfiles,
        func(profile : T.Profile) : Bool {
          return profile.principalId == principalId;
        },
      );

      if (foundProfile != null) {
        return false;
      };

      return true;
    };

    public func isWalletValid(walletAddress : Text) : Bool {

      let account_id = Account.decode(walletAddress);
      switch account_id {
        case (#ok array) {
          if (Account.validateAccountIdentifier(Blob.fromArray(array))) {
            return true;
          };
        };
        case (#err err) {
          return false;
        };
      };

      return false;
    };
    */

    //TODO: ADD WITHDRAWAL CODE

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
