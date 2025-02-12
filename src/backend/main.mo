import Int "mo:base/Int";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Timer "mo:base/Timer";
import Iter "mo:base/Iter";

import T "types/app_types";
import Base "mo:waterway-mops/BaseTypes";
import FootballTypes "mo:waterway-mops/FootballTypes";
import Environment "environment";

import RequestDTOs "dtos/request_DTOs";
import ResponseDTOs "dtos/response_DTOs";

import UserManager "managers/user_manager";
import Management "utilities/Management";
import ProfileCanister "canister_definitions/profile-canister";

actor Self {

  private let userManager = UserManager.UserManager(); 
  
  private var appStatus: Base.AppStatus = { 
    onHold = false;
    version = "0.0.1";
  };  
  
  public shared query func getAppStatus() : async Result.Result<ResponseDTOs.AppStatusDTO, T.Error> {
    return #ok(appStatus);
  };

  /* User management functions */

  public shared ({ caller }) func getProfile() : async Result.Result<ResponseDTOs.ProfileDTO, T.Error> {
    assert not Principal.isAnonymous(caller);
    let principalId = Principal.toText(caller);
    
    return await userManager.getProfile(principalId);
  };

  public shared ({ caller }) func  agreeTerms() : async Result.Result<(), T.Error> {
    assert not Principal.isAnonymous(caller);
    let principalId = Principal.toText(caller);
    return await userManager.agreeTerms(principalId);
  };

  public shared ({ caller }) func updateUsername(dto: RequestDTOs.UpdateUsernameDTO) : async Result.Result<(), T.Error> {
    assert not Principal.isAnonymous(caller);
    let principalId = Principal.toText(caller);
    assert dto.principalId == principalId;
    return await userManager.updateUsername(dto);
  };

  public shared ({ caller }) func updateProfilePicture(dto: RequestDTOs.UpdateProfilePictureDTO) : async Result.Result<(), T.Error> {
    assert not Principal.isAnonymous(caller);
    let principalId = Principal.toText(caller);
    assert dto.principalId == principalId;
    return await userManager.updateProfilePicture(dto);
  };

  public shared ({ caller }) func updateWithdrawalAddress(dto: RequestDTOs.UpdateWithdrawalAddressDTO) : async Result.Result<(), T.Error> {
    assert not Principal.isAnonymous(caller);
    let principalId = Principal.toText(caller);
    assert dto.principalId == principalId;
    return await userManager.updateWithdrawalAddress(dto);
  };

  public shared ({ caller }) func pauseAccount(dto: RequestDTOs.PauseAccountDTO) : async Result.Result<(), T.Error> {
    assert not Principal.isAnonymous(caller);
    let principalId = Principal.toText(caller);
    assert dto.principalId == principalId;
    return await userManager.pauseAccount(dto);
  };

  /* Data functions */

  //Giving me ic0 trap error
  public shared composite query func getPlayerDetailsForGameweek(leagueId: FootballTypes.LeagueId, dto: RequestDTOs.GameweekFiltersDTO) : async Result.Result<ResponseDTOs.PlayerDetailDTO, T.Error> {
    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      getPlayerDetailsForGameweek : shared query (leagueId: FootballTypes.LeagueId, dto: RequestDTOs.GameweekFiltersDTO) -> async Result.Result<ResponseDTOs.PlayerDetailDTO, T.Error>;
    };
    return await data_canister.getPlayerDetailsForGameweek(leagueId, dto);
  };

  /* Stable variable backup for managers */

  //User Manager
  private stable var stable_profile_canister_ids: [(Base.PrincipalId, Base.CanisterId)] = [];
  private stable var stable_unique_profile_canister_ids: [Base.CanisterId] = [];
  private stable var stable_active_profile_canister_id: Text = "";
  private stable var stable_usernames: [(Base.PrincipalId, Text)] = [];

  system func preupgrade() {
    stable_profile_canister_ids := userManager.getStableProfileCanisterIds();
    stable_unique_profile_canister_ids := userManager.getStableUniqueProfileCanisterIds();
    stable_active_profile_canister_id := userManager.getStableActiveProfileCanisterId();
    stable_usernames := userManager.getStableUsernames();
  };

  system func postupgrade() {
    
    userManager.setStableProfileCanisterIds(stable_profile_canister_ids);
    userManager.setStableUniqueProfileCanisterIds(stable_unique_profile_canister_ids);
    userManager.setStableActiveProfileCanisterId(stable_active_profile_canister_id);
    userManager.setStableUsernames(stable_usernames);

    ignore Timer.setTimer<system>(#nanoseconds(Int.abs(1)), postUpgradeCallback); 
  };

  private func postUpgradeCallback() : async (){
    await updateProfileCanisterWasms();
  };

  private func updateProfileCanisterWasms() : async (){
    let profileCanisterIds = userManager.getStableUniqueProfileCanisterIds();
    let IC : Management.Management = actor (Environment.Default);
    for(canisterId in Iter.fromArray(profileCanisterIds)){
      await IC.stop_canister({ canister_id = Principal.fromText(canisterId); });
      let oldProfileCanister = actor (canisterId) : actor {};
      let _ = await (system ProfileCanister._ProfileCanister)(#upgrade oldProfileCanister)();
      await IC.start_canister({ canister_id = Principal.fromText(canisterId); });
    };
  };
};
