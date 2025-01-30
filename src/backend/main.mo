import Array "mo:base/Array";
import Int "mo:base/Int";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Timer "mo:base/Timer";
import Nat64 "mo:base/Nat64";
import Buffer "mo:base/Buffer";
import Float "mo:base/Float";
import Iter "mo:base/Iter";
import Time "mo:base/Time";
import Debug "mo:base/Debug";
import Nat16 "mo:base/Nat16";

import T "types/app_types";
import Base "types/base_types";
import Countries "types/Countries";
import FootballTypes "types/football_types";
import Environment "environment";

import RequestDTOs "dtos/request_DTOs";
import ResponseDTOs "dtos/response_DTOs";

import FPLLedger "managers/fpl_ledger_manager";
import UserManager "managers/user_manager";
import OddsManager "managers/odds_manager";
import BettingTypes "types/betting_types";
import Utilities "utilities/utilities";
import Management "utilities/Management";
import ProfileCanister "canister_definitions/profile-canister";
import AppTypes "types/app_types";
import KYCManager "managers/kyc_manager";
import ShuftiTypes "types/shufti_types";

actor Self {

  private let ledger = FPLLedger.FPLLedger();
  private let userManager = UserManager.UserManager(); 
  private let oddsManager = OddsManager.OddsManager(); 
  private let kycManager = KYCManager.KYCManager();
  
  private stable var openBets: [BettingTypes.BetSlip] = [];
  private stable var totalBetsStaked: Nat64 = 0;
  private stable var totalPotentialPayout: Nat64 = 0;
  
  /* User management functions */

  public shared ({ caller }) func getProfile() : async Result.Result<ResponseDTOs.ProfileDTO, T.Error> {
    assert not Principal.isAnonymous(caller);
    let principalId = Principal.toText(caller);
    let kycProfile = kycManager.getKYCProfile(principalId);
    
    return await userManager.getProfile(principalId, kycProfile);
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

  public shared ({ caller }) func setMaxBetLimit(dto: RequestDTOs.SetMaxBetLimit) : async Result.Result<(), T.Error> {
    assert not Principal.isAnonymous(caller);
    let principalId = Principal.toText(caller);
    assert dto.principalId == principalId;
    return await userManager.setMaxBetLimit(dto);
  };

  public shared ({ caller }) func setMonthlyBetLimit(dto: RequestDTOs.SetMonthlyBetLimitDTO) : async Result.Result<(), T.Error> {
    assert not Principal.isAnonymous(caller);
    let principalId = Principal.toText(caller);
    assert dto.principalId == principalId;
    return await userManager.setMonthlyBetLimit(dto);
  };

  /* Data functions */

  //Giving me ic0 trap error
  public shared composite query func getPlayerDetailsForGameweek(leagueId: FootballTypes.LeagueId, dto: RequestDTOs.GameweekFiltersDTO) : async Result.Result<ResponseDTOs.PlayerDetailDTO, T.Error> {
    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      getPlayerDetailsForGameweek : shared query (leagueId: FootballTypes.LeagueId, dto: RequestDTOs.GameweekFiltersDTO) -> async Result.Result<ResponseDTOs.PlayerDetailDTO, T.Error>;
    };
    return await data_canister.getPlayerDetailsForGameweek(leagueId, dto);
  };

  public shared query func getDataHashes(): async Result.Result<[ResponseDTOs.DataHashDTO], T.Error> {
    return oddsManager.getDataHashes();
  };

  /* Application functions */

  public shared composite query ({ caller }) func getSystemState(applicationName: Text) : async Result.Result<ResponseDTOs.SystemStateDTO, T.Error>  {
    assert checkDataManager(Principal.toText(caller));
    switch(applicationName){
      case "OpenFPL" {
        let backend_canister = actor (Environment.OPENFPL_BACKEND_CANISTER_ID) : actor {
          getSystemState : shared query () -> async Result.Result<ResponseDTOs.SystemStateDTO, T.Error>;
        };
        return await backend_canister.getSystemState();
      };
      case "OpenWSL" {
        let backend_canister = actor (Environment.OPENWSL_BACKEND_CANISTER_ID) : actor {
          getSystemState : shared query () -> async Result.Result<ResponseDTOs.SystemStateDTO, T.Error>;
        };
        return await backend_canister.getSystemState();
      };
      case _ {
        return #err(#NotFound);
      }
    };
  };

  /* Betting functions */

  public shared query func getBettableHomepageFixtures(leagueId: FootballTypes.LeagueId) : async Result.Result<[ResponseDTOs.HomePageFixtureDTO], T.Error> {
    return #ok(oddsManager.getHomepageLeagueFixtures(leagueId));
  };

  public shared query func getMatchOdds(leagueId: FootballTypes.LeagueId, fixtureId: FootballTypes.FixtureId) : async Result.Result<ResponseDTOs.MatchOddsDTO, T.Error> {
    return oddsManager.getMatchOdds(leagueId, fixtureId);
  };
  
  public shared ({ caller }) func placeBet(dto: RequestDTOs.SubmitBetslipDTO) : async Result.Result<BettingTypes.BetSlip, T.Error>{
    assert not Principal.isAnonymous(caller);
    let principalId = Principal.toText(caller);
    assert dto.principalId == principalId;

    assert validateBetslip(dto);
    assert await betWithinPlatformLimits(dto.totalStake);

    let kycProfile = kycManager.getKYCProfile(principalId);

    let profileResult = await userManager.getProfile(principalId, kycProfile);
    switch(profileResult){
      case (#ok profile){
        assert not profile.accountOnPause;
        assert profile.kycComplete;
        assert profile.accountBalance >= dto.totalStake;
        assert profile.maxBetLimit >= dto.totalStake;
        assert profile.monthlyBetTotal + dto.totalStake <= profile.monthlyBetLimit;
      };
      case (#err error){
        return #err(error);
      }
    };

    let betslipResult = await userManager.placeBet(dto);
    switch(betslipResult){
      case (#ok betslip){

        let openBetsBuffer = Buffer.fromArray<BettingTypes.BetSlip>(openBets);
        openBetsBuffer.add(betslip);
        openBets := Buffer.toArray(openBetsBuffer);

        totalBetsStaked := calculateTotalStaked();
        totalPotentialPayout := calculateTotalPotentialPayout();
        return #ok(betslip);
      };
      case (#err error){
        return #err(error);
      }
    }
  };

  public shared ({ caller }) func getBets(dto: RequestDTOs.GetBetsDTO) : async Result.Result<[BettingTypes.BetSlip], T.Error>{
    assert not Principal.isAnonymous(caller);
    let principalId = Principal.toText(caller);
    assert dto.principalId == principalId;
    return await userManager.getBets(dto);
  };

  private func validateBetslip(dto: RequestDTOs.SubmitBetslipDTO) : Bool {

    //for the accumulator type
      //calculate the expected returns of each row and ensure what they expect from each users submission

      //get the object the frontend has to do the comparison

      //game is unplayed

    return false;
  };

  private func calculateTotalPotentialPayout() : Nat64 {
    return Array.foldLeft<BettingTypes.BetSlip, Nat64>(
        openBets,
        0,
        func(acc : Nat64, betslip : BettingTypes.BetSlip) : Nat64 {

          let totalPayouts = Array.foldLeft<BettingTypes.Selection, Nat64>(
            betslip.selections,
            0,
            func(acc: Nat64, selection: BettingTypes.Selection) : Nat64 {
              let betPayoutFloat: Float = Utilities.convertNat64ToFloat(selection.stake) * selection.odds;
              return acc + Utilities.convertFloatToNat64(betPayoutFloat);
            }
          );

          return acc + totalPayouts;
        },
      );
  };

  private func calculateTotalStaked() : Nat64 {
    return Array.foldLeft<BettingTypes.BetSlip, Nat64>(
        openBets,
        0,
        func(acc : Nat64, betslip : BettingTypes.BetSlip) : Nat64 {
          return acc + betslip.totalStake;
        },
      );
  };

  private func betWithinPlatformLimits(stake: Nat64) : async Bool {

    let ledgerBalance = await ledger.getPotBalance(Principal.fromActor(Self));
    
    let maxSingleBetStake: Nat64 = Nat64.div(ledgerBalance, 100);

    if(stake > maxSingleBetStake){
      return false;
    };
    
    if(totalPotentialPayout + stake > ledgerBalance){
      return false;
    };

    return true;
  };

  private func settleBets(completedFixtureId: FootballTypes.FixtureId) : async (){

    let updatedOpenBetsBuffer = Buffer.fromArray<BettingTypes.BetSlip>([]);
    for(bet in Iter.fromArray(openBets)){
      
      let unsettledSelections = Array.filter<BettingTypes.Selection>(bet.selections, 
        func(selection: BettingTypes.Selection){
          selection.result == #Open;
        }
      );

      let unsettledFixture = Array.find<BettingTypes.Selection>(bet.selections, 
        func(selection: BettingTypes.Selection) : Bool {
          selection.result == #Open and selection.fixtureId == completedFixtureId;
        }
      );

      let betCompletesSlip = Array.size(unsettledSelections) == 1 and Option.isSome(unsettledFixture);

      if(betCompletesSlip){
        await userManager.settleBet(bet);
      } else {
        updatedOpenBetsBuffer.add({
          betType = bet.betType;
          id = bet.id;
          placedBy = bet.placedBy;
          placedOn = bet.placedOn;
          selections = Array.map<BettingTypes.Selection, BettingTypes.Selection>(bet.selections, func(selection: BettingTypes.Selection){
            if(selection.fixtureId == completedFixtureId){
              return {
                fixtureId = selection.fixtureId;
                odds = selection.odds;
                result = selection.result;
                selectionDetail = selection.selectionDetail;
                selectionType = selection.selectionType;
                stake = selection.stake;
                status = #Settled;
                winnings = selection.winnings;
                expectedReturns = selection.expectedReturns;
                leagueId = selection.leagueId;
              }
            } else { return selection; };
          });
          status = bet.status;
          result = bet.result;
          totalStake = bet.totalStake;
          expectedReturns = bet.expectedReturns;
          totalWinnings = bet.totalWinnings;
          settledOn = Time.now();
        });
      };
    }; 

    totalBetsStaked := calculateTotalStaked();
    totalPotentialPayout := calculateTotalPotentialPayout();
  };

  /* Stable variable backup for managers */

  //User Manager
  private stable var stable_profile_canister_ids: [(Base.PrincipalId, Base.CanisterId)] = [];
  private stable var stable_unique_profile_canister_ids: [Base.CanisterId] = [];
  private stable var stable_active_profile_canister_id: Text = "";
  private stable var stable_usernames: [(Base.PrincipalId, Text)] = [];
  private stable var stable_kyc_profiles: [(Base.PrincipalId, AppTypes.KYCProfile)] = [];

  //Odds Manager
  private stable var stable_match_odds_cache: [(FootballTypes.LeagueId, [(FootballTypes.FixtureId, BettingTypes.MatchOdds)])] = [];

  system func preupgrade() {
    stable_profile_canister_ids := userManager.getStableProfileCanisterIds();
    stable_unique_profile_canister_ids := userManager.getStableUniqueProfileCanisterIds();
    stable_active_profile_canister_id := userManager.getStableActiveProfileCanisterId();
    stable_usernames := userManager.getStableUsernames();
    stable_match_odds_cache := oddsManager.getStableMatchOddsCache();

    stable_kyc_profiles := kycManager.getStableKYCProfiles();
  };

  system func postupgrade() {
    
    userManager.setStableProfileCanisterIds(stable_profile_canister_ids);
    userManager.setStableUniqueProfileCanisterIds(stable_unique_profile_canister_ids);
    userManager.setStableActiveProfileCanisterId(stable_active_profile_canister_id);
    userManager.setStableUsernames(stable_usernames);
    oddsManager.setStableMatchOddsCache(stable_match_odds_cache);

    kycManager.setStableKYCProfiles(stable_kyc_profiles);

    ignore Timer.setTimer<system>(#nanoseconds(Int.abs(1)), postUpgradeCallback); 
  };

  private func postUpgradeCallback() : async (){
    //await oddsManager.recalculate(1);
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

  /* Admin functions */
  //TODO: Remove when handed back to the SNS

  public shared ({ caller }) func isAdmin() : async Result.Result<Bool, T.Error> {
    return #ok(checkAdmin(Principal.toText(caller)));
  };

  public shared ({ caller }) func isDataManager() : async Result.Result<Bool, T.Error> {
    return #ok(checkDataManager(Principal.toText(caller)));
  };
  
  private func checkAdmin(principalId: Text) : Bool {
    return Option.isSome(Array.find<Base.PrincipalId>(Environment.ADMIN_PRINCIPALS, func(dataAdmin: Base.PrincipalId) : Bool{
      dataAdmin == principalId;
    }));
  };
  
  private func checkDataManager(principalId: Text) : Bool {
    return Option.isSome(Array.find<Base.PrincipalId>(Environment.DATA_MANAGER_PRINCIPALS, func(dataAdmin: Base.PrincipalId) : Bool{
      dataAdmin == principalId;
    }));
  };

  public shared ({ caller }) func updateSystemState(applicationName: Text, dto : RequestDTOs.UpdateAppStatusDTO) : async Result.Result<(), T.Error> {
    assert checkAdmin(Principal.toText(caller));
    switch(applicationName){
      case "OpenFPL" {
        let backend_canister = actor (Environment.OPENFPL_BACKEND_CANISTER_ID) : actor {
          updateSystemState : (dto : RequestDTOs.UpdateAppStatusDTO) -> async Result.Result<(), T.Error>;
        };
        return await backend_canister.updateSystemState(dto);
      };
      case "OpenWSL" {
        
        let backend_canister = actor (Environment.OPENWSL_BACKEND_CANISTER_ID) : actor {
          updateSystemState : (dto : RequestDTOs.UpdateAppStatusDTO) -> async Result.Result<(), T.Error>;
        };
        return await backend_canister.updateSystemState(dto);

      };
      case _ {
        return #err(#NotFound);
      }
    };
  };

  public shared ({ caller }) func snapshotManagers(applicationName: Text) : async Result.Result<(), T.Error> {
    assert checkAdmin(Principal.toText(caller));
    switch(applicationName){
      case "OpenFPL" {
        let backend_canister = actor (Environment.OPENFPL_BACKEND_CANISTER_ID) : actor {
          snapshotManagers : () -> async Result.Result<(), T.Error>;
        };
        let _ = await backend_canister.snapshotManagers();
        return #ok();
      };
      case "OpenWSL" {
        
        let backend_canister = actor (Environment.OPENWSL_BACKEND_CANISTER_ID) : actor {
          snapshotManagers : () -> async Result.Result<(), T.Error>;
        };
        let _ = await backend_canister.snapshotManagers();
        return #ok();
      };
      case _ {
        return #err(#NotFound);
      }
    };
  };

  public shared ({ caller }) func calculateGameweekScores(applicationName: Text) : async Result.Result<(), T.Error> {
    assert checkAdmin(Principal.toText(caller));
    switch(applicationName){
      case "OpenFPL" {
        let backend_canister = actor (Environment.OPENFPL_BACKEND_CANISTER_ID) : actor {
          calculateGameweekScores : () -> async Result.Result<(), T.Error>;
        };
        let _ = await backend_canister.calculateGameweekScores();
        return #ok();
      };
      case "OpenWSL" {
        
        let backend_canister = actor (Environment.OPENWSL_BACKEND_CANISTER_ID) : actor {
          calculateGameweekScores : () -> async Result.Result<(), T.Error>;
        };
        let _ = await backend_canister.calculateGameweekScores();
        return #ok();
      };
      case _ {
        return #err(#NotFound);
      }
    };
  };

  public shared ({ caller }) func calculateLeaderboards(applicationName: Text) : async Result.Result<(), T.Error> {
    assert checkAdmin(Principal.toText(caller));
    switch(applicationName){
      case "OpenFPL" {
        let backend_canister = actor (Environment.OPENFPL_BACKEND_CANISTER_ID) : actor {
          calculateLeaderboards : () -> async Result.Result<(), T.Error>;
        };
        let _ = await backend_canister.calculateLeaderboards();
        return #ok();
      };
      case "OpenWSL" {
        
        let backend_canister = actor (Environment.OPENWSL_BACKEND_CANISTER_ID) : actor {
          calculateLeaderboards : () -> async Result.Result<(), T.Error>;
        };
        let _ = await backend_canister.calculateLeaderboards();
        return #ok();
      };
      case _ {
        return #err(#NotFound);
      }
    };
  };

  public shared ({ caller }) func calculateWeeklyRewards(applicationName: Text, gameweek: FootballTypes.GameweekNumber) : async Result.Result<(), T.Error> {
    assert checkAdmin(Principal.toText(caller));
    switch(applicationName){
      case "OpenFPL" {
        let backend_canister = actor (Environment.OPENFPL_BACKEND_CANISTER_ID) : actor {
          calculateWeeklyRewards : (gameweek: FootballTypes.GameweekNumber) -> async Result.Result<(), T.Error>;
        };
        let _ = await backend_canister.calculateWeeklyRewards(gameweek);
        return #ok();
      };
      case "OpenWSL" {
        
        let backend_canister = actor (Environment.OPENWSL_BACKEND_CANISTER_ID) : actor {
          calculateWeeklyRewards : (gameweek: FootballTypes.GameweekNumber) -> async Result.Result<(), T.Error>;
        };
        let _ = await backend_canister.calculateWeeklyRewards(gameweek);
        return #ok();
      };
      case _ {
        return #err(#NotFound);
      }
    };
  };

  public shared ({ caller }) func payWeeklyRewards(applicationName: Text, gameweek: FootballTypes.GameweekNumber) : async Result.Result<(), T.Error> {
    assert checkAdmin(Principal.toText(caller));
    switch(applicationName){
      case "OpenFPL" {
        let backend_canister = actor (Environment.OPENFPL_BACKEND_CANISTER_ID) : actor {
          payWeeklyRewards : (gameweek: FootballTypes.GameweekNumber) -> async Result.Result<(), T.Error>;
        };
        let _ = await backend_canister.payWeeklyRewards(gameweek);
        return #ok();
      };
      case "OpenWSL" {
        
        let backend_canister = actor (Environment.OPENWSL_BACKEND_CANISTER_ID) : actor {
          payWeeklyRewards : (gameweek: FootballTypes.GameweekNumber) -> async Result.Result<(), T.Error>;
        };
        let _ = await backend_canister.payWeeklyRewards(gameweek);
        return #ok();
      };
      case _ {
        return #err(#NotFound);
      }
    };
  };

  //TODO: This will be admin for now then removed, based on the game beginning and also whether the data is up to date

  public shared ({ caller }) func isAuditor() : async Result.Result<Bool, T.Error> {
    return #ok(checkAuditor(Principal.toText(caller)));
  };

  public shared ({ caller }) func getUserAudit(offset: Nat) : async Result.Result<ResponseDTOs.UserAuditDTO, T.Error> {
    assert checkAuditor(Principal.toText(caller));
    let allAuditUsers = await userManager.getAllAuditUsers(offset); 
    return #ok({
      date = Time.now();
      users = allAuditUsers;
      offset = offset;
    });
  };
  
  private func checkAuditor(principalId: Text) : Bool {
    return Option.isSome(Array.find<Base.PrincipalId>(Environment.AUDITOR_PRINCIPALS, func(dataAdmin: Base.PrincipalId) : Bool{
      dataAdmin == principalId;
    }));
  };

  public shared ({ caller }) func updateBettingOdds(leagueId: FootballTypes.LeagueId) : async Result.Result<(), T.Error> {
    assert Principal.toText(caller) == Environment.DATA_CANISTER_ID;
    await oddsManager.recalculate(leagueId);
    return #ok();
  };

  //KYC Functions
  public shared ({ caller }) func storeKYCReference(kycReference: Text) : async (){
    assert not Principal.isAnonymous(caller);
    let principalId = Principal.toText(caller);
    kycManager.storeKYCReference(kycReference, principalId);
  };

  public shared func kycVerificationCallback(response: ShuftiTypes.ShuftiResponse) : async Result.Result<(), T.Error> {
    let principalResult = kycManager.storeVerificationResponse(response);

    switch(principalResult){
      case (?principalId){
        await userManager.verifyBettingAccount(principalId);
        return #ok();
      };
      case (null){}
    };
    return #err(#NotFound);
  };
   
};
