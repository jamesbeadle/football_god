
/* ----- Mops Packages ----- */
import Result "mo:base/Result";
import Text "mo:base/Text";
import Principal "mo:base/Principal";

/* ----- Queries ----- */
import AppQueries "../data_canister/queries/app_queries";
import BaseQueries "mo:waterway-mops/queries/BaseQueries";
import ClubQueries "../data_canister/queries/club_queries";
import SeasonQueries "../data_canister/queries/season_queries";
import PlayerQueries "../data_canister/queries/player_queries";
import LeagueQueries "../data_canister/queries/league_queries";
import FixtureQueries "../data_canister/queries/fixture_queries";

/* ----- Only Stable Variables Should Use Types ----- */
import BaseTypes "mo:waterway-mops/BaseTypes";
import CanisterIds "mo:waterway-mops/CanisterIds";
import Ids "mo:waterway-mops/Ids";
import Enums "mo:waterway-mops/Enums";
import Countries "mo:waterway-mops/def/Countries";

actor Self {


  /* ----- Stable Canister Variables ----- */ 

  private stable var stable_app_status: BaseTypes.AppStatus = { 
    onHold = true; 
    version = ""; 
  };  

  // TODO: John - Because Football God is a neuron based governance platform, we actually don't need profiles at all
    //Before removing this please get the cycles back if a canister ids

  private stable var stable_profile_canister_ids: [(Ids.PrincipalId, Ids.CanisterId)] = [];
  private stable var stable_unique_profile_canister_ids: [Ids.CanisterId] = [];
  private stable var stable_active_profile_canister_id: Text = "";


  /* ----- General App Queries ----- */
  
  public shared query func getAppStatus() : async Result.Result<BaseQueries.AppStatus, Enums.Error> {
    return #ok(stable_app_status);
  };
  

  /* ----- Data Canister Calls -----  */

  public shared ({ caller }) func getDataHashes(dto: AppQueries.GetDataHashes) : async Result.Result<AppQueries.DataHashes, Enums.Error> {
    assert not Principal.isAnonymous(caller);
    // TODO: Check caller has associated neuron

    let data_canister = actor (CanisterIds.ICFC_DATA_CANISTER_ID) : actor {
      getDataHashes : (dto: AppQueries.GetDataHashes) -> async Result.Result<AppQueries.DataHashes, Enums.Error>;
    };
    return await data_canister.getDataHashes(dto);
  };

  public shared ({ caller }) func getClubs(dto: ClubQueries.GetClubs) : async Result.Result<ClubQueries.Clubs, Enums.Error> {
    assert not Principal.isAnonymous(caller);
    // TODO: Check caller has associated neuron

    let data_canister = actor (CanisterIds.ICFC_DATA_CANISTER_ID) : actor {
      getClubs : (dto: ClubQueries.GetClubs) -> async Result.Result<ClubQueries.Clubs, Enums.Error>;
    };
    return await data_canister.getClubs(dto);
  };

  public shared ({ caller }) func getCountries(dto: BaseQueries.GetCountries) : async Result.Result<BaseQueries.Countries, Enums.Error> {
    assert not Principal.isAnonymous(caller);
    return #ok({
      countries = Countries.countries;
    });
  };

  public shared ({ caller }) func getSeasons(dto: SeasonQueries.GetSeasons) : async Result.Result<SeasonQueries.Seasons, Enums.Error> {
    assert not Principal.isAnonymous(caller);
    // TODO: Check caller has associated neuron

    let data_canister = actor (CanisterIds.ICFC_DATA_CANISTER_ID) : actor {
      getSeasons : (dto: SeasonQueries.GetSeasons) -> async Result.Result<SeasonQueries.Seasons, Enums.Error>;
    };
    return await data_canister.getSeasons(dto);
  };

  public shared ({ caller }) func getLoanedPlayers(dto: PlayerQueries.GetLoanedPlayers) : async Result.Result<PlayerQueries.LoanedPlayers, Enums.Error> {
    assert not Principal.isAnonymous(caller);
    // TODO: Check caller has associated neuron

    let data_canister = actor (CanisterIds.ICFC_DATA_CANISTER_ID) : actor {
      getLoanedPlayers : (dto: PlayerQueries.GetLoanedPlayers) -> async Result.Result<PlayerQueries.LoanedPlayers, Enums.Error>;
    };
    return await data_canister.getLoanedPlayers(dto);
  };

  public shared ({ caller }) func getPlayers(dto: PlayerQueries.GetPlayers) : async Result.Result<PlayerQueries.Players, Enums.Error> {
    assert not Principal.isAnonymous(caller);
    // TODO: Check caller has associated neuron

    let data_canister = actor (CanisterIds.ICFC_DATA_CANISTER_ID) : actor {
      getPlayers : (dto: PlayerQueries.GetPlayers) -> async Result.Result<PlayerQueries.Players, Enums.Error>;
    };
    return await data_canister.getPlayers(dto);
  };

  public shared ({ caller }) func getLeagues(dto: LeagueQueries.GetLeagues) : async Result.Result<LeagueQueries.Leagues, Enums.Error> {
    assert not Principal.isAnonymous(caller);
    // TODO: Check caller has associated neuron

    let data_canister = actor (CanisterIds.ICFC_DATA_CANISTER_ID) : actor {
      getLeagues : (dto: LeagueQueries.GetLeagues) -> async Result.Result<LeagueQueries.Leagues, Enums.Error>;
    };
    let result = await data_canister.getLeagues(dto);
    return result;
  };

  public shared ({ caller }) func getLeagueStatus(dto: LeagueQueries.GetLeagueStatus) : async Result.Result<LeagueQueries.LeagueStatus, Enums.Error> {
    assert not Principal.isAnonymous(caller);
    // TODO: Check caller has associated neuron

    let data_canister = actor (CanisterIds.ICFC_DATA_CANISTER_ID) : actor {
      getLeagueStatus : (dto: LeagueQueries.GetLeagueStatus) -> async Result.Result<LeagueQueries.LeagueStatus, Enums.Error>;
    };
    return await data_canister.getLeagueStatus(dto);
  };

  public shared ({ caller }) func getFixtures(dto: FixtureQueries.GetFixtures) : async Result.Result<FixtureQueries.Fixtures, Enums.Error> {
    assert not Principal.isAnonymous(caller);
    // TODO: Check caller has associated neuron

    let data_canister = actor (CanisterIds.ICFC_DATA_CANISTER_ID) : actor {
      getFixtures : (dto: FixtureQueries.GetFixtures) -> async Result.Result<FixtureQueries.Fixtures, Enums.Error>;
    };
    return await data_canister.getFixtures(dto);
  };

  public shared ({ caller }) func getPostponedFixtures(dto: FixtureQueries.GetPostponedFixtures) : async Result.Result<FixtureQueries.PostponedFixtures, Enums.Error> {
    assert not Principal.isAnonymous(caller);
    // TODO: Check caller has associated neuron

    let data_canister = actor (CanisterIds.ICFC_DATA_CANISTER_ID) : actor {
      getPostponedFixtures : (dto: FixtureQueries.GetPostponedFixtures) -> async Result.Result<FixtureQueries.PostponedFixtures, Enums.Error>;
    };
    return await data_canister.getPostponedFixtures(dto);
  };

  public shared ({ caller }) func getClubValueLeaderboard(dto: ClubQueries.GetClubValueLeaderboard) : async Result.Result<ClubQueries.ClubValueLeaderboard, Enums.Error> {
    assert not Principal.isAnonymous(caller);
    // TODO: Check caller has associated neuron

    let data_canister = actor (CanisterIds.ICFC_DATA_CANISTER_ID) : actor {
      getClubValueLeaderboard : (dto: ClubQueries.GetClubValueLeaderboard) -> async Result.Result<ClubQueries.ClubValueLeaderboard, Enums.Error>;
    };
    return await data_canister.getClubValueLeaderboard(dto);
  };

};
