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

import T "types/app_types";
import Base "types/base_types";
import Countries "types/Countries";
import FootballTypes "types/football_types";
import Environment "environment";

import GovernanceDTOs "dtos/governance_DTOs";
import RequestDTOs "dtos/request_DTOs";
import ResponseDTOs "dtos/response_DTOs";

import FPLLedger "managers/fpl_ledger_manager";
import UserManager "managers/user_manager";
import OddsManager "managers/odds_manager";
import BettingTypes "types/betting_types";
import Utilities "utilities/utilities";

actor Self {

  private let ledger = FPLLedger.FPLLedger();
  private let userManager = UserManager.UserManager(); 
  private let oddsManager = OddsManager.OddsManager(); 
  
  private stable var openBets: [BettingTypes.BetSlip] = [];
  private stable var totalBetsStaked: Nat64 = 0;
  private stable var totalPotentialPayout: Nat64 = 0;
  
  /* User management functions */

  public shared ({ caller }) func getProfile() : async Result.Result<ResponseDTOs.ProfileDTO, T.Error> {
    return await userManager.getProfile(Principal.toText(caller));
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

  public shared query func getCountries() : async Result.Result<[ResponseDTOs.CountryDTO], T.Error> {
    return #ok(Countries.countries);
  };

  public shared composite query func getLeagues() : async Result.Result<[ResponseDTOs.FootballLeagueDTO], T.Error> {
    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      getLeagues : shared query () -> async Result.Result<[FootballTypes.League], T.Error>;
    };
    return await data_canister.getLeagues();
  };

  public shared composite query func getLeagueStatus(leagueId: FootballTypes.LeagueId) : async Result.Result<FootballTypes.LeagueStatus, T.Error> {
    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      getLeagueStatus : shared query (leagueId: FootballTypes.LeagueId) -> async Result.Result<FootballTypes.LeagueStatus, T.Error>;
    };
    return await data_canister.getLeagueStatus(leagueId);
  };

  public shared composite query func getLeagueClubs(leagueId: FootballTypes.LeagueId) : async Result.Result<[ResponseDTOs.ClubDTO], T.Error> {
    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      getClubs : shared query (leagueId: FootballTypes.LeagueId) -> async Result.Result<[ResponseDTOs.ClubDTO], T.Error>;
    };
    return await data_canister.getClubs(leagueId);
  };

  public shared composite query func getLeaguePlayers(leagueId: FootballTypes.LeagueId) : async Result.Result<[ResponseDTOs.PlayerDTO], T.Error> {  
    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      getPlayers : shared query (leagueId: FootballTypes.LeagueId) -> async Result.Result<[ResponseDTOs.PlayerDTO], T.Error>;
    };
    return await data_canister.getPlayers(leagueId);
  };

  public shared composite query func getSeasons(leagueId: FootballTypes.LeagueId) : async Result.Result<[ResponseDTOs.SeasonDTO], T.Error>  {
    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      getSeasons : shared query (leagueId: FootballTypes.LeagueId) -> async Result.Result<[ResponseDTOs.SeasonDTO], T.Error>;
    };
    return await data_canister.getSeasons(leagueId);
  };

  public shared composite query func getFixtures(leagueId: FootballTypes.LeagueId) : async Result.Result<[ResponseDTOs.FixtureDTO], T.Error>  {
    
    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      getFixtures : shared query (leagueId: FootballTypes.LeagueId) -> async Result.Result<[ResponseDTOs.FixtureDTO], T.Error>;
    };

    return await data_canister.getFixtures(leagueId);
  };

  public shared composite query func getTimers() : async Result.Result<[Base.TimerInfo], T.Error>  {
    
    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      getTimers : shared query () -> async Result.Result<[Base.TimerInfo], T.Error>;
    };

    return await data_canister.getTimers();
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
    
    /* //TODO ADD IN
    await settleBets(dto.fixtureId);
    await oddsManager.recalculate(dto.leagueId);
    */
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

  public shared func getLeagueFixtures(leagueId: FootballTypes.LeagueId) : async [ResponseDTOs.HomePageFixtureDTO] {
    return oddsManager.getLeagueFixtures(leagueId);
  };

  public shared query func getBettableLeagueFixtures(leagueId: FootballTypes.LeagueId) : async Result.Result<[ResponseDTOs.BettableFixtureDTO], T.Error> {
    return oddsManager.getBettableLeagueFixtures(leagueId);
  };

  public shared query func getMatchOdds(leagueId: FootballTypes.LeagueId, fixtureId: FootballTypes.FixtureId) : async Result.Result<ResponseDTOs.MatchOddsDTO, T.Error> {
    return oddsManager.getMatchOdds(leagueId, fixtureId);
  };

  public shared ({ caller }) func placeBet(dto: RequestDTOs.SubmitBetslipDTO) : async Result.Result<BettingTypes.BetSlip, T.Error>{
    assert not Principal.isAnonymous(caller);
    let principalId = Principal.toText(caller);
    assert dto.principalId == principalId;

    assert await betWithinPlatformLimits(dto.totalStake);

    let profileResult = await userManager.getProfile(principalId);
    switch(profileResult){
      case (#ok profile){
        assert not profile.completedKYC;
        assert not profile.accountOnPause;
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
              }
            } else { return selection; };
          });
          status = bet.status;
          result = bet.result;
          totalStake = bet.totalStake;
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

  //Odds Manager
  private stable var stable_bettable_leagueFixture_ids: [(FootballTypes.LeagueId, [FootballTypes.FixtureId])] = [];
  private stable var stable_match_odds_cache: [(FootballTypes.LeagueId, [(FootballTypes.FixtureId, BettingTypes.MatchOdds)])] = [];

  system func preupgrade() {
    stable_profile_canister_ids := userManager.getStableProfileCanisterIds();
    stable_unique_profile_canister_ids := userManager.getStableUniqueProfileCanisterIds();
    stable_active_profile_canister_id := userManager.getStableActiveProfileCanisterId();
    stable_usernames := userManager.getStableUsernames();
    stable_bettable_leagueFixture_ids := oddsManager.getStableBettableLeagueFixtureIds();
    stable_match_odds_cache := oddsManager.getStableMatchOddsCache();
  };

  system func postupgrade() {
    
    userManager.setStableProfileCanisterIds(stable_profile_canister_ids);
    userManager.setStableUniqueProfileCanisterIds(stable_unique_profile_canister_ids);
    userManager.setStableActiveProfileCanisterId(stable_active_profile_canister_id);
    userManager.setStableUsernames(stable_usernames);
    oddsManager.setStableBettableLeagueFixtureIds(stable_bettable_leagueFixture_ids);
    oddsManager.setStableMatchOddsCache(stable_match_odds_cache);

    ignore Timer.setTimer<system>(#nanoseconds(Int.abs(1)), postUpgradeCallback); 
  };

  private func postUpgradeCallback() : async (){
    await oddsManager.recalculate(1);
  };

  /* Admin functions */
  //TODO: Remove when handed back to the SNS

  public shared ({ caller }) func isAdmin() : async Result.Result<Bool, T.Error> {
    return #ok(checkAdmin(Principal.toText(caller)));
  };

  public shared ({ caller }) func isDataManager() : async Result.Result<Bool, T.Error> {
    Debug.print("checking is data manager");
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

  public shared ({ caller }) func addBettableFixture(leagueId: FootballTypes.LeagueId, fixtureId: FootballTypes.FixtureId) : async Result.Result<(), T.Error> {
    assert checkAdmin(Principal.toText(caller));
    return await oddsManager.addBettableLeagueFixture(leagueId, fixtureId);
  };

  public shared ({ caller }) func removeBettableFixture(leagueId: FootballTypes.LeagueId, fixtureId: FootballTypes.FixtureId) : async Result.Result<(), T.Error> {
    assert checkAdmin(Principal.toText(caller));
    return await oddsManager.removeBettableLeagueFixture(leagueId, fixtureId);
  };
   
};
