import Array "mo:base/Array";
import Int "mo:base/Int";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Timer "mo:base/Timer";

import T "types/app_types";
import Base "types/base_types";
import Countries "types/Countries";
import FootballTypes "types/football_types";
import Environment "environment";

import DTOs "dtos/DTOs";
import GovernanceDTOs "dtos/governance_DTOs";
import RequestDTOs "dtos/request_DTOs";
import ResponseDTOs "dtos/response_DTOs";

import UserManager "managers/user_manager";
import OddsManager "managers/odds_manager";

actor Self {
  
  private let userManager = UserManager.UserManager(); 
  private let oddsManager = OddsManager.OddsManager(); 
  
  /* User management functions */

  public shared query ({ caller }) func getProfile() : async Result.Result<DTOs.ProfileDTO, T.Error> {
    let profile = userManager.getProfile(Principal.toText(caller));
    switch(profile){
      case (?foundProfile){
        return #ok(foundProfile);
      };
      case (null){
        return #err(#NotFound);
      }
    }
  };

  /* Data functions */

  public shared query func getCountries() : async Result.Result<[DTOs.CountryDTO], T.Error> {
    return #ok(Countries.countries);
  };

  public shared composite query func getLeagues() : async Result.Result<[DTOs.FootballLeagueDTO], T.Error> {
    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      getLeagues : shared query () -> async Result.Result<[FootballTypes.League], T.Error>;
    };
    return await data_canister.getLeagues();
  };

  public shared composite query func getLeagueClubs(leagueId: FootballTypes.LeagueId) : async Result.Result<[DTOs.ClubDTO], T.Error> {
    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      getClubs : shared query (leagueId: FootballTypes.LeagueId) -> async Result.Result<[DTOs.ClubDTO], T.Error>;
    };
    return await data_canister.getClubs(leagueId);
  };

  public shared composite query func getLeaguePlayers(leagueId: FootballTypes.LeagueId) : async Result.Result<[DTOs.PlayerDTO], T.Error> {  
    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      getPlayers : shared query (leagueId: FootballTypes.LeagueId) -> async Result.Result<[DTOs.PlayerDTO], T.Error>;
    };
    return await data_canister.getPlayers(leagueId);
  };

  public shared composite query func getSeasons(leagueId: FootballTypes.LeagueId) : async Result.Result<[DTOs.SeasonDTO], T.Error>  {
    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      getSeasons : shared query (leagueId: FootballTypes.LeagueId) -> async Result.Result<[DTOs.SeasonDTO], T.Error>;
    };
    return await data_canister.getSeasons(leagueId);
  };

  public shared composite query func getFixtures(dto: RequestDTOs.GetFixturesDTO) : async Result.Result<[DTOs.FixtureDTO], T.Error>  {
    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      getFixtures : shared query (dto: RequestDTOs.GetFixturesDTO) -> async Result.Result<[DTOs.FixtureDTO], T.Error>;
    };
    return await data_canister.getFixtures(dto);
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

  /* Governance validation functions */

  //Player Validation Functions

  public shared query ({ caller }) func validateRevaluePlayerUp(dto : GovernanceDTOs.RevaluePlayerUpDTO) : async Base.RustResult {
    assert Principal.toText(caller) == Environment.OPENFPL_GOVERNANCE_CANISTER_ID;
    
    //TODO(Kelly): 
      //What are the checks that ensure this data is always valid

    return #Ok("Valid");
  };

  public shared query ({ caller }) func validateRevaluePlayerDown(dto : GovernanceDTOs.RevaluePlayerDownDTO) : async Base.RustResult {
    assert Principal.toText(caller) == Environment.OPENFPL_GOVERNANCE_CANISTER_ID;
    
    //TODO(Kelly): 
      //What are the checks that ensure this data is always valid

    return #Ok("Valid");
  };

  public shared query ({ caller }) func validateTransferPlayer(dto : GovernanceDTOs.TransferPlayerDTO) : async Base.RustResult {
    assert Principal.toText(caller) == Environment.OPENFPL_GOVERNANCE_CANISTER_ID;
    
    //TODO(Kelly): 
      //What are the checks that ensure this data is always valid

    return #Ok("Valid");
  };

  public shared query ({ caller }) func validateSetFreeAgent(dto : GovernanceDTOs.TransferPlayerDTO) : async Base.RustResult {
    assert Principal.toText(caller) == Environment.OPENFPL_GOVERNANCE_CANISTER_ID;
    
    //TODO(Kelly): 
      //What are the checks that ensure this data is always valid

    return #Ok("Valid");
  };

  public shared query ({ caller }) func validateLoanPlayer(dto : GovernanceDTOs.LoanPlayerDTO) : async Base.RustResult {
    assert Principal.toText(caller) == Environment.OPENFPL_GOVERNANCE_CANISTER_ID;
    
    //TODO(Kelly): 
      //What are the checks that ensure this data is always valid

    return #Ok("Valid");
  };

  public shared query ({ caller }) func validateRecallPlayer(dto : GovernanceDTOs.RecallPlayerDTO) : async Base.RustResult {
    assert Principal.toText(caller) == Environment.OPENFPL_GOVERNANCE_CANISTER_ID;
    
    //TODO(Kelly): 
      //What are the checks that ensure this data is always valid

    return #Ok("Valid");
  };

  public shared query ({ caller }) func validateCreatePlayer(dto : GovernanceDTOs.CreatePlayerDTO) : async Base.RustResult {
    assert Principal.toText(caller) == Environment.OPENFPL_GOVERNANCE_CANISTER_ID;
    
    //TODO(Kelly): 
      //What are the checks that ensure this data is always valid

    return #Ok("Valid");
  };

  public shared query ({ caller }) func validateUpdatePlayer(dto : GovernanceDTOs.UpdatePlayerDTO) : async Base.RustResult {
    assert Principal.toText(caller) == Environment.OPENFPL_GOVERNANCE_CANISTER_ID;
    
    //TODO(Kelly): 
      //What are the checks that ensure this data is always valid

    return #Ok("Valid");
  };

  public shared query ({ caller }) func validateSetPlayerInjury(dto : GovernanceDTOs.SetPlayerInjuryDTO) : async Base.RustResult {
    assert Principal.toText(caller) == Environment.OPENFPL_GOVERNANCE_CANISTER_ID;
    
    //TODO(Kelly): 
      //What are the checks that ensure this data is always valid

    return #Ok("Valid");
  };

  public shared query ({ caller }) func validateRetirePlayer(dto : GovernanceDTOs.RetirePlayerDTO) : async Base.RustResult {
    assert Principal.toText(caller) == Environment.OPENFPL_GOVERNANCE_CANISTER_ID;
    
    //TODO(Kelly): 
      //What are the checks that ensure this data is always valid

    return #Ok("Valid");
  };

  public shared query ({ caller }) func validateUnretirePlayer(dto : GovernanceDTOs.UnretirePlayerDTO) : async Base.RustResult {
    assert Principal.toText(caller) == Environment.OPENFPL_GOVERNANCE_CANISTER_ID;
    
    //TODO(Kelly): 
      //What are the checks that ensure this data is always valid

    return #Ok("Valid");
  };

  //Fixture Validation Functions

  public shared query ({ caller }) func validateAddInitialFixtures(dto : GovernanceDTOs.AddInitialFixturesDTO) : async Base.RustResult {
   assert Principal.toText(caller) == Environment.OPENFPL_GOVERNANCE_CANISTER_ID;
    
    //TODO(Kelly): 
      //What are the checks that ensure this data is always valid

    return #Ok("Valid");
  };

  public shared query ({ caller }) func validateSubmitFixtureData(dto : GovernanceDTOs.SubmitFixtureDataDTO) : async Base.RustResult {
    assert Principal.toText(caller) == Environment.OPENFPL_GOVERNANCE_CANISTER_ID;
    
    //TODO(Kelly): 
      //What are the checks that ensure this data is always valid

    return #Ok("Valid");
  };

  public shared query ({ caller }) func validateMoveFixture(dto : GovernanceDTOs.MoveFixtureDTO) : async Base.RustResult {
    assert Principal.toText(caller) == Environment.OPENFPL_GOVERNANCE_CANISTER_ID;
    
    //TODO(Kelly): 
      //What are the checks that ensure this data is always valid

    return #Ok("Valid");
  };

  public shared query ({ caller }) func validatePostponeFixture(dto : GovernanceDTOs.PostponeFixtureDTO) : async Base.RustResult {
    assert Principal.toText(caller) == Environment.OPENFPL_GOVERNANCE_CANISTER_ID;
    
    //TODO(Kelly): 
      //What are the checks that ensure this data is always valid

    return #Ok("Valid");
  };

  public shared query ({ caller }) func validateRescheduleFixture(dto : GovernanceDTOs.RescheduleFixtureDTO) : async Base.RustResult {
    assert Principal.toText(caller) == Environment.OPENFPL_GOVERNANCE_CANISTER_ID;
    
    //TODO(Kelly): 
      //What are the checks that ensure this data is always valid

    return #Ok("Valid");
  };

  //Club Validation Functions

  public shared query ({ caller }) func validatePromoteClub(dto : GovernanceDTOs.PromoteClubDTO) : async Base.RustResult {
    assert Principal.toText(caller) == Environment.OPENFPL_GOVERNANCE_CANISTER_ID;
    
    //TODO(Kelly): 
      //What are the checks that ensure this data is always valid

    return #Ok("Valid");
  };

  public shared query ({ caller }) func validateUpdateClub(dto : GovernanceDTOs.UpdateClubDTO) : async Base.RustResult {
    assert Principal.toText(caller) == Environment.OPENFPL_GOVERNANCE_CANISTER_ID;
    
    //TODO(Kelly): 
      //What are the checks that ensure this data is always valid

    return #Ok("Valid");
  };

  //League Validation Functions

  public shared query ({ caller }) func validateCreateLeague(dto : GovernanceDTOs.CreateLeagueDTO) : async Base.RustResult {
    assert Principal.toText(caller) == Environment.OPENFPL_GOVERNANCE_CANISTER_ID;
    
    //TODO(Kelly): 
      //What are the checks that ensure this data is always valid

    return #Ok("Valid");
  };

  public shared query ({ caller }) func validateUpdateLeague(dto : GovernanceDTOs.UpdateLeagueDTO) : async Base.RustResult {
    assert Principal.toText(caller) == Environment.OPENFPL_GOVERNANCE_CANISTER_ID;
    
    //TODO(Kelly): 
      //What are the checks that ensure this data is always valid

    return #Ok("Valid");
  };

  /* Governance execution functions */

  //Player Execution Functions

  public shared ({ caller }) func executeRevaluePlayerUp(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.RevaluePlayerUpDTO) : async () {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.OPENFPL_GOVERNANCE_CANISTER_ID;
    assert checkDataManager(Principal.toText(caller));

    //TODO: Implement validation check

    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      revaluePlayerUp : (leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.RevaluePlayerUpDTO) -> async Result.Result<(), T.Error>;
    };
    let _ = await data_canister.revaluePlayerUp(leagueId, dto);
    return;
  };

  public shared ({ caller }) func executeRevaluePlayerDown(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.RevaluePlayerDownDTO) : async () {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.OPENFPL_GOVERNANCE_CANISTER_ID;
    assert checkDataManager(Principal.toText(caller));

    //TODO: Implement validation check

    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      revaluePlayerDown : (leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.RevaluePlayerDownDTO) -> async Result.Result<(), T.Error>;
    };
    let _ = await data_canister.revaluePlayerDown(leagueId, dto);
    return;
  };

  public shared ({ caller }) func executeTransferPlayer(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.TransferPlayerDTO) : async () {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.OPENFPL_GOVERNANCE_CANISTER_ID;
    assert checkDataManager(Principal.toText(caller));

    //TODO: Implement validation check
    
    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      transferPlayer : (leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.TransferPlayerDTO) -> async Result.Result<(), T.Error>;
    };
    let _ = await data_canister.transferPlayer(leagueId, dto);
    return;
  };

  public shared ({ caller }) func executeSetFreeAgent(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.SetFreeAgentDTO) : async () {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.OPENFPL_GOVERNANCE_CANISTER_ID;
    assert checkDataManager(Principal.toText(caller));

    //TODO: Implement validation check
    
    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      setFreeAgent : (leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.SetFreeAgentDTO) -> async Result.Result<(), T.Error>;
    };
    let _ = await data_canister.setFreeAgent(leagueId, dto);
    return;
  };

  public shared ({ caller }) func executeLoanPlayer(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.LoanPlayerDTO) : async () {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.OPENFPL_GOVERNANCE_CANISTER_ID;
    assert checkDataManager(Principal.toText(caller));

    //TODO: Implement validation check

    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      loanPlayer : (leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.LoanPlayerDTO) -> async Result.Result<(), T.Error>;
    };
    let _ =  await data_canister.loanPlayer(leagueId, dto);
    return;
  };

  public shared ({ caller }) func executeRecallPlayer(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.RecallPlayerDTO) : async () {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.OPENFPL_GOVERNANCE_CANISTER_ID;
    assert checkDataManager(Principal.toText(caller));

    //TODO: Implement validation check

    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      recallPlayer : (leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.RecallPlayerDTO) -> async Result.Result<(), T.Error>;
    };
    let _ = await data_canister.recallPlayer(leagueId, dto);
    return;
  };

  public shared ({ caller }) func executeCreatePlayer(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.CreatePlayerDTO) : async () {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.OPENFPL_GOVERNANCE_CANISTER_ID;
    assert checkDataManager(Principal.toText(caller));

    //TODO: Implement validation check

    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      createPlayer : (leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.CreatePlayerDTO) -> async Result.Result<(), T.Error>;
    };
    let _ = await data_canister.createPlayer(leagueId, dto);
    return;
  };

  public shared ({ caller }) func executeUpdatePlayer(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.UpdatePlayerDTO) : async () {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.OPENFPL_GOVERNANCE_CANISTER_ID;
    assert checkDataManager(Principal.toText(caller));

    //TODO: Implement validation check

    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      updatePlayer : (leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.UpdatePlayerDTO) -> async Result.Result<(), T.Error>;
    };
    let _ = await data_canister.updatePlayer(leagueId, dto);
    return;
  };

  public shared ({ caller }) func executeSetPlayerInjury(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.SetPlayerInjuryDTO) : async () {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.OPENFPL_GOVERNANCE_CANISTER_ID;
    assert checkDataManager(Principal.toText(caller));

    //TODO: Implement validation check

    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
        setPlayerInjury : (leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.SetPlayerInjuryDTO) -> async Result.Result<(), T.Error>;
      };
    let _ = await data_canister.setPlayerInjury(leagueId, dto);
    return;
  };

  public shared ({ caller }) func executeRetirePlayer(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.RetirePlayerDTO) : async () {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.OPENFPL_GOVERNANCE_CANISTER_ID;
    assert checkDataManager(Principal.toText(caller));

    //TODO: Implement validation check

    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      retirePlayer : (leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.RetirePlayerDTO) -> async Result.Result<(), T.Error>;
    };
    let _ = await data_canister.retirePlayer(leagueId, dto);    
    return;
  };

  public shared ({ caller }) func executeUnretirePlayer(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.UnretirePlayerDTO) : async () {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.OPENFPL_GOVERNANCE_CANISTER_ID;
    assert checkDataManager(Principal.toText(caller));

    //TODO: Implement validation check

    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      unretirePlayer : (leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.UnretirePlayerDTO) -> async Result.Result<(), T.Error>;
    };
    let _ = await data_canister.unretirePlayer(leagueId, dto);
    return;
  };

  //Fixture Execution Functions

  public shared ({ caller }) func executeAddInitialFixtures(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.AddInitialFixturesDTO) : async () {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.OPENFPL_GOVERNANCE_CANISTER_ID;
    assert checkDataManager(Principal.toText(caller));

    //TODO Implement
    return;
  };

  public shared ({ caller }) func executeMoveFixture(dto: GovernanceDTOs.MoveFixtureDTO) : async () {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.OPENFPL_GOVERNANCE_CANISTER_ID;
    assert checkDataManager(Principal.toText(caller));
    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      moveFixture : (dto : GovernanceDTOs.MoveFixtureDTO) -> async Result.Result<(), T.Error>;
    };
    let _ = await data_canister.moveFixture(dto);
    return;
  };

  public shared ({ caller }) func executePostponeFixture(dto : GovernanceDTOs.PostponeFixtureDTO) : async () {
   //assert Principal.toText(caller) == NetworkEnvironmentVariables.OPENFPL_GOVERNANCE_CANISTER_ID;
    assert checkDataManager(Principal.toText(caller));
    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      postponeFixture : (dto : GovernanceDTOs.PostponeFixtureDTO) -> async Result.Result<(), T.Error>;
    };
    let _ = await data_canister.postponeFixture(dto);
    return;
  };

  public shared ({ caller }) func executeRescheduleFixture(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.RescheduleFixtureDTO) : async () {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.OPENFPL_GOVERNANCE_CANISTER_ID;
    assert checkDataManager(Principal.toText(caller));

    //TODO Implement
    return;
  };

  //Club Execution Functions

  public shared ({ caller }) func executePromoteClub(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.PromoteClubDTO) : async () {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.OPENFPL_GOVERNANCE_CANISTER_ID;
    assert checkDataManager(Principal.toText(caller));

    //TODO Implement
    return;
  };

  public shared ({ caller }) func executeUpdateClub(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.UpdateClubDTO) : async () {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.OPENFPL_GOVERNANCE_CANISTER_ID;
    assert checkDataManager(Principal.toText(caller));

    //TODO Implement
    return;
  }; 

  //League Execution Functions

  public shared ({ caller }) func executeCreateLeague(dto : GovernanceDTOs.CreateLeagueDTO) : async () {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.OPENFPL_GOVERNANCE_CANISTER_ID;
    assert checkDataManager(Principal.toText(caller));
    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      createLeague : (dto : GovernanceDTOs.CreateLeagueDTO) -> async Result.Result<(), T.Error>;
    };
    let _ = await data_canister.createLeague( dto);
    return;
  };

  public shared ({ caller }) func executeUpdateLeague(dto : GovernanceDTOs.UpdateLeagueDTO) : async () {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.OPENFPL_GOVERNANCE_CANISTER_ID;
    assert checkDataManager(Principal.toText(caller));
    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      updateLeague : (dto : GovernanceDTOs.UpdateLeagueDTO) -> async Result.Result<(), T.Error>;
    };
    let _ = await data_canister.updateLeague(dto);
    return;
  };

  public shared ({ caller }) func executeSubmitFixtureData(dto : GovernanceDTOs.SubmitFixtureDataDTO) : async () {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.OPENFPL_GOVERNANCE_CANISTER_ID;
    assert checkDataManager(Principal.toText(caller));
   
    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      submitFixtureData : (dto : GovernanceDTOs.SubmitFixtureDataDTO) -> async Result.Result<(), T.Error>;
    };
    let _ = await data_canister.submitFixtureData(dto);
    return;
  };

  public shared ({ caller }) func executeCreateClub(dto : GovernanceDTOs.CreateClubDTO) : async () {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.OPENFPL_GOVERNANCE_CANISTER_ID;
    assert checkDataManager(Principal.toText(caller));
    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      createClub : (dto : GovernanceDTOs.CreateClubDTO) -> async Result.Result<(), T.Error>;
    };
    let _ = await data_canister.createClub(dto);
    return;
  };

  public shared ({ caller }) func executeRemoveClub(dto : GovernanceDTOs.RemoveClubDTO) : async () {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.OPENFPL_GOVERNANCE_CANISTER_ID;
    assert checkDataManager(Principal.toText(caller));
    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      removeClub : (dto : GovernanceDTOs.RemoveClubDTO) -> async Result.Result<(), T.Error>;
    };
    let _ = await data_canister.removeClub(dto);
    return;
  };

  /* Betting functions */

  public shared query func getBettableLeagueFixtures(leagueId: FootballTypes.LeagueId) : async Result.Result<[ResponseDTOs.BettableFixtureDTO], T.Error> {
    return oddsManager.getBettableLeagueFixtures(leagueId);
  };

  public shared query func getBettableFixture(leagueId: FootballTypes.LeagueId, fixtureId: FootballTypes.FixtureId) : async Result.Result<[ResponseDTOs.BettableFixtureDTO], T.Error> {
    return oddsManager.getBettableFixture(leagueId, fixtureId);
  };

  public shared ({ caller }) func placeBet(dto: RequestDTOs.SubmitBetslipDTO) : async Result.Result<(), T.Error>{
    assert not Principal.isAnonymous(caller);
    //TODO: Check user can place bet
      //User has done KYC
      //account not on hold
      //has balance for bet
      //bet not too big
        //within their limits
        //within single bet limit
        //within site bet limit
        //within treasury max percentage limit
        //can have bets cos not too many placed
    return oddsManager.placeBet(dto);
  };

  public shared ({ caller }) func getBets(dto: RequestDTOs.GetBetsDTO) : async Result.Result<(), T.Error>{
    assert not Principal.isAnonymous(caller);
    return oddsManager.getBets(dto);
  };

  /* Stable variable backup for managers */

  //TODO
  //User Manager

  //Odds Manager

  system func postupgrade() {
    ignore Timer.setTimer<system>(#nanoseconds(Int.abs(1)), postUpgradeCallback); 
  };

  private func postUpgradeCallback() : async (){};

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

  public shared ({ caller }) func updateSystemState(applicationName: Text, dto : RequestDTOs.UpdateSystemStateDTO) : async Result.Result<(), T.Error> {
    assert checkAdmin(Principal.toText(caller));
    switch(applicationName){
      case "OpenFPL" {
        let backend_canister = actor (Environment.OPENFPL_BACKEND_CANISTER_ID) : actor {
          updateSystemState : (dto : RequestDTOs.UpdateSystemStateDTO) -> async Result.Result<(), T.Error>;
        };
        return await backend_canister.updateSystemState(dto);
      };
      case "OpenWSL" {
        
        let backend_canister = actor (Environment.OPENWSL_BACKEND_CANISTER_ID) : actor {
          updateSystemState : (dto : RequestDTOs.UpdateSystemStateDTO) -> async Result.Result<(), T.Error>;
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
        return await backend_canister.snapshotManagers();
      };
      case "OpenWSL" {
        
        let backend_canister = actor (Environment.OPENWSL_BACKEND_CANISTER_ID) : actor {
          snapshotManagers : () -> async Result.Result<(), T.Error>;
        };
        return await backend_canister.snapshotManagers();

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
        return await backend_canister.calculateGameweekScores();
      };
      case "OpenWSL" {
        
        let backend_canister = actor (Environment.OPENWSL_BACKEND_CANISTER_ID) : actor {
          calculateGameweekScores : () -> async Result.Result<(), T.Error>;
        };
        return await backend_canister.calculateGameweekScores();

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
        return await backend_canister.calculateLeaderboards();
      };
      case "OpenWSL" {
        
        let backend_canister = actor (Environment.OPENWSL_BACKEND_CANISTER_ID) : actor {
          calculateLeaderboards : () -> async Result.Result<(), T.Error>;
        };
        return await backend_canister.calculateLeaderboards();

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
        return await backend_canister.calculateWeeklyRewards(gameweek);
      };
      case "OpenWSL" {
        
        let backend_canister = actor (Environment.OPENWSL_BACKEND_CANISTER_ID) : actor {
          calculateWeeklyRewards : (gameweek: FootballTypes.GameweekNumber) -> async Result.Result<(), T.Error>;
        };
        return await backend_canister.calculateWeeklyRewards(gameweek);

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
        return await backend_canister.payWeeklyRewards(gameweek);
      };
      case "OpenWSL" {
        
        let backend_canister = actor (Environment.OPENWSL_BACKEND_CANISTER_ID) : actor {
          payWeeklyRewards : (gameweek: FootballTypes.GameweekNumber) -> async Result.Result<(), T.Error>;
        };
        return await backend_canister.payWeeklyRewards(gameweek);
      };
      case _ {
        return #err(#NotFound);
      }
    };
  };

  //TODO: Remove manual betting functions when handled by game update and timer events:

  public shared ({ caller }) func setFixtureToActive(fixtureId: FootballTypes.FixtureId) : async Result.Result<(), T.Error> {
    //add active fixture id
    return #err(#NotFound);
  };

  public func setFixtureToComplete(fixtureId: FootballTypes.FixtureId) : async Result.Result<(), T.Error> {
    //remove active fixture id
    //update related bets
      //payout winning bets
    
    return #err(#NotFound);
  };
   
};
