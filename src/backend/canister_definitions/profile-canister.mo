import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Int "mo:base/Int";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Timer "mo:base/Timer";
import Nat64 "mo:base/Nat64";
import Time "mo:base/Time";
import Debug "mo:base/Debug";
import Iter "mo:base/Iter";

import T "../types/app_types";
import Base "../types/base_types";
import BettingTypes "../types/betting_types";
import ResponseDTOs "../dtos/response_DTOs";
import RequestDTOs "../dtos/request_DTOs";
import Environment "../environment";

import FPLLedger "../utilities/ledger";
import Utilities "../utilities/utilities";

actor class _ProfileCanister() {
  
  private let ledger : FPLLedger.Interface = actor (FPLLedger.CANISTER_ID);
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

  public shared ({caller }) func getProfile(userPrincipalId: Base.PrincipalId) : async Result.Result<ResponseDTOs.ProfileDTO, T.Error>{
    assert Principal.toText(caller) == Environment.BACKEND_CANISTER_ID;
    let profileGroupEntry = Array.find<(Base.PrincipalId, Nat)>(profileGroupDictionary, 
      func(groupEntry: (Base.PrincipalId, Nat)) : Bool {
        groupEntry.0 == userPrincipalId;
    });
    switch(profileGroupEntry){
      case (?profileGroup){
        let profileResult = getProfileFromGroup(userPrincipalId, profileGroup.1);
        switch(profileResult){
          case (?profile){

            let tokens = await ledger.icrc1_balance_of({owner = Principal.fromText(profile.principalId); subaccount = null}); 
            
            let currentYear = Utilities.getCurrentYear();
            let currentMonth = Utilities.getCurrentMonth();

            let currentYearMonthlyTotals = Array.find<(Nat16, [(Base.CalendarMonth, Nat64)])>(
              profile.monthlyBetTotals,
              func(yearEntry: (Nat16, [(Base.CalendarMonth, Nat64)])) : Bool {
                yearEntry.0 == currentYear;
              }
            ); 

            var currentMonthBetTotal: Nat64 = 0;
            switch(currentYearMonthlyTotals){
              case (?foundYearTotals){
                let currentMonthTotal = Array.find<(Base.CalendarMonth, Nat64)>(foundYearTotals.1, func(entry: (Base.CalendarMonth, Nat64)) : Bool {
                  entry.0 == currentMonth;
                });
                switch(currentMonthTotal){
                  case (?foundTotal){
                    currentMonthBetTotal := foundTotal.1;  
                  };
                  case (null){ }
                };
              };
              case (null){ };
            };
            
            var accountBalance: Nat64 = Nat64.fromNat(tokens);
            let response: ResponseDTOs.ProfileDTO = {
              accountBalance = accountBalance;
              accountOnPause = profile.accountOnPause;
              maxBetLimit = profile.maxBetLimit;
              monthlyBetLimit = profile.monthlyBetLimit;
              monthlyBetTotal = currentMonthBetTotal;
              principalId = profile.principalId;
              profilePicture = profile.profilePicture;
              profilePictureExtension = profile.profilePictureExtension;
              username = profile.username;
              withdrawalAddress = profile.withdrawalAddress;
              kycComplete = profile.kycComplete;
              joinedDate = profile.joinedDate;
              kycApprovalDate = profile.kycApprovalDate;
              kycRef = profile.kycRef;
              kycSubmissionDate = profile.kycSubmissionDate;
              termsAcceptedDate = profile.termsAcceptedDate;
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

  public shared ({ caller }) func acceptTerms(principalId: Base.PrincipalId) : async Result.Result<(), T.Error>{
    Debug.print("Accepting terms in profile canister");
    assert Principal.toText(caller) == Environment.BACKEND_CANISTER_ID;
    let profileGroupEntry = Array.find<(Base.PrincipalId, Nat)>(profileGroupDictionary, 
      func(groupEntry: (Base.PrincipalId, Nat)) : Bool {
        groupEntry.0 == principalId;
    });
    switch(profileGroupEntry){
      case (?profileGroup){
        let profileResult = getProfileFromGroup(principalId, profileGroup.1);
        switch(profileResult){
          case (?profile){
            Debug.print("found profile to update");
            let updatedProfile: T.Profile = {
              accountOnPause = profile.accountOnPause;
              bets = profile.bets;
              maxBetLimit = profile.maxBetLimit;
              maxBetLimitSet = profile.maxBetLimitSet;
              monthlyBetLimit = profile.monthlyBetLimit;
              monthlyBetLimitSet = profile.monthlyBetLimitSet;
              monthlyBetTotals = profile.monthlyBetTotals;
              monthlyProfitLoss = profile.monthlyProfitLoss;
              pauseEndDate = profile.pauseEndDate;
              principalId = profile.principalId;
              profilePicture = profile.profilePicture;
              profilePictureExtension = profile.profilePictureExtension;
              termsAcceptedDate = Time.now();
              username = profile.username;
              withdrawalAddress = profile.withdrawalAddress;
              joinedDate = profile.joinedDate;
              kycApprovalDate = profile.kycApprovalDate;
              kycRef = profile.kycRef;
              kycSubmissionDate = profile.kycSubmissionDate;
              kycComplete = profile.kycComplete;
            };
            updateProfile(updatedProfile, profileGroup.1);
            return #ok();
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

  public shared ({ caller }) func verifyBettingAccount(principalId: Base.PrincipalId) : async Result.Result<(), T.Error>{
    assert Principal.toText(caller) == Environment.BACKEND_CANISTER_ID;
    let profileGroupEntry = Array.find<(Base.PrincipalId, Nat)>(profileGroupDictionary, 
      func(groupEntry: (Base.PrincipalId, Nat)) : Bool {
        groupEntry.0 == principalId;
    });
    switch(profileGroupEntry){
      case (?profileGroup){
        let profileResult = getProfileFromGroup(principalId, profileGroup.1);
        switch(profileResult){
          case (?profile){
            let updatedProfile: T.Profile = {
              accountOnPause = profile.accountOnPause;
              bets = profile.bets;
              maxBetLimit = profile.maxBetLimit;
              maxBetLimitSet = profile.maxBetLimitSet;
              monthlyBetLimit = profile.monthlyBetLimit;
              monthlyBetLimitSet = profile.monthlyBetLimitSet;
              monthlyBetTotals = profile.monthlyBetTotals;
              monthlyProfitLoss = profile.monthlyProfitLoss;
              pauseEndDate = profile.pauseEndDate;
              principalId = profile.principalId;
              profilePicture = profile.profilePicture;
              profilePictureExtension = profile.profilePictureExtension;
              termsAcceptedDate = profile.termsAcceptedDate;
              username = profile.username;
              withdrawalAddress = profile.withdrawalAddress;
              joinedDate = profile.joinedDate;
              kycApprovalDate = Time.now();
              kycRef = profile.kycRef;  //TODO need to set for auditing
              kycSubmissionDate = profile.kycSubmissionDate;  //TODO need to set for auditing
              kycComplete = true;
            };
            updateProfile(updatedProfile, profileGroup.1);
            return #ok();
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
    assert Principal.toText(caller) == Environment.BACKEND_CANISTER_ID;
    let profileGroupEntry = Array.find<(Base.PrincipalId, Nat)>(profileGroupDictionary, 
      func(groupEntry: (Base.PrincipalId, Nat)) : Bool {
        groupEntry.0 == dto.principalId;
    });
    switch(profileGroupEntry){
      case (?profileGroup){
        let profileResult = getProfileFromGroup(dto.principalId, profileGroup.1);
        switch(profileResult){
          case (?profile){

            let updatedProfile: T.Profile = {
              accountOnPause = profile.accountOnPause;
              bets = profile.bets;
              maxBetLimit = profile.maxBetLimit;
              maxBetLimitSet = profile.maxBetLimitSet;
              monthlyBetLimit = profile.monthlyBetLimit;
              monthlyBetLimitSet = profile.monthlyBetLimitSet;
              monthlyBetTotals = profile.monthlyBetTotals;
              monthlyProfitLoss = profile.monthlyProfitLoss;
              pauseEndDate = profile.pauseEndDate;
              principalId = profile.principalId;
              profilePicture = profile.profilePicture;
              profilePictureExtension = profile.profilePictureExtension;
              termsAcceptedDate = profile.termsAcceptedDate;
              username = dto.username;
              withdrawalAddress = profile.withdrawalAddress;
              joinedDate = profile.joinedDate;
              kycApprovalDate = profile.kycApprovalDate;
              kycRef = profile.kycRef;
              kycSubmissionDate = profile.kycSubmissionDate;
              kycComplete = profile.kycComplete;
            };
            updateProfile(updatedProfile, profileGroup.1);
            return #ok();
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

  public shared ({caller }) func updateProfilePicture(dto: RequestDTOs.UpdateProfilePictureDTO) : async Result.Result<(), T.Error>{
    assert Principal.toText(caller) == Environment.BACKEND_CANISTER_ID;
    let profileGroupEntry = Array.find<(Base.PrincipalId, Nat)>(profileGroupDictionary, 
      func(groupEntry: (Base.PrincipalId, Nat)) : Bool {
        groupEntry.0 == dto.principalId;
    });
    switch(profileGroupEntry){
      case (?profileGroup){
        let profileResult = getProfileFromGroup(dto.principalId, profileGroup.1);
        switch(profileResult){
          case (?profile){

            let updatedProfile: T.Profile = {
              accountOnPause = profile.accountOnPause;
              bets = profile.bets;
              maxBetLimit = profile.maxBetLimit;
              maxBetLimitSet = profile.maxBetLimitSet;
              monthlyBetLimit = profile.monthlyBetLimit;
              monthlyBetLimitSet = profile.monthlyBetLimitSet;
              monthlyBetTotals = profile.monthlyBetTotals;
              monthlyProfitLoss = profile.monthlyProfitLoss;
              pauseEndDate = profile.pauseEndDate;
              principalId = profile.principalId;
              profilePicture = ?dto.profilePicture;
              profilePictureExtension = dto.profilePictureExtension;
              termsAcceptedDate = profile.termsAcceptedDate;
              username = profile.username;
              withdrawalAddress = profile.withdrawalAddress;
              joinedDate = profile.joinedDate;
              kycApprovalDate = profile.kycApprovalDate;
              kycRef = profile.kycRef;
              kycSubmissionDate = profile.kycSubmissionDate;
              kycComplete = profile.kycComplete;
            };
            updateProfile(updatedProfile, profileGroup.1);
            return #ok();
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
  
  public shared ({caller }) func updateWithdrawalAddress(dto: RequestDTOs.UpdateWithdrawalAddressDTO) : async Result.Result<(), T.Error>{
    assert Principal.toText(caller) == Environment.BACKEND_CANISTER_ID;
    let profileGroupEntry = Array.find<(Base.PrincipalId, Nat)>(profileGroupDictionary, 
      func(groupEntry: (Base.PrincipalId, Nat)) : Bool {
        groupEntry.0 == dto.principalId;
    });
    switch(profileGroupEntry){
      case (?profileGroup){
        let profileResult = getProfileFromGroup(dto.principalId, profileGroup.1);
        switch(profileResult){
          case (?profile){

            let updatedProfile: T.Profile = {
              accountOnPause = profile.accountOnPause;
              bets = profile.bets;
              maxBetLimit = profile.maxBetLimit;
              maxBetLimitSet = profile.maxBetLimitSet;
              monthlyBetLimit = profile.monthlyBetLimit;
              monthlyBetLimitSet = profile.monthlyBetLimitSet;
              monthlyBetTotals = profile.monthlyBetTotals;
              monthlyProfitLoss = profile.monthlyProfitLoss;
              pauseEndDate = profile.pauseEndDate;
              principalId = profile.principalId;
              profilePicture = profile.profilePicture;
              profilePictureExtension = profile.profilePictureExtension;
              termsAcceptedDate = profile.termsAcceptedDate;
              username = profile.username;
              withdrawalAddress = dto.withdrawalAddress;
              joinedDate = profile.joinedDate;
              kycApprovalDate = profile.kycApprovalDate;
              kycRef = profile.kycRef;
              kycSubmissionDate = profile.kycSubmissionDate;
              kycComplete = profile.kycComplete;
            };
            updateProfile(updatedProfile, profileGroup.1);
            return #ok();
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
  
  public shared ({caller }) func pauseAccount(dto: RequestDTOs.PauseAccountDTO) : async Result.Result<(), T.Error>{
    assert Principal.toText(caller) == Environment.BACKEND_CANISTER_ID;
    let profileGroupEntry = Array.find<(Base.PrincipalId, Nat)>(profileGroupDictionary, 
      func(groupEntry: (Base.PrincipalId, Nat)) : Bool {
        groupEntry.0 == dto.principalId;
    });
    switch(profileGroupEntry){
      case (?profileGroup){
        let profileResult = getProfileFromGroup(dto.principalId, profileGroup.1);
        switch(profileResult){
          case (?profile){

            if(profile.accountOnPause){
              return #err(#NotAllowed);
            };

            let updatedProfile: T.Profile = {
              accountOnPause = true;
              bets = profile.bets;
              maxBetLimit = profile.maxBetLimit;
              maxBetLimitSet = profile.maxBetLimitSet;
              monthlyBetLimit = profile.monthlyBetLimit;
              monthlyBetLimitSet = profile.monthlyBetLimitSet;
              monthlyBetTotals = profile.monthlyBetTotals;
              monthlyProfitLoss = profile.monthlyProfitLoss;
              pauseEndDate = Time.now() + Utilities.convertDaysToNanosecondsInt(dto.pauseDays);
              principalId = profile.principalId;
              profilePicture = profile.profilePicture;
              profilePictureExtension = profile.profilePictureExtension;
              termsAcceptedDate = profile.termsAcceptedDate;
              username = profile.username;
              withdrawalAddress = profile.withdrawalAddress;
              joinedDate = profile.joinedDate;
              kycApprovalDate = profile.kycApprovalDate;
              kycRef = profile.kycRef;
              kycSubmissionDate = profile.kycSubmissionDate;
              kycComplete = profile.kycComplete;
            };
            updateProfile(updatedProfile, profileGroup.1);
            return #ok();
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
  
  public shared ({caller }) func setMaxBetLimit(dto: RequestDTOs.SetMaxBetLimit) : async Result.Result<(), T.Error>{
    assert Principal.toText(caller) == Environment.BACKEND_CANISTER_ID;
    let profileGroupEntry = Array.find<(Base.PrincipalId, Nat)>(profileGroupDictionary, 
      func(groupEntry: (Base.PrincipalId, Nat)) : Bool {
        groupEntry.0 == dto.principalId;
    });
    switch(profileGroupEntry){
      case (?profileGroup){
        let profileResult = getProfileFromGroup(dto.principalId, profileGroup.1);
        switch(profileResult){
          case (?profile){

            if(Time.now() < (profile.maxBetLimitSet + (Utilities.getDay() * 30))){
              return #err(#NotAllowed);
            };

            let updatedProfile: T.Profile = {
              accountOnPause = true;
              bets = profile.bets;
              maxBetLimit = dto.maxBetLimit;
              maxBetLimitSet = Time.now();
              monthlyBetLimit = profile.monthlyBetLimit;
              monthlyBetLimitSet = profile.monthlyBetLimitSet;
              monthlyBetTotals = profile.monthlyBetTotals;
              monthlyProfitLoss = profile.monthlyProfitLoss;
              pauseEndDate = profile.pauseEndDate;
              principalId = profile.principalId;
              profilePicture = profile.profilePicture;
              profilePictureExtension = profile.profilePictureExtension;
              termsAcceptedDate = profile.termsAcceptedDate;
              username = profile.username;
              withdrawalAddress = profile.withdrawalAddress;
              joinedDate = profile.joinedDate;
              kycApprovalDate = profile.kycApprovalDate;
              kycRef = profile.kycRef;
              kycSubmissionDate = profile.kycSubmissionDate;
              kycComplete = profile.kycComplete;
            };
            updateProfile(updatedProfile, profileGroup.1);
            return #ok();
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
  
  public shared ({caller }) func setMonthlyBetLimit(dto: RequestDTOs.SetMonthlyBetLimitDTO) : async Result.Result<(), T.Error>{
    assert Principal.toText(caller) == Environment.BACKEND_CANISTER_ID;
    let profileGroupEntry = Array.find<(Base.PrincipalId, Nat)>(profileGroupDictionary, 
      func(groupEntry: (Base.PrincipalId, Nat)) : Bool {
        groupEntry.0 == dto.principalId;
    });
    switch(profileGroupEntry){
      case (?profileGroup){
        let profileResult = getProfileFromGroup(dto.principalId, profileGroup.1);
        switch(profileResult){
          case (?profile){

            if(Time.now() < (profile.maxBetLimitSet + (Utilities.getDay() * 30))){
              return #err(#NotAllowed);
            };

            let updatedProfile: T.Profile = {
              accountOnPause = true;
              bets = profile.bets;
              maxBetLimit = profile.maxBetLimit;
              maxBetLimitSet = profile.maxBetLimitSet;
              monthlyBetLimit = dto.monthlyBetLimit;
              monthlyBetLimitSet = Time.now();
              monthlyBetTotals = profile.monthlyBetTotals;
              monthlyProfitLoss = profile.monthlyProfitLoss;
              pauseEndDate = profile.pauseEndDate;
              principalId = profile.principalId;
              profilePicture = profile.profilePicture;
              profilePictureExtension = profile.profilePictureExtension;
              termsAcceptedDate = profile.termsAcceptedDate;
              username = profile.username;
              withdrawalAddress = profile.withdrawalAddress;
              joinedDate = profile.joinedDate;
              kycApprovalDate = profile.kycApprovalDate;
              kycRef = profile.kycRef;
              kycSubmissionDate = profile.kycSubmissionDate;
              kycComplete = profile.kycComplete;
            };
            updateProfile(updatedProfile, profileGroup.1);
            return #ok();
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
  
  public shared ({caller }) func placeBet(dto: RequestDTOs.SubmitBetslipDTO) : async Result.Result<BettingTypes.BetSlip, T.Error>{
    assert Principal.toText(caller) == Environment.BACKEND_CANISTER_ID;
    //private function to update monthly bet totals should be added when a bet is placed
    //take the money
    //ensure they have the money
    return #err(#NotFound);
  };
  
  public shared ({caller }) func getBets(dto: RequestDTOs.GetBetsDTO) : async Result.Result<[BettingTypes.BetSlip], T.Error>{
    assert Principal.toText(caller) == Environment.BACKEND_CANISTER_ID;
    return #err(#NotFound);
  };
  
  public shared ({caller }) func updateSettledBet(principalId: Base.PrincipalId, betslip: BettingTypes.BetSlip) : async (){
    assert Principal.toText(caller) == Environment.BACKEND_CANISTER_ID;
    
    //Update the users totals for months etc
  };
  
  public shared ({caller }) func canisterFull() : async Bool{
    assert Principal.toText(caller) == Environment.BACKEND_CANISTER_ID;
    return false; //TODO
  };
  
  public shared ({caller }) func voidBet(betslip: BettingTypes.BetSlip) : async (){
    assert Principal.toText(caller) == Environment.BACKEND_CANISTER_ID;
    
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
      pauseEndDate = 0;
      principalId = principalId;
      profilePicture = null;
      profilePictureExtension = "";
      termsAcceptedDate = 0;
      username = "";
      withdrawalAddress = "";
      joinedDate = Time.now();
      kycApprovalDate = 0;
      kycRef = "";
      kycSubmissionDate = 0;
      kycComplete = false;
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

  private func updateProfile(updatedProfile: T.Profile, profileGroup: Nat) {
    var updatedProfiles: [T.Profile] = [];

    switch(profileGroup){
      case 1 {
        updatedProfiles := profileGroup1; 
      };
      case 2 {
        updatedProfiles := profileGroup2; 
      };
      case 3 {
        updatedProfiles := profileGroup3; 
      };
      case 4 {
        updatedProfiles := profileGroup4; 
      };
      case 5 {
        updatedProfiles := profileGroup5; 
      };
      case 6 {
        updatedProfiles := profileGroup6; 
      };
      case 7 {
        updatedProfiles := profileGroup7; 
      };
      case 8 {
        updatedProfiles := profileGroup8; 
      };
      case 9 {
        updatedProfiles := profileGroup9; 
      };
      case 10 {
        updatedProfiles := profileGroup10; 
      };
      case 11 {
        updatedProfiles := profileGroup11; 
      };
      case 12 {
        updatedProfiles := profileGroup12; 
      };
      case 13 {
        updatedProfiles := profileGroup13; 
      };
      case 14 {
        updatedProfiles := profileGroup14; 
      };
      case 15 {
        updatedProfiles := profileGroup15; 
      };
      case 16 {
        updatedProfiles := profileGroup16; 
      };
      case 17 {
        updatedProfiles := profileGroup17; 
      };
      case 18 {
        updatedProfiles := profileGroup18; 
      };
      case 19 {
        updatedProfiles := profileGroup19; 
      };
      case 20 {
        updatedProfiles := profileGroup20; 
      };
      case 21 {
        updatedProfiles := profileGroup21; 
      };
      case 22 {
        updatedProfiles := profileGroup22; 
      };
      case 23 {
        updatedProfiles := profileGroup23; 
      };
      case 24 {
        updatedProfiles := profileGroup24; 
      };
      case 25 {
        updatedProfiles := profileGroup25; 
      };
      case 26 {
        updatedProfiles := profileGroup26; 
      };
      case 27 {
        updatedProfiles := profileGroup27; 
      };
      case 28 {
        updatedProfiles := profileGroup28; 
      };
      case 29 {
        updatedProfiles := profileGroup29; 
      };
      case 30 {
        updatedProfiles := profileGroup30; 
      };
      case 31 {
        updatedProfiles := profileGroup31; 
      };
      case 32 {
        updatedProfiles := profileGroup32; 
      };
      case 33 {
        updatedProfiles := profileGroup33; 
      };
      case 34 {
        updatedProfiles := profileGroup34; 
      };
      case 35 {
        updatedProfiles := profileGroup35; 
      };
      case 36 {
        updatedProfiles := profileGroup36; 
      };
      case 37 {
        updatedProfiles := profileGroup37; 
      };
      case 38 {
        updatedProfiles := profileGroup38; 
      };
      case 39 {
        updatedProfiles := profileGroup39; 
      };
      case 40 {
        updatedProfiles := profileGroup40; 
      };
      case 41 {
        updatedProfiles := profileGroup41; 
      };
      case 42 {
        updatedProfiles := profileGroup42; 
      };
      case 43 {
        updatedProfiles := profileGroup43; 
      };
      case 44 {
        updatedProfiles := profileGroup44; 
      };
      case 45 {
        updatedProfiles := profileGroup45; 
      };
      case 46 {
        updatedProfiles := profileGroup46; 
      };
      case 47 {
        updatedProfiles := profileGroup47; 
      };
      case 48 {
        updatedProfiles := profileGroup48; 
      };
      case 49 {
        updatedProfiles := profileGroup49; 
      };
      case 50 {
        updatedProfiles := profileGroup50; 
      };
      
      case _ {}
    };
    updatedProfiles := Array.map<T.Profile, T.Profile>(updatedProfiles, func(profile: T.Profile){
      if(profile.principalId == updatedProfile.principalId){
        return {
          accountOnPause = updatedProfile.accountOnPause;
          bets = updatedProfile.bets;
          joinedDate = updatedProfile.joinedDate;
          kycApprovalDate = updatedProfile.kycApprovalDate;
          kycComplete = updatedProfile.kycComplete;
          kycRef = updatedProfile.kycRef;
          kycSubmissionDate = updatedProfile.kycSubmissionDate;
          maxBetLimit = updatedProfile.maxBetLimit;
          maxBetLimitSet = updatedProfile.maxBetLimitSet;
          monthlyBetLimit = updatedProfile.monthlyBetLimit;
          monthlyBetLimitSet = updatedProfile.monthlyBetLimitSet;
          monthlyBetTotals = updatedProfile.monthlyBetTotals;
          monthlyProfitLoss = updatedProfile.monthlyProfitLoss;
          pauseEndDate = updatedProfile.pauseEndDate;
          principalId = updatedProfile.principalId;
          profilePicture = updatedProfile.profilePicture;
          profilePictureExtension = updatedProfile.profilePictureExtension;
          termsAcceptedDate = updatedProfile.termsAcceptedDate;
          username = updatedProfile.username;
          withdrawalAddress = updatedProfile.withdrawalAddress;
        }
      } else {
        return profile;
      };
    });
    switch(profileGroup){
      case 1 {
        profileGroup1 := updatedProfiles;
      };
      case 2 {
        profileGroup2 := updatedProfiles;
      };
      case 3 {
        profileGroup3 := updatedProfiles;
      };
      case 4 {
        profileGroup4 := updatedProfiles;
      };
      case 5 {
        profileGroup5 := updatedProfiles;
      };
      case 6 {
        profileGroup6 := updatedProfiles;
      };
      case 7 {
        profileGroup7 := updatedProfiles;
      };
      case 8 {
        profileGroup8 := updatedProfiles;
      };
      case 9 {
        profileGroup9 := updatedProfiles;
      };
      case 10 {
        profileGroup10 := updatedProfiles;
      };
      case 11 {
        profileGroup11 := updatedProfiles;
      };
      case 12 {
        profileGroup12 := updatedProfiles;
      };
      case 13 {
        profileGroup13 := updatedProfiles;
      };
      case 14 {
        profileGroup14 := updatedProfiles;
      };
      case 15 {
        profileGroup15 := updatedProfiles;
      };
      case 16 {
        profileGroup16 := updatedProfiles;
      };
      case 17 {
        profileGroup17 := updatedProfiles;
      };
      case 18 {
        profileGroup18 := updatedProfiles;
      };
      case 19 {
        profileGroup19 := updatedProfiles;
      };
      case 20 {
        profileGroup20 := updatedProfiles;
      };
      case 21 {
        profileGroup21 := updatedProfiles;
      };
      case 22 {
        profileGroup22 := updatedProfiles;
      };
      case 23 {
        profileGroup23 := updatedProfiles;
      };
      case 24 {
        profileGroup24 := updatedProfiles;
      };
      case 25 {
        profileGroup25 := updatedProfiles;
      };
      case 26 {
        profileGroup26 := updatedProfiles;
      };
      case 27 {
        profileGroup27 := updatedProfiles;
      };
      case 28 {
        profileGroup28 := updatedProfiles;
      };
      case 29 {
        profileGroup29 := updatedProfiles;
      };
      case 30 {
        profileGroup30 := updatedProfiles;
      };
      case 31 {
        profileGroup31 := updatedProfiles;
      };
      case 32 {
        profileGroup32 := updatedProfiles;
      };
      case 33 {
        profileGroup33 := updatedProfiles;
      };
      case 34 {
        profileGroup34 := updatedProfiles;
      };
      case 35 {
        profileGroup35 := updatedProfiles;
      };
      case 36 {
        profileGroup36 := updatedProfiles;
      };
      case 37 {
        profileGroup37 := updatedProfiles;
      };
      case 38 {
        profileGroup38 := updatedProfiles;
      };
      case 39 {
        profileGroup39 := updatedProfiles;
      };
      case 40 {
        profileGroup40 := updatedProfiles;
      };
      case 41 {
        profileGroup41 := updatedProfiles;
      };
      case 42 {
        profileGroup42 := updatedProfiles;
      };
      case 43 {
        profileGroup43 := updatedProfiles;
      };
      case 44 {
        profileGroup44 := updatedProfiles;
      };
      case 45 {
        profileGroup45 := updatedProfiles;
      };
      case 46 {
        profileGroup46 := updatedProfiles;
      };
      case 47 {
        profileGroup47 := updatedProfiles;
      };
      case 48 {
        profileGroup48 := updatedProfiles;
      };
      case 49 {
        profileGroup49 := updatedProfiles;
      };
      case 50 {
        profileGroup50 := updatedProfiles;
      };
      case _ {}
    };
  };

  system func preupgrade() {
  };

  system func postupgrade() {
    ignore Timer.setTimer<system>(#nanoseconds(Int.abs(1)), postUpgradeCallback); 
  };
  
  private func postUpgradeCallback() : async (){ };



  public shared ({caller }) func getAllAuditUsers () : async [ResponseDTOs.UserDTO] {
    assert Principal.toText(caller) == Environment.BACKEND_CANISTER_ID;
    let allProfilesBuffer = Buffer.fromArray<ResponseDTOs.UserDTO>([]);

    for(i in Iter.range(1,50)){
      var currentProfiles: [T.Profile] = [];
      switch(i){
        case 1{
          currentProfiles := profileGroup1;
        };
        case _ {

        };
      };

      for(profile in Iter.fromArray(currentProfiles)){
        allProfilesBuffer.add({
          joinedDate = profile.joinedDate;
          kycApprovalDate = profile.kycApprovalDate;
          kycComplete = profile.kycComplete;
          kycRef = profile.kycRef;
          kycSubmissionDate = profile.kycSubmissionDate;
          principalId = profile.principalId;
          termsAcceptedDate = profile.termsAcceptedDate
        });
      };
    };

    return Buffer.toArray(allProfilesBuffer);
  };
};