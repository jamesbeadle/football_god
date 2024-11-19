import Timer "mo:base/Timer";
import Int "mo:base/Int";
import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import ResponseDTOs "../dtos/response_DTOs";
import RequestDTOs "../dtos/request_DTOs";
import T "../types/app_types";
import BettingTypes "../types/betting_types";
import Base "../types/base_types";
import Environment "../environment";
actor class _ProfileCanister() {
  
  private let MAX_PROFILES_PER_CANISTER: Nat = 500;
  private let MAX_PROFILES_PER_GROUP: Nat = 10;
  private let MAX_PROFILE_GROUPS: Nat = 50;
  private stable var profileCount = 0;

  private stable var profileGroup1: [T.Profile] = [];
  private stable var profileGroup2: [T.Profile] = [];
  private stable var profileGroup3: [T.Profile] = [];
  private stable var profileGroup4: [T.Profile] = [];
  private stable var profileGroup5: [T.Profile] = [];
  private stable var profileGroup6: [T.Profile] = [];
  private stable var profileGroup7: [T.Profile] = [];
  private stable var profileGroup8: [T.Profile] = [];
  private stable var profileGroup9: [T.Profile] = [];
  private stable var profileGroup10: [T.Profile] = [];
  private stable var profileGroup11: [T.Profile] = [];
  private stable var profileGroup12: [T.Profile] = [];
  private stable var profileGroup13: [T.Profile] = [];
  private stable var profileGroup14: [T.Profile] = [];
  private stable var profileGroup15: [T.Profile] = [];
  private stable var profileGroup16: [T.Profile] = [];
  private stable var profileGroup17: [T.Profile] = [];
  private stable var profileGroup18: [T.Profile] = [];
  private stable var profileGroup19: [T.Profile] = [];
  private stable var profileGroup20: [T.Profile] = [];
  private stable var profileGroup21: [T.Profile] = [];
  private stable var profileGroup22: [T.Profile] = [];
  private stable var profileGroup23: [T.Profile] = [];
  private stable var profileGroup24: [T.Profile] = [];
  private stable var profileGroup25: [T.Profile] = [];
  private stable var profileGroup26: [T.Profile] = [];
  private stable var profileGroup27: [T.Profile] = [];
  private stable var profileGroup28: [T.Profile] = [];
  private stable var profileGroup29: [T.Profile] = [];
  private stable var profileGroup30: [T.Profile] = [];
  private stable var profileGroup31: [T.Profile] = [];
  private stable var profileGroup32: [T.Profile] = [];
  private stable var profileGroup33: [T.Profile] = [];
  private stable var profileGroup34: [T.Profile] = [];
  private stable var profileGroup35: [T.Profile] = [];
  private stable var profileGroup36: [T.Profile] = [];
  private stable var profileGroup37: [T.Profile] = [];
  private stable var profileGroup38: [T.Profile] = [];
  private stable var profileGroup39: [T.Profile] = [];
  private stable var profileGroup40: [T.Profile] = [];
  private stable var profileGroup41: [T.Profile] = [];
  private stable var profileGroup42: [T.Profile] = [];
  private stable var profileGroup43: [T.Profile] = [];
  private stable var profileGroup44: [T.Profile] = [];
  private stable var profileGroup45: [T.Profile] = [];
  private stable var profileGroup46: [T.Profile] = [];
  private stable var profileGroup47: [T.Profile] = [];
  private stable var profileGroup48: [T.Profile] = [];
  private stable var profileGroup49: [T.Profile] = [];
  private stable var profileGroup50: [T.Profile] = [];

  private stable var activeProfileGroup: Nat = 1;
  private stable var profileGroupDictionary: [(Base.PrincipalId, Nat)] = [];
  
  public shared ({caller }) func createProfile(principalId: Text) : async Result.Result<(), T.Error>{
    assert Principal.toText(caller) == Environment.BACKEND_CANISTER_ID;
    if(profileCount >= MAX_PROFILES_PER_CANISTER){
      return #err(#CanisterFull);
    };
    if(getGroupTotal(activeProfileGroup) >= MAX_PROFILES_PER_GROUP){
      activeProfileGroup += 1;
    };

    if(activeProfileGroup > MAX_PROFILE_GROUPS){
      return #err(#CanisterFull);
    };

    let newProfile: T.Profile = buildEmptyProfile(principalId);
    addProfile(newProfile);
    return #ok();
  };

  public shared ({caller }) func getProfile(principalId: Text) : async Result.Result<ResponseDTOs.ProfileDTO, T.Error>{
    let callerPrincipalId = Principal.toText(caller);
    let profileGroupEntry = Array.find<(Base.PrincipalId, Nat)>(profileGroupDictionary, 
      func(groupEntry: (Base.PrincipalId, Nat)) : Bool {
        groupEntry.0 == callerPrincipalId;
    });
    switch(profileGroupEntry){
      case (?profileGroup){
        let profileResult = getProfileFromGroup(callerPrincipalId, profileGroup.1);
        switch(profileResult){
          case (?profile){
            var accountBalance: Nat64 = 0; //TODO set from ledger
            var currentMonthBetTotal: Nat64 = 0; //TODO SET
            let response: ResponseDTOs.ProfileDTO = {
              accountBalance = accountBalance;
              accountOnPause = profile.accountOnPause;
              completedKYC = profile.completedKYC;
              maxBetLimit = profile.maxBetLimit;
              monthlyBetLimit = profile.monthlyBetLimit;
              monthlyBetTotal = currentMonthBetTotal;
              principalId = profile.principalId;
              profilePicture = profile.profilePicture;
              username = profile.username;
              withdrawalAddress = profile.withdrawalAddress
            };
            return #ok(response);
          };
          case (null){
            return #err(#NotFound);
          }
        };
      };
      case (null){
        return #err(#NotFound);
      }
    };
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
    //When set, it cannot be increased for 30 days.
    return #err(#NotFound);
  };
  
  public shared ({caller }) func setMonthlyBetLimit(dto: RequestDTOs.SetMonthlyBetLimitDTO) : async Result.Result<(), T.Error>{
    //When set, it cannot be increased for 30 days.
    return #err(#NotFound);
  };
  
  public shared ({caller }) func placeBet(dto: RequestDTOs.SubmitBetslipDTO) : async Result.Result<BettingTypes.BetSlip, T.Error>{
    //private function to update monthly bet totals should be added when a bet is placed
    return #err(#NotFound);
  };
  
  public shared ({caller }) func getBets(dto: RequestDTOs.GetBetsDTO) : async Result.Result<[BettingTypes.BetSlip], T.Error>{
    return #err(#NotFound);
  };
  
  public shared ({caller }) func updateSettledBet(principalId: Base.PrincipalId, betslip: BettingTypes.BetSlip) : async (){
    
    //Update the users totals for months etc
  };
  
  public shared ({caller }) func canisterFull() : async Bool{
    return false; //TODO
  };
  
  public shared ({caller }) func voidBet(betslip: BettingTypes.BetSlip) : async (){

  };

  private func getProfileFromGroup(principalId: Base.PrincipalId, groupNumber: Nat) : ?T.Profile {
    var groupProfiles: [T.Profile] = [];
    
    switch(groupNumber){
      case (1){
        groupProfiles := profileGroup1;
      };
      case (2){
        groupProfiles := profileGroup2;
      };
      case (3){
        groupProfiles := profileGroup3;
      };
      case (4){
        groupProfiles := profileGroup4;
      };
      case (5){
        groupProfiles := profileGroup5;
      };
      case (6){
        groupProfiles := profileGroup6;
      };
      case (7){
        groupProfiles := profileGroup7;
      };
      case (8){
        groupProfiles := profileGroup8;
      };
      case (9){
        groupProfiles := profileGroup9;
      };
      case (10){
        groupProfiles := profileGroup10;
      };
      case (11){
        groupProfiles := profileGroup11;
      };
      case (12){
        groupProfiles := profileGroup12;
      };
      case (13){
        groupProfiles := profileGroup13;
      };
      case (14){
        groupProfiles := profileGroup14;
      };
      case (15){
        groupProfiles := profileGroup15;
      };
      case (16){
        groupProfiles := profileGroup16;
      };
      case (17){
        groupProfiles := profileGroup17;
      };
      case (18){
        groupProfiles := profileGroup18;
      };
      case (19){
        groupProfiles := profileGroup19;
      };
      case (20){
        groupProfiles := profileGroup20;
      };
      case (21){
        groupProfiles := profileGroup21;
      };
      case (22){
        groupProfiles := profileGroup22;
      };
      case (23){
        groupProfiles := profileGroup23;
      };
      case (24){
        groupProfiles := profileGroup24;
      };
      case (25){
        groupProfiles := profileGroup25;
      };
      case (26){
        groupProfiles := profileGroup26;
      };
      case (27){
        groupProfiles := profileGroup27;
      };
      case (28){
        groupProfiles := profileGroup28;
      };
      case (29){
        groupProfiles := profileGroup29;
      };
      case (30){
        groupProfiles := profileGroup30;
      };
      case (31){
        groupProfiles := profileGroup31;
      };
      case (32){
        groupProfiles := profileGroup32;
      };
      case (33){
        groupProfiles := profileGroup33;
      };
      case (34){
        groupProfiles := profileGroup34;
      };
      case (35){
        groupProfiles := profileGroup35;
      };
      case (36){
        groupProfiles := profileGroup36;
      };
      case (37){
        groupProfiles := profileGroup37;
      };
      case (38){
        groupProfiles := profileGroup38;
      };
      case (39){
        groupProfiles := profileGroup39;
      };
      case (40){
        groupProfiles := profileGroup40;
      };
      case (41){
        groupProfiles := profileGroup41;
      };
      case (42){
        groupProfiles := profileGroup42;
      };
      case (43){
        groupProfiles := profileGroup43;
      };
      case (44){
        groupProfiles := profileGroup44;
      };
      case (45){
        groupProfiles := profileGroup45;
      };
      case (46){
        groupProfiles := profileGroup46;
      };
      case (47){
        groupProfiles := profileGroup47;
      };
      case (48){
        groupProfiles := profileGroup48;
      };
      case (49){
        groupProfiles := profileGroup49;
      };
      case (50){
        groupProfiles := profileGroup50;
      };
      case (_) {}
    };

    return Array.find<T.Profile>(groupProfiles, func(profile: T.Profile) : Bool {
      profile.principalId == principalId;
    });
  };

  private func getGroupTotal(groupNumber: Nat) : Nat {
    var groupProfiles: [T.Profile] = [];
    
    switch(groupNumber){
      case (1){
        groupProfiles := profileGroup1;
      };
      case (2){
        groupProfiles := profileGroup2;
      };
      case (3){
        groupProfiles := profileGroup3;
      };
      case (4){
        groupProfiles := profileGroup4;
      };
      case (5){
        groupProfiles := profileGroup5;
      };
      case (6){
        groupProfiles := profileGroup6;
      };
      case (7){
        groupProfiles := profileGroup7;
      };
      case (8){
        groupProfiles := profileGroup8;
      };
      case (9){
        groupProfiles := profileGroup9;
      };
      case (10){
        groupProfiles := profileGroup10;
      };
      case (11){
        groupProfiles := profileGroup11;
      };
      case (12){
        groupProfiles := profileGroup12;
      };
      case (13){
        groupProfiles := profileGroup13;
      };
      case (14){
        groupProfiles := profileGroup14;
      };
      case (15){
        groupProfiles := profileGroup15;
      };
      case (16){
        groupProfiles := profileGroup16;
      };
      case (17){
        groupProfiles := profileGroup17;
      };
      case (18){
        groupProfiles := profileGroup18;
      };
      case (19){
        groupProfiles := profileGroup19;
      };
      case (20){
        groupProfiles := profileGroup20;
      };
      case (21){
        groupProfiles := profileGroup21;
      };
      case (22){
        groupProfiles := profileGroup22;
      };
      case (23){
        groupProfiles := profileGroup23;
      };
      case (24){
        groupProfiles := profileGroup24;
      };
      case (25){
        groupProfiles := profileGroup25;
      };
      case (26){
        groupProfiles := profileGroup26;
      };
      case (27){
        groupProfiles := profileGroup27;
      };
      case (28){
        groupProfiles := profileGroup28;
      };
      case (29){
        groupProfiles := profileGroup29;
      };
      case (30){
        groupProfiles := profileGroup30;
      };
      case (31){
        groupProfiles := profileGroup31;
      };
      case (32){
        groupProfiles := profileGroup32;
      };
      case (33){
        groupProfiles := profileGroup33;
      };
      case (34){
        groupProfiles := profileGroup34;
      };
      case (35){
        groupProfiles := profileGroup35;
      };
      case (36){
        groupProfiles := profileGroup36;
      };
      case (37){
        groupProfiles := profileGroup37;
      };
      case (38){
        groupProfiles := profileGroup38;
      };
      case (39){
        groupProfiles := profileGroup39;
      };
      case (40){
        groupProfiles := profileGroup40;
      };
      case (41){
        groupProfiles := profileGroup41;
      };
      case (42){
        groupProfiles := profileGroup42;
      };
      case (43){
        groupProfiles := profileGroup43;
      };
      case (44){
        groupProfiles := profileGroup44;
      };
      case (45){
        groupProfiles := profileGroup45;
      };
      case (46){
        groupProfiles := profileGroup46;
      };
      case (47){
        groupProfiles := profileGroup47;
      };
      case (48){
        groupProfiles := profileGroup48;
      };
      case (49){
        groupProfiles := profileGroup49;
      };
      case (50){
        groupProfiles := profileGroup50;
      };
      case (_) {}
    };
    
    return Array.size(groupProfiles);
  };

  private func buildEmptyProfile(principalId: Base.PrincipalId) : T.Profile {
    return {
      accountOnPause = false;
      bets = [];
      completedKYC = false;
      maxBetLimit = 0;
      maxBetLimitSet = 0;
      monthlyBetLimit = 0;
      monthlyBetLimitSet = 0;
      monthlyBetTotals = [];
      monthlyProfitLoss = [];
      pauseDays = 0;
      principalId = principalId;
      profilePicture = null;
      termsAccepted = false;
      termsAcceptedOn = 0;
      username = "";
      withdrawalAddress = "";
    };
  };

  private func addProfile(profile: T.Profile){
    var groupProfiles: [T.Profile] = [];
    
    switch(activeProfileGroup){
      case (1){
        groupProfiles := profileGroup1;
      };
      case (2){
        groupProfiles := profileGroup2;
      };
      case (3){
        groupProfiles := profileGroup3;
      };
      case (4){
        groupProfiles := profileGroup4;
      };
      case (5){
        groupProfiles := profileGroup5;
      };
      case (6){
        groupProfiles := profileGroup6;
      };
      case (7){
        groupProfiles := profileGroup7;
      };
      case (8){
        groupProfiles := profileGroup8;
      };
      case (9){
        groupProfiles := profileGroup9;
      };
      case (10){
        groupProfiles := profileGroup10;
      };
      case (11){
        groupProfiles := profileGroup11;
      };
      case (12){
        groupProfiles := profileGroup12;
      };
      case (13){
        groupProfiles := profileGroup13;
      };
      case (14){
        groupProfiles := profileGroup14;
      };
      case (15){
        groupProfiles := profileGroup15;
      };
      case (16){
        groupProfiles := profileGroup16;
      };
      case (17){
        groupProfiles := profileGroup17;
      };
      case (18){
        groupProfiles := profileGroup18;
      };
      case (19){
        groupProfiles := profileGroup19;
      };
      case (20){
        groupProfiles := profileGroup20;
      };
      case (21){
        groupProfiles := profileGroup21;
      };
      case (22){
        groupProfiles := profileGroup22;
      };
      case (23){
        groupProfiles := profileGroup23;
      };
      case (24){
        groupProfiles := profileGroup24;
      };
      case (25){
        groupProfiles := profileGroup25;
      };
      case (26){
        groupProfiles := profileGroup26;
      };
      case (27){
        groupProfiles := profileGroup27;
      };
      case (28){
        groupProfiles := profileGroup28;
      };
      case (29){
        groupProfiles := profileGroup29;
      };
      case (30){
        groupProfiles := profileGroup30;
      };
      case (31){
        groupProfiles := profileGroup31;
      };
      case (32){
        groupProfiles := profileGroup32;
      };
      case (33){
        groupProfiles := profileGroup33;
      };
      case (34){
        groupProfiles := profileGroup34;
      };
      case (35){
        groupProfiles := profileGroup35;
      };
      case (36){
        groupProfiles := profileGroup36;
      };
      case (37){
        groupProfiles := profileGroup37;
      };
      case (38){
        groupProfiles := profileGroup38;
      };
      case (39){
        groupProfiles := profileGroup39;
      };
      case (40){
        groupProfiles := profileGroup40;
      };
      case (41){
        groupProfiles := profileGroup41;
      };
      case (42){
        groupProfiles := profileGroup42;
      };
      case (43){
        groupProfiles := profileGroup43;
      };
      case (44){
        groupProfiles := profileGroup44;
      };
      case (45){
        groupProfiles := profileGroup45;
      };
      case (46){
        groupProfiles := profileGroup46;
      };
      case (47){
        groupProfiles := profileGroup47;
      };
      case (48){
        groupProfiles := profileGroup48;
      };
      case (49){
        groupProfiles := profileGroup49;
      };
      case (50){
        groupProfiles := profileGroup50;
      };
      case (_) {}
    };

    let profileBuffer = Buffer.fromArray<T.Profile>(groupProfiles);
    profileBuffer.add(profile);

    switch(activeProfileGroup){
      case (1){
        profileGroup1 := Buffer.toArray(profileBuffer);
      };
      case (2){
        profileGroup2 := Buffer.toArray(profileBuffer);
      };
      case (3){
        profileGroup3 := Buffer.toArray(profileBuffer);
      };
      case (4){
        profileGroup4 := Buffer.toArray(profileBuffer);
      };
      case (5){
        profileGroup5 := Buffer.toArray(profileBuffer);
      };
      case (6){
        profileGroup6 := Buffer.toArray(profileBuffer);
      };
      case (7){
        profileGroup7 := Buffer.toArray(profileBuffer);
      };
      case (8){
        profileGroup8 := Buffer.toArray(profileBuffer);
      };
      case (9){
        profileGroup9 := Buffer.toArray(profileBuffer);
      };
      case (10){
        profileGroup10 := Buffer.toArray(profileBuffer);
      };
      case (11){
        profileGroup11 := Buffer.toArray(profileBuffer);
      };
      case (12){
        profileGroup12 := Buffer.toArray(profileBuffer);
      };
      case (13){
        profileGroup13 := Buffer.toArray(profileBuffer);
      };
      case (14){
        profileGroup14 := Buffer.toArray(profileBuffer);
      };
      case (15){
        profileGroup15 := Buffer.toArray(profileBuffer);
      };
      case (16){
        profileGroup16 := Buffer.toArray(profileBuffer);
      };
      case (17){
        profileGroup17 := Buffer.toArray(profileBuffer);
      };
      case (18){
        profileGroup18 := Buffer.toArray(profileBuffer);
      };
      case (19){
        profileGroup19 := Buffer.toArray(profileBuffer);
      };
      case (20){
        profileGroup20 := Buffer.toArray(profileBuffer);
      };
      case (21){
        profileGroup21 := Buffer.toArray(profileBuffer);
      };
      case (22){
        profileGroup22 := Buffer.toArray(profileBuffer);
      };
      case (23){
        profileGroup23 := Buffer.toArray(profileBuffer);
      };
      case (24){
        profileGroup24 := Buffer.toArray(profileBuffer);
      };
      case (25){
        profileGroup25 := Buffer.toArray(profileBuffer);
      };
      case (26){
        profileGroup26 := Buffer.toArray(profileBuffer);
      };
      case (27){
        profileGroup27 := Buffer.toArray(profileBuffer);
      };
      case (28){
        profileGroup28 := Buffer.toArray(profileBuffer);
      };
      case (29){
        profileGroup29 := Buffer.toArray(profileBuffer);
      };
      case (30){
        profileGroup30 := Buffer.toArray(profileBuffer);
      };
      case (31){
        profileGroup31 := Buffer.toArray(profileBuffer);
      };
      case (32){
        profileGroup32 := Buffer.toArray(profileBuffer);
      };
      case (33){
        profileGroup33 := Buffer.toArray(profileBuffer);
      };
      case (34){
        profileGroup34 := Buffer.toArray(profileBuffer);
      };
      case (35){
        profileGroup35 := Buffer.toArray(profileBuffer);
      };
      case (36){
        profileGroup36 := Buffer.toArray(profileBuffer);
      };
      case (37){
        profileGroup37 := Buffer.toArray(profileBuffer);
      };
      case (38){
        profileGroup38 := Buffer.toArray(profileBuffer);
      };
      case (39){
        profileGroup39 := Buffer.toArray(profileBuffer);
      };
      case (40){
        profileGroup40 := Buffer.toArray(profileBuffer);
      };
      case (41){
        profileGroup41 := Buffer.toArray(profileBuffer);
      };
      case (42){
        profileGroup42 := Buffer.toArray(profileBuffer);
      };
      case (43){
        profileGroup43 := Buffer.toArray(profileBuffer);
      };
      case (44){
        profileGroup44 := Buffer.toArray(profileBuffer);
      };
      case (45){
        profileGroup45 := Buffer.toArray(profileBuffer);
      };
      case (46){
        profileGroup46 := Buffer.toArray(profileBuffer);
      };
      case (47){
        profileGroup47 := Buffer.toArray(profileBuffer);
      };
      case (48){
        profileGroup48 := Buffer.toArray(profileBuffer);
      };
      case (49){
        profileGroup49 := Buffer.toArray(profileBuffer);
      };
      case (50){
        profileGroup50 := Buffer.toArray(profileBuffer);
      };
      case (_) {}
    };

    let profileGroupDictionaryBuffer = Buffer.fromArray<(Base.PrincipalId, Nat)>(profileGroupDictionary);
    profileGroupDictionaryBuffer.add(profile.principalId, activeProfileGroup);
    profileGroupDictionary := Buffer.toArray(profileGroupDictionaryBuffer);
    profileCount += 1;
  };

  system func preupgrade() {
  };

  system func postupgrade() {
    ignore Timer.setTimer<system>(#nanoseconds(Int.abs(1)), postUpgradeCallback); 
  };
  
  private func postUpgradeCallback() : async (){
    
  };
};