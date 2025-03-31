
/* ----- Mops Packages ----- */

import Int "mo:base/Int";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Timer "mo:base/Timer";
import Principal "mo:base/Principal";


/* ----- Canister Definition Files ----- */

/* ----- Queries ----- */
import AppQueries "../data_canister/queries/app_queries";
import ClubQueries "../data_canister/queries/club_queries";
import SeasonQueries "../data_canister/queries/season_queries";
import PlayerQueries "../data_canister/queries/player_queries";
import LeagueQueries "../data_canister/queries/league_queries";

/* ----- Commands ----- */

/* ----- Managers ----- */


/* ----- Only Stable Variables Should Use Types ----- */
import Ids "mo:waterway-mops/Ids";
import BaseTypes "mo:waterway-mops/BaseTypes";
import BaseQueries "mo:waterway-mops/queries/BaseQueries";
import Enums "mo:waterway-mops/Enums";
import CanisterIds "mo:waterway-mops/CanisterIds";
import FixtureQueries "../data_canister/queries/fixture_queries";


/* ----- Application Environment & Utility Files ----- */ 

actor Self {


  /* ----- Stable Canister Variables ----- */ 

  private stable var stable_profile_canister_ids: [(Ids.PrincipalId, Ids.CanisterId)] = [];
  private stable var stable_unique_profile_canister_ids: [Ids.CanisterId] = [];
  private stable var stable_active_profile_canister_id: Text = "";
  private stable var stable_app_status: BaseTypes.AppStatus = { 
    onHold = true; 
    version = ""; 
  };  


  /* ----- Domain Object Managers ----- */
  
  
  /* ----- General App Queries ----- */
  
  public shared query func getAppStatus(dto: BaseQueries.GetAppStatus) : async Result.Result<BaseQueries.AppStatus, Enums.Error> {
    return #ok(stable_app_status);
  };

  /* ----- Data Canister Calls -----  */

  public shared ({ caller }) func getDataHashes(dto: AppQueries.GetDataHashes) : async Result.Result<AppQueries.DataHashes, Enums.Error> {
    assert not Principal.isAnonymous(caller);
    // TODO: Check caller is a member

    let data_canister = actor (CanisterIds.ICFC_DATA_CANISTER_ID) : actor {
      getDataHashes : (dto: AppQueries.GetDataHashes) -> async Result.Result<AppQueries.DataHashes, Enums.Error>;
    };
    return await data_canister.getDataHashes(dto);
  };

  public shared ({ caller }) func getClubs(dto: ClubQueries.GetClubs) : async Result.Result<ClubQueries.Clubs, Enums.Error> {
    assert not Principal.isAnonymous(caller);
    // TODO: Check caller is a member

    let data_canister = actor (CanisterIds.ICFC_DATA_CANISTER_ID) : actor {
      getClubs : (dto: ClubQueries.GetClubs) -> async Result.Result<ClubQueries.Clubs, Enums.Error>;
    };
    return await data_canister.getClubs(dto);
  };

  public shared ({ caller }) func getCountries(dto: AppQueries.GetCountries) : async Result.Result<AppQueries.Countries, Enums.Error> {
    assert not Principal.isAnonymous(caller);
    // TODO: Check caller is a member

    let data_canister = actor (CanisterIds.ICFC_DATA_CANISTER_ID) : actor {
      getCountries : (dto: AppQueries.GetCountries) -> async Result.Result<AppQueries.Countries, Enums.Error>;
    };
    return await data_canister.getCountries(dto);
  };

  public shared ({ caller }) func getSeasons(dto: SeasonQueries.GetSeasons) : async Result.Result<SeasonQueries.Seasons, Enums.Error> {
    assert not Principal.isAnonymous(caller);
    // TODO: Check caller is a member

    let data_canister = actor (CanisterIds.ICFC_DATA_CANISTER_ID) : actor {
      getSeasons : (dto: SeasonQueries.GetSeasons) -> async Result.Result<SeasonQueries.Seasons, Enums.Error>;
    };
    return await data_canister.getSeasons(dto);
  };

  public shared ({ caller }) func getLoanedPlayers(dto: PlayerQueries.GetLoanedPlayers) : async Result.Result<PlayerQueries.LoanedPlayers, Enums.Error> {
    assert not Principal.isAnonymous(caller);
    // TODO: Check caller is a member

    let data_canister = actor (CanisterIds.ICFC_DATA_CANISTER_ID) : actor {
      getLoanedPlayers : (dto: PlayerQueries.GetLoanedPlayers) -> async Result.Result<PlayerQueries.LoanedPlayers, Enums.Error>;
    };
    return await data_canister.getLoanedPlayers(dto);
  };

  public shared ({ caller }) func getPlayers(dto: PlayerQueries.GetPlayers) : async Result.Result<PlayerQueries.Players, Enums.Error> {
    assert not Principal.isAnonymous(caller);
    // TODO: Check caller is a member

    let data_canister = actor (CanisterIds.ICFC_DATA_CANISTER_ID) : actor {
      getPlayers : (dto: PlayerQueries.GetPlayers) -> async Result.Result<PlayerQueries.Players, Enums.Error>;
    };
    return await data_canister.getPlayers(dto);
  };

  public shared ({ caller }) func getLeagues(dto: LeagueQueries.GetLeagues) : async Result.Result<LeagueQueries.Leagues, Enums.Error> {
    assert not Principal.isAnonymous(caller);
    // TODO: Check caller is a member

    let data_canister = actor (CanisterIds.ICFC_DATA_CANISTER_ID) : actor {
      getLeagues : (dto: LeagueQueries.GetLeagues) -> async Result.Result<LeagueQueries.Leagues, Enums.Error>;
    };
    return await data_canister.getLeagues(dto);
  };

  public shared ({ caller }) func getLeagueStatus(dto: LeagueQueries.GetLeagueStatus) : async Result.Result<LeagueQueries.LeagueStatus, Enums.Error> {
    assert not Principal.isAnonymous(caller);
    // TODO: Check caller is a member

    let data_canister = actor (CanisterIds.ICFC_DATA_CANISTER_ID) : actor {
      getLeagueStatus : (dto: LeagueQueries.GetLeagueStatus) -> async Result.Result<LeagueQueries.LeagueStatus, Enums.Error>;
    };
    return await data_canister.getLeagueStatus(dto);
  };

  public shared ({ caller }) func getFixtures(dto: FixtureQueries.GetFixtures) : async Result.Result<FixtureQueries.Fixtures, Enums.Error> {
    assert not Principal.isAnonymous(caller);
    // TODO: Check caller is a member

    let data_canister = actor (CanisterIds.ICFC_DATA_CANISTER_ID) : actor {
      getFixtures : (dto: FixtureQueries.GetFixtures) -> async Result.Result<FixtureQueries.Fixtures, Enums.Error>;
    };
    return await data_canister.getFixtures(dto);
  };
  
  /* ----- Canister Lifecycle Management ----- */
  
  system func preupgrade() {
    getManagerStableVariables();

  };

  system func postupgrade() {
    setManagerStableVariables();

  
    ignore Timer.setTimer<system>(#nanoseconds(Int.abs(1)), postUpgradeCallback); 
  };

  private func getManagerStableVariables(){
  };

  private func setManagerStableVariables(){
  };

  private func postUpgradeCallback() : async (){
  };


  /* ----- Dynamic Canister Wasm Upgrade Functions ----- */ 

};
