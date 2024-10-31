import Array "mo:base/Array";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Option "mo:base/Option";
import Iter "mo:base/Iter";
import Timer "mo:base/Timer";
import Int "mo:base/Int";
import DTOs "dtos/DTOs";
import GovernanceDTOs "dtos/governance_DTOs";
import RequestDTOs "dtos/request_DTOs";
import ResponseDtOs "dtos/response_DTOs";
import Environment "environment";
import Base "types/base_types";
import FootballTypes "types/football_types";
import T "types/app_types";
import Countries "types/Countries";
import ResponseDTOs "dtos/response_DTOs";
import UserManager "managers/user_manager";

actor Self {
  
  private let userManager = UserManager.UserManager(); 
  
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

  /* ----- Governance Data Functions ----- */

  //Player Validation Functions

  public shared query ({ caller }) func validateRevaluePlayerUp(dto : GovernanceDTOs.RevaluePlayerUpDTO) : async Base.RustResult {
    //TODO: Implement when hand canisters over to SNS
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.SNS_GOVERNANCE_CANISTER_ID;
    //Todo (DFINITY) when functionality available: Make cross subnet call to governance canister to see if proposal exists
    //return seasonManager.validateRevaluePlayerUp(revaluePlayerUpDTO);
    return #Ok("Valid");
  };

  public shared query ({ caller }) func validateRevaluePlayerDown(dto : GovernanceDTOs.RevaluePlayerDownDTO) : async Base.RustResult {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.SNS_GOVERNANCE_CANISTER_ID;
    //return seasonManager.validateRevaluePlayerDown(revaluePlayerDownDTO);
    return #Ok("Valid");
  };

  public shared query ({ caller }) func validateTransferPlayer(dto : GovernanceDTOs.TransferPlayerDTO) : async Base.RustResult {
    //TODO: Implement when hand canisters over to SNS
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.SNS_GOVERNANCE_CANISTER_ID;
    //return #Err("Governance on hold due to network issues");
    //return seasonManager.validateTransferPlayer(transferPlayerDTO);
    return #Ok("Valid");
  };

  public shared query ({ caller }) func validateLoanPlayer(dto : GovernanceDTOs.LoanPlayerDTO) : async Base.RustResult {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.SNS_GOVERNANCE_CANISTER_ID;
    //return seasonManager.validateLoanPlayer(loanPlayerDTO);
    return #Ok("Valid");
  };

  public shared query ({ caller }) func validateRecallPlayer(dto : GovernanceDTOs.RecallPlayerDTO) : async Base.RustResult {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.SNS_GOVERNANCE_CANISTER_ID;
    //return seasonManager.validateRecallPlayer(recallPlayerDTO);
    return #Ok("Valid");
  };

  public shared query ({ caller }) func validateCreatePlayer(dto : GovernanceDTOs.CreatePlayerDTO) : async Base.RustResult {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.SNS_GOVERNANCE_CANISTER_ID;
    //return seasonManager.validateCreatePlayer(createPlayerDTO);
    return #Ok("Valid");
  };

  public shared query ({ caller }) func validateUpdatePlayer(dto : GovernanceDTOs.UpdatePlayerDTO) : async Base.RustResult {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.SNS_GOVERNANCE_CANISTER_ID;
    //return seasonManager.validateUpdatePlayer(updatePlayerDTO);
    return #Ok("Valid");
  };

  public shared query ({ caller }) func validateSetPlayerInjury(dto : GovernanceDTOs.SetPlayerInjuryDTO) : async Base.RustResult {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.SNS_GOVERNANCE_CANISTER_ID;
    //return seasonManager.validateSetPlayerInjury(setPlayerInjuryDTO);
    return #Ok("Valid");
  };

  public shared query ({ caller }) func validateRetirePlayer(dto : GovernanceDTOs.RetirePlayerDTO) : async Base.RustResult {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.SNS_GOVERNANCE_CANISTER_ID;
    //return seasonManager.validateRetirePlayer(retirePlayerDTO);
    return #Ok("Valid");
  };

  public shared query ({ caller }) func validateUnretirePlayer(dto : GovernanceDTOs.UnretirePlayerDTO) : async Base.RustResult {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.SNS_GOVERNANCE_CANISTER_ID;
    //return seasonManager.validateUnretirePlayer(unretirePlayerDTO);
    return #Ok("Valid");
  };

  //Fixture Validation Functions

  public shared query ({ caller }) func validateAddInitialFixtures(dto : GovernanceDTOs.AddInitialFixturesDTO) : async Base.RustResult {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.SNS_GOVERNANCE_CANISTER_ID; 
    //return seasonManager.validateAddInitialFixtures(addInitialFixturesDTO);
    return #Ok("Valid");
  };

  public shared query ({ caller }) func validateSubmitFixtureData(dto : GovernanceDTOs.SubmitFixtureDataDTO) : async Base.RustResult {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.SNS_GOVERNANCE_CANISTER_ID;
    //return seasonManager.validateSubmitFixtureData(submitFixtureData);
    return #Ok("Valid");
  };

  public shared query ({ caller }) func validateMoveFixture(dto : GovernanceDTOs.MoveFixtureDTO) : async Base.RustResult {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.SNS_GOVERNANCE_CANISTER_ID;
    //return seasonManager.validateMoveFixture(moveFixtureDTO);
    return #Ok("Valid");
  };

  public shared query ({ caller }) func validatePostponeFixture(dto : GovernanceDTOs.PostponeFixtureDTO) : async Base.RustResult {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.SNS_GOVERNANCE_CANISTER_ID;
    //return seasonManager.validatePostponeFixture(postponeFixtureDTO);
    return #Ok("Valid");
  };

  public shared query ({ caller }) func validateRescheduleFixture(dto : GovernanceDTOs.RescheduleFixtureDTO) : async Base.RustResult {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.SNS_GOVERNANCE_CANISTER_ID;
    //return await seasonManager.validateRescheduleFixture(rescheduleFixtureDTO);
    return #Ok("Valid");
  };

  //Club Validation Functions

  public shared query ({ caller }) func validatePromoteClub(dto : GovernanceDTOs.PromoteClubDTO) : async Base.RustResult {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.SNS_GOVERNANCE_CANISTER_ID;
    //return seasonManager.validatePromoteNewClub(promoteNewClubDTO);
    return #Ok("Valid");
  };

  public shared query ({ caller }) func validateUpdateClub(dto : GovernanceDTOs.UpdateClubDTO) : async Base.RustResult {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.SNS_GOVERNANCE_CANISTER_ID;
    //return seasonManager.validateUpdateClub(updateClubDTO);
    return #Ok("Valid");
  };

  //League Validation Functions

  public shared query ({ caller }) func validateCreateLeague(dto : GovernanceDTOs.CreateLeagueDTO) : async Base.RustResult {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.SNS_GOVERNANCE_CANISTER_ID;
    //return seasonManager.validateCreatePlayer(createPlayerDTO);
    return #Ok("Valid");
  };

  public shared query ({ caller }) func validateUpdateLeague(dto : GovernanceDTOs.UpdateLeagueDTO) : async Base.RustResult {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.SNS_GOVERNANCE_CANISTER_ID;
    //return seasonManager.validateUpdatePlayer(updatePlayerDTO);
    return #Ok("Valid");
  };


  //Player Execution Functions

  public shared ({ caller }) func executeRevaluePlayerUp(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.RevaluePlayerUpDTO) : async () {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.SNS_GOVERNANCE_CANISTER_ID;
    assert checkDataManager(Principal.toText(caller));

    //TODO: Implement validation check

    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      revaluePlayerUp : (leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.RevaluePlayerUpDTO) -> async Result.Result<(), T.Error>;
    };
    let _ = await data_canister.revaluePlayerUp(leagueId, dto);
    return;
  };

  public shared ({ caller }) func executeRevaluePlayerDown(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.RevaluePlayerDownDTO) : async () {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.SNS_GOVERNANCE_CANISTER_ID;
    assert checkDataManager(Principal.toText(caller));

    //TODO: Implement validation check

    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      revaluePlayerDown : (leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.RevaluePlayerDownDTO) -> async Result.Result<(), T.Error>;
    };
    let _ = await data_canister.revaluePlayerDown(leagueId, dto);
    return;
  };

  public shared ({ caller }) func executeTransferPlayer(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.TransferPlayerDTO) : async () {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.SNS_GOVERNANCE_CANISTER_ID;
    assert checkDataManager(Principal.toText(caller));

    //TODO: Implement validation check
    
    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      transferPlayer : (leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.TransferPlayerDTO) -> async Result.Result<(), T.Error>;
    };
    let _ = await data_canister.transferPlayer(leagueId, dto);
    return;
  };

  public shared ({ caller }) func executeLoanPlayer(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.LoanPlayerDTO) : async () {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.SNS_GOVERNANCE_CANISTER_ID;
    assert checkDataManager(Principal.toText(caller));

    //TODO: Implement validation check

    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      loanPlayer : (leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.LoanPlayerDTO) -> async Result.Result<(), T.Error>;
    };
    let _ =  await data_canister.loanPlayer(leagueId, dto);
    return;
  };

  public shared ({ caller }) func executeRecallPlayer(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.RecallPlayerDTO) : async () {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.SNS_GOVERNANCE_CANISTER_ID;
    assert checkDataManager(Principal.toText(caller));

    //TODO: Implement validation check

    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      recallPlayer : (leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.RecallPlayerDTO) -> async Result.Result<(), T.Error>;
    };
    let _ = await data_canister.recallPlayer(leagueId, dto);
    return;
  };

  public shared ({ caller }) func executeCreatePlayer(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.CreatePlayerDTO) : async () {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.SNS_GOVERNANCE_CANISTER_ID;
    assert checkDataManager(Principal.toText(caller));

    //TODO: Implement validation check

    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      createPlayer : (leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.CreatePlayerDTO) -> async Result.Result<(), T.Error>;
    };
    let _ = await data_canister.createPlayer(leagueId, dto);
    return;
  };

  public shared ({ caller }) func executeUpdatePlayer(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.UpdatePlayerDTO) : async () {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.SNS_GOVERNANCE_CANISTER_ID;
    assert checkDataManager(Principal.toText(caller));

    //TODO: Implement validation check

    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      updatePlayer : (leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.UpdatePlayerDTO) -> async Result.Result<(), T.Error>;
    };
    let _ = await data_canister.updatePlayer(leagueId, dto);
    return;
  };

  public shared ({ caller }) func executeSetPlayerInjury(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.SetPlayerInjuryDTO) : async () {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.SNS_GOVERNANCE_CANISTER_ID;
    assert checkDataManager(Principal.toText(caller));

    //TODO: Implement validation check

    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
        setPlayerInjury : (leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.SetPlayerInjuryDTO) -> async Result.Result<(), T.Error>;
      };
    let _ = await data_canister.setPlayerInjury(leagueId, dto);
    return;
  };

  public shared ({ caller }) func executeRetirePlayer(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.RetirePlayerDTO) : async () {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.SNS_GOVERNANCE_CANISTER_ID;
    assert checkDataManager(Principal.toText(caller));

    //TODO: Implement validation check

    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      retirePlayer : (leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.RetirePlayerDTO) -> async Result.Result<(), T.Error>;
    };
    let _ = await data_canister.retirePlayer(leagueId, dto);    
    return;
  };

  public shared ({ caller }) func executeUnretirePlayer(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.UnretirePlayerDTO) : async () {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.SNS_GOVERNANCE_CANISTER_ID;
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
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.SNS_GOVERNANCE_CANISTER_ID;
    assert checkDataManager(Principal.toText(caller));

    //TODO Implement
    return;
  };

  public shared ({ caller }) func executeMoveFixture(dto: GovernanceDTOs.MoveFixtureDTO) : async () {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.SNS_GOVERNANCE_CANISTER_ID;
    assert checkDataManager(Principal.toText(caller));
    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      moveFixture : (dto : GovernanceDTOs.MoveFixtureDTO) -> async Result.Result<(), T.Error>;
    };
    let _ = await data_canister.moveFixture(dto);
    return;
  };

  public shared ({ caller }) func executePostponeFixture(dto : GovernanceDTOs.PostponeFixtureDTO) : async () {
   //assert Principal.toText(caller) == NetworkEnvironmentVariables.SNS_GOVERNANCE_CANISTER_ID;
    assert checkDataManager(Principal.toText(caller));
    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      postponeFixture : (dto : GovernanceDTOs.PostponeFixtureDTO) -> async Result.Result<(), T.Error>;
    };
    let _ = await data_canister.postponeFixture(dto);
    return;
  };

  public shared ({ caller }) func executeRescheduleFixture(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.RescheduleFixtureDTO) : async () {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.SNS_GOVERNANCE_CANISTER_ID;
    assert checkDataManager(Principal.toText(caller));

    //TODO Implement
    return;
  };

  //Club Execution Functions

  public shared ({ caller }) func executePromoteClub(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.PromoteClubDTO) : async () {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.SNS_GOVERNANCE_CANISTER_ID;
    assert checkDataManager(Principal.toText(caller));

    //TODO Implement
    return;
  };

  public shared ({ caller }) func executeUpdateClub(leagueId: FootballTypes.LeagueId, dto : GovernanceDTOs.UpdateClubDTO) : async () {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.SNS_GOVERNANCE_CANISTER_ID;
    assert checkDataManager(Principal.toText(caller));

    //TODO Implement
    return;
  }; 

  //League Execution Functions

  public shared ({ caller }) func executeCreateLeague(dto : GovernanceDTOs.CreateLeagueDTO) : async () {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.SNS_GOVERNANCE_CANISTER_ID;
    assert checkDataManager(Principal.toText(caller));
    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      createLeague : (dto : GovernanceDTOs.CreateLeagueDTO) -> async Result.Result<(), T.Error>;
    };
    let _ = await data_canister.createLeague( dto);
    return;
  };

  public shared ({ caller }) func executeUpdateLeague(dto : GovernanceDTOs.UpdateLeagueDTO) : async () {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.SNS_GOVERNANCE_CANISTER_ID;
    assert checkDataManager(Principal.toText(caller));
    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      updateLeague : (dto : GovernanceDTOs.UpdateLeagueDTO) -> async Result.Result<(), T.Error>;
    };
    let _ = await data_canister.updateLeague(dto);
    return;
  };

  public shared ({ caller }) func executeSubmitFixtureData(dto : GovernanceDTOs.SubmitFixtureDataDTO) : async () {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.SNS_GOVERNANCE_CANISTER_ID;
    //assert isDataAdmin(Principal.toText(caller));

    //TODO: Implement validation check

    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      submitFixtureData : (dto : GovernanceDTOs.SubmitFixtureDataDTO) -> async Result.Result<(), T.Error>;
    };
    let _ = await data_canister.submitFixtureData(dto);
    return;
  };


  /* ----- Admin Functions ----- */
  //Admin functions for applications
  //TODO: Remove when handed back to the SNS

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

  public shared ({ caller }) func executeCreateClub(dto : GovernanceDTOs.CreateClubDTO) : async () {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.SNS_GOVERNANCE_CANISTER_ID;
    assert checkAdmin(Principal.toText(caller));
    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      createClub : (dto : GovernanceDTOs.CreateClubDTO) -> async Result.Result<(), T.Error>;
    };
    let _ = await data_canister.createClub(dto);
    return;
  };

  public shared composite query  ({ caller }) func getSystemState(applicationName: Text) : async Result.Result<ResponseDTOs.SystemStateDTO, T.Error>  {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.SNS_GOVERNANCE_CANISTER_ID;
    assert checkAdmin(Principal.toText(caller));
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

  public shared composite query  ({ caller }) func getSeasons(leagueId: FootballTypes.LeagueId) : async Result.Result<[DTOs.SeasonDTO], T.Error>  {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.SNS_GOVERNANCE_CANISTER_ID;
    assert checkAdmin(Principal.toText(caller));
    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      getSeasons : shared query (leagueId: FootballTypes.LeagueId) -> async Result.Result<[DTOs.SeasonDTO], T.Error>;
    };
    return await data_canister.getSeasons(leagueId);
  };

  public shared composite query  ({ caller }) func getFixtures(dto: RequestDTOs.GetFixturesDTO) : async Result.Result<[DTOs.FixtureDTO], T.Error>  {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.SNS_GOVERNANCE_CANISTER_ID;
    assert checkAdmin(Principal.toText(caller));
    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      getFixtures : shared query (dto: RequestDTOs.GetFixturesDTO) -> async Result.Result<[DTOs.FixtureDTO], T.Error>;
    };
    return await data_canister.getFixtures(dto);
  };

  /* ----- Betting Functions ----- */
    
  //get bet

  //get filtered betting history

  //get event with odds

  //place bet

  //place multiple bets

  //settle bets

  system func postupgrade() {
    ignore Timer.setTimer<system>(#nanoseconds(Int.abs(1)), postUpgradeCallback); 
  };

  private func postUpgradeCallback() : async (){

  };
    
};
