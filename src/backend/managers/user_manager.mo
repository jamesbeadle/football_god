import Account "../utilities/Account";
import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Buffer "mo:base/Buffer";
import Cycles "mo:base/ExperimentalCycles";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Nat8 "mo:base/Nat8";
import Nat64 "mo:base/Nat64";
import Option "mo:base/Option";
import Order "mo:base/Order";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Debug "mo:base/Debug";
import List "mo:base/List";

import T "../types/app_types";
import Base "mo:waterway-mops/BaseTypes";
import FootballTypes "mo:waterway-mops/FootballTypes";
import RequestDTOs "../dtos/request_DTOs";
import ResponseDTOs "../dtos/response_DTOs";
import ProfileCanister "../canister_definitions/profile-canister";

import Constants "../utilities/Constants";
import Environment "../environment";
import Management "../utilities/Management";
import SNSToken "../utilities/ledger";
import Utilities "../utilities/utilities";
import AppTypes "../types/app_types";

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
          let profileResult = await profile_canister.getProfile(principalId);

          switch(profileResult){
            case (#ok profile){
              return #ok({
                joinedDate = profile.joinedDate;
                principalId = profile.principalId;
                profilePicture = profile.profilePicture;
                profilePictureExtension = profile.profilePictureExtension;
                termsAcceptedDate = profile.termsAcceptedDate;
                username = profile.username;
                withdrawalAddress = profile.withdrawalAddress;
              });
            };
            case (_){
              return #err(#NotFound);
            }
          }
        };
        case (null){
          return #err(#NotFound);
        }
      };
    };



    public func  agreeTerms(principalId: Base.PrincipalId) : async Result.Result<(), T.Error> {
      
      await checkOrCreateProfile(principalId);
      
      let userProfileCanisterId = Array.find<(Base.PrincipalId, Base.CanisterId)>(profileCanisterIds, func(entry: (Base.PrincipalId, Base.CanisterId)) : Bool {
        entry.0 == principalId;
      });

      switch(userProfileCanisterId){
        case (?foundCanisterId){

          let profile_canister = actor (foundCanisterId.1) : actor {
            acceptTerms : (principalId: Base.PrincipalId) -> async Result.Result<(), T.Error>;
          };
          let result = await profile_canister.acceptTerms(principalId);
          return result;
        };
        case (null){
          return #err(#NotFound);
        }
      };
    };
      
    public func updateUsername(dto: RequestDTOs.UpdateUsernameDTO) : async Result.Result<(), T.Error> {
      await checkOrCreateProfile(dto.principalId);
      if(not Utilities.validUsername(dto.username)){
        return #err(#NotAllowed);
      };
      if(not usernameAvailable(dto.username, dto.principalId)){
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
      if(not Utilities.validProfilePicture(dto.profilePicture)){
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

    private func checkOrCreateProfile(principalId: Base.PrincipalId) : async () {
      if(activeProfileCanisterId == ""){
        await createProfileCanister();
        await createProfile(principalId);
      };

      let foundProfileCanisterId = Array.find<(Base.PrincipalId, Base.CanisterId)>(profileCanisterIds, func(entry: (Base.PrincipalId, Base.CanisterId)) : Bool {
        entry.0 == principalId;
      });



      if(Option.isNull(foundProfileCanisterId)){
        if(await activeCanisterFull()){
          await createProfileCanister();
        };
        await createProfile(principalId);
      };
    };

    private func createProfileCanister() : async () {
      
      Cycles.add<system>(50_000_000_000_000);
      
      let canister = await ProfileCanister._ProfileCanister();
      
      let canister_principal = Principal.fromActor(canister);
      let canisterId = Principal.toText(canister_principal);
      activeProfileCanisterId := canisterId;
      let uniqueProfileCanisterIdsBuffer = Buffer.fromArray<Base.CanisterId>(uniqueProfileCanisterIds);
      uniqueProfileCanisterIdsBuffer.add(canisterId);
      uniqueProfileCanisterIds := Buffer.toArray(uniqueProfileCanisterIdsBuffer);
      
      let IC : Management.Management = actor (Environment.Default);
      let _ = await Utilities.updateCanister_(canister, ?Principal.fromText(Environment.BACKEND_CANISTER_ID), IC);
    };

    private func createProfile(principalId: Base.PrincipalId) : async () {
      let profileCanisterIdsBuffer = Buffer.fromArray<(Base.PrincipalId, Base.CanisterId)>(profileCanisterIds);
      
      let profile_canister = actor (activeProfileCanisterId) : actor {
        createProfile : (principalId : Text) -> async Result.Result<(), T.Error>;
      };
      let profileResult = await profile_canister.createProfile(principalId);

      switch(profileResult){
        case (#ok _){
          profileCanisterIdsBuffer.add(principalId, activeProfileCanisterId);
          profileCanisterIds := Buffer.toArray(profileCanisterIdsBuffer);
        };
        case (#err _){}
      };    
    };

    private func activeCanisterFull() : async Bool {
      let profile_canister = actor (activeProfileCanisterId) : actor {
        canisterFull : () -> async Bool;
      };
      return await profile_canister.canisterFull();
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

    private func usernameAvailable(username : Text, potentialPrincipalId: Base.PrincipalId) : Bool {

      let foundUsername = Array.find<(Base.PrincipalId, Text)>(usernames, func(entry: (Base.PrincipalId, Text)) : Bool {
        entry.1 == username and entry.0 != potentialPrincipalId;
      });

      if(Option.isSome(foundUsername)){
        return false;
      };


      return true;
    };

    private func payWinnings(winnerPrincipalId: Base.PrincipalId, totalWinnings: Nat64) : async () {
      let ledger : SNSToken.Interface = actor (Environment.OPENFPL_LEDGER_CANISTER_ID);
          
      let _ = await ledger.icrc1_transfer ({
        memo = ?Text.encodeUtf8("0");
        from_subaccount = ?Account.defaultSubaccount();
        to = {owner = Principal.fromText(winnerPrincipalId); subaccount = null};
        amount = Nat64.toNat(totalWinnings);
        fee = ?Nat64.toNat(Constants.FPL_TRANSACTION_FEE);
        created_at_time = ?Nat64.fromNat(Int.abs(Time.now()))
      });
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

    public func getAllAuditUsers(offset: Nat) : async [ResponseDTOs.UserDTO] {
      
      let allUsersBuffer = Buffer.fromArray<ResponseDTOs.UserDTO>([]);
      for(canisterId in Iter.fromArray(uniqueProfileCanisterIds)){
        let profile_canister = actor (canisterId) : actor {
          getAllAuditUsers : () -> async [ResponseDTOs.UserDTO];
        };
        let users = await profile_canister.getAllAuditUsers();
        allUsersBuffer.append(Buffer.fromArray(users));
      };
      let droppedEntries = List.drop<ResponseDTOs.UserDTO>(List.fromArray(Buffer.toArray(allUsersBuffer)), offset);
      return List.toArray(List.take<ResponseDTOs.UserDTO>(droppedEntries, 100));
    };

  };
};
