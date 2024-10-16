import List "mo:base/List";
import Array "mo:base/Array";
import Nat8 "mo:base/Nat8";
import Nat16 "mo:base/Nat16";
import Nat64 "mo:base/Nat64";
import Float "mo:base/Float";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Blob "mo:base/Blob";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Timer "mo:base/Timer";
import Int "mo:base/Int";

import T "old_games/old_types";
import Seasons "old_games/seasons";
import Teams "teams";
import Predictions "old_games/predictions";
import Profiles "profiles";
import Book "book";
import Account "Account";
import DTOs "old_games/old_DTOs";

import Euro2024 "old_games/euro2024";

actor Self {

  let admins : [Principal] = [
    Principal.fromText("d7egg-wf5tk-olxbg-izlyy-bphvp-2nfuf-5yltc-kzmvt-dk5lo-qtv7e-vae"),
    Principal.fromText("4jijx-ekel7-4t2kx-32cyf-wzo3t-i4tas-qsq4k-ujnug-oxke7-o5aci-eae"),
    Principal.fromText("2drvn-pdfn4-rzaf3-vbnny-qpulj-yeqaf-jyk65-xgmrw-o3zbj-35abt-2qe"),
    Principal.fromText("eqlhf-ppkq7-roa5i-4wu6r-jumy3-g2xrc-vfdd5-wtoeu-n7xre-vsktn-lqe")  ];

  let profilesInstance = Profiles.Profiles();
  let bookInstance = Book.Book();

  //Old Instances not used
  let teamsInstance = Teams.Teams();
  let predictionsInstance = Predictions.Predictions();
  let euro2024Instance = Euro2024.Euro2024();
  let seasonsInstance = Seasons.Seasons();

  //stable variables populated on pre upgrade
  private stable var activeSeason : Nat16 = 0;
  private stable var activeGameweek : Nat8 = 0;
  private stable var stable_profiles : [T.Profile] = [];
  private stable var stable_predictions : [(T.PrincipalName, List.List<T.UserGameweek>)] = [];
  private stable var stable_seasons : [T.Season] = [];
  private stable var stable_teams : [T.Team] = [];
  private stable var stable_nextSeasonId : Nat16 = 0;
  private stable var stable_nextFixtureId : Nat32 = 0;
  private stable var stable_nextTeamId : Nat16 = 0;
  private stable var stable_euro2024_predictions : [(T.PrincipalName, T.Euro2024Prediction)] = [];
  private stable var stable_euro2024_events : [T.Euro2024Event] = [];
  private stable var stable_euro2024_state: T.Euro2024State = {
    prizePool = 0; stage = #Selecting; totalManagers = 1
  };
  private stable var stable_next_euro2024_event_id: T.Euro2024EventId = 1;
  private stable var stable_euro2024_fixtures: [T.Euro2024Fixture] = [];
  private stable var stable_euro2024_leaderboard_entries: [T.LeaderboardEntry] = [];

  private stable var dataCacheHashes : List.List<T.DataCache> = List.fromArray([
    { category = "leagues"; hash = "NEW_DEFAULT_VALUE" }
  ]);

  public shared query func getDataHashes() : async Result.Result<[DTOs.DataCacheDTO], T.Error> {
    return #ok(List.toArray(dataCacheHashes));
  };

  //admin functions
  private func isAdminForCaller(caller : Principal) : Bool {
    switch (Array.find<Principal>(admins, func(admin) { admin == caller })) {
      case null { false };
      case _ { true };
    };
  };

  public shared query ({ caller }) func isAdmin() : async Bool {
    return isAdminForCaller(caller);
  };


  public shared ({ caller }) func getFPLAccountBalanceDTO() : async DTOs.AccountBalanceDTO {

    assert not Principal.isAnonymous(caller);
    let systemUpdating = (activeSeason == 0) or (activeGameweek == 0);
    var accountBalance = Nat64.fromNat(0);

    if (not systemUpdating) {
      accountBalance := await bookInstance.getUserAccountBalance(Principal.fromActor(Self), caller);
    };

    let accountBalanceDTO : DTOs.AccountBalanceDTO = {
      accountBalance = Nat64.toNat(accountBalance);
    };

    return accountBalanceDTO;
  };

  public shared ({ caller }) func getProfileDTO() : async Result.Result<DTOs.ProfileDTO, T.Error> {
    assert not Principal.isAnonymous(caller);
    let principalName = Principal.toText(caller);
    var depositAddress = Blob.fromArray([]);
    var fplDepositAddress = "";
    var displayName = "";
    var walletAddress = "";

    var profile = profilesInstance.getProfile(Principal.toText(caller));

    if (profile == null) {
      profilesInstance.createProfile(Principal.toText(caller), Principal.toText(caller), "", getUserDepositAccount(caller));
      profile := profilesInstance.getProfile(Principal.toText(caller));
    };

    switch (profile) {
      case (null) {};
      case (?p) {
        depositAddress := p.depositAddress;
        displayName := p.displayName;
        walletAddress := p.wallet;
        fplDepositAddress := Principal.toText(caller);
      };
    };

    return #ok({
      principalName = principalName;
      depositAddress = depositAddress;
      displayName = displayName;
      walletAddress = walletAddress;
      fplDepositAddress = fplDepositAddress;
    });

  };

  public shared query ({ caller }) func isDisplayNameValid(displayName : Text) : async Bool {
    assert not Principal.isAnonymous(caller);
    return profilesInstance.isDisplayNameValid(displayName);
  };

  public shared ({ caller }) func updateDisplayName(displayName : Text) : async Result.Result<(), T.Error> {
    assert not Principal.isAnonymous(caller);
    return profilesInstance.updateDisplayName(Principal.toText(caller), displayName);
  };

  public shared ({ caller }) func updateWalletAddress(walletAddress : Text) : async Result.Result<(), T.Error> {
    assert not Principal.isAnonymous(caller);
    return profilesInstance.updateWalletAddress(Principal.toText(caller), walletAddress);
  };

  public shared query ({ caller }) func isWalletValid(walletAddress : Text) : async Bool {
    assert not Principal.isAnonymous(caller);
    return profilesInstance.isWalletValid(walletAddress);
  };

  public shared ({ caller }) func withdrawICP(amount : Float) : async Result.Result<(), T.Error> {
    assert not Principal.isAnonymous(caller);

    let userProfile = profilesInstance.getProfile(Principal.toText(caller));

    switch userProfile {
      case (null) {
        return #err(#NotFound);
      };
      case (?profile) {
        if (not profilesInstance.isWalletValid(profile.wallet)) {
          return #err(#NotAllowed);
        };
        return await bookInstance.withdrawICP(Principal.fromActor(Self), caller, amount, profile.wallet);
      };
    };
  };

  public shared ({ caller }) func getUserBalancesDTO(page : Nat, count : Nat) : async DTOs.BalancesDTO {
    assert not Principal.isAnonymous(caller);
    let isCallerAdmin = isAdminForCaller(caller);
    if (isCallerAdmin == false) {
      return { potAccountBalance = 0; totalEntries = 0; userBalances = [] };
    };

    let defaultSubAccount = getDefaultAccount();
    var potAccountBalance = await bookInstance.getTotalBalance(defaultSubAccount);

    let profiles = profilesInstance.getProfilesByPage(page, count);
    let profilesWithBalances = await bookInstance.getProfileBalances(Principal.fromActor(Self), profiles);

    let balancesDTO : DTOs.BalancesDTO = {
      potAccountBalance = potAccountBalance;
      totalEntries = profilesWithBalances.totalEntries;
      userBalances = profilesWithBalances.userBalances;
    };
    return balancesDTO;
  };

  // Ledger functions

  private func getDefaultAccount() : Account.AccountIdentifier {
    Account.accountIdentifier(Principal.fromActor(Self), Account.defaultSubaccount());
  };

  private func getUserDepositAccount(caller : Principal) : Account.AccountIdentifier {
    Account.accountIdentifier(Principal.fromActor(Self), Account.principalToSubaccount(caller));
  };

  //Data Management functions

  

  public shared query ({ caller }) func validateTransferPlayer(transferPlayerDTO : DTOs.TransferPlayerDTO) : async T.RustResult {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.SNS_GOVERNANCE_CANISTER_ID;
    return #Err("Governance on hold due to network issues");
    //return seasonManager.validateTransferPlayer(transferPlayerDTO);
  };

  public shared composite query func getLeagues() : async Result.Result<[DTOs.FootballLeagueDTO], T.Error> {
    let data_canister = actor (NetworkEnvironmentVariables.DATA_CANISTER_ID) : actor {
      getLeagues : shared query () -> async Result.Result<[T.FootballLeague], T.Error>;
    };
    return await data_canister.getLeagues();
    //return await dataManager.getLeagues(); //Todo implement when figure out query function
  };

  public shared composite query func getClubs() : async Result.Result<[DTOs.ClubDTO], T.Error> {
    let data_canister = actor (NetworkEnvironmentVariables.DATA_CANISTER_ID) : actor {
      getClubs : shared query (leagueId: T.FootballLeagueId) -> async Result.Result<[T.Club], T.Error>;
    };
    return await data_canister.getClubs(Environment.LEAGUE_ID);
    //return await dataManager.getClubs(Environment.LEAGUE_ID); //Todo implement when figure out query function
  };

  public shared composite query func getLeagueClubs(leagueId: T.FootballLeagueId) : async Result.Result<[DTOs.ClubDTO], T.Error> {
    let data_canister = actor (NetworkEnvironmentVariables.DATA_CANISTER_ID) : actor {
      getClubs : shared query (leagueId: T.FootballLeagueId) -> async Result.Result<[T.Club], T.Error>;
    };
    return await data_canister.getClubs(leagueId);
    //return await dataManager.getClubs(Environment.LEAGUE_ID); //Todo implement when figure out query function
  };


  public shared composite query func getFixtures(dto: Requests.RequestFixturesDTO) : async Result.Result<[DTOs.FixtureDTO], T.Error> {
    let data_canister = actor (NetworkEnvironmentVariables.DATA_CANISTER_ID) : actor {
      getFixtures : shared query (leagueId: T.FootballLeagueId, dto: Requests.RequestFixturesDTO) -> async Result.Result<[DTOs.FixtureDTO], T.Error>;
    };
    return await data_canister.getFixtures(Environment.LEAGUE_ID, dto);
    //return await dataManager.getFixtures(Environment.LEAGUE_ID, dto); //Todo implement when figure out query function
  };

  public shared ({ caller }) func executeTransferPlayer(leagueId: T.FootballLeagueId, transferPlayerDTO : DTOs.TransferPlayerDTO) : async () {
    //assert Principal.toText(caller) == NetworkEnvironmentVariables.SNS_GOVERNANCE_CANISTER_ID;
    assert isDataAdmin(Principal.toText(caller));
    switch(await dataManager.validateTransferPlayer(leagueId, transferPlayerDTO)){
      case (#ok success){

        let systemStateResult = seasonManager.getSystemState();
        switch(systemStateResult){
          case (#ok systemState){
            let _ = await dataManager.executeTransferPlayer(leagueId, systemState.pickTeamSeasonId, systemState.pickTeamGameweek, transferPlayerDTO);
            switch(leagueId){
              case 1{
                await seasonManager.updateDataHash("players");

              };
              case 2{
                //TODO Update the cache inside openwsl - remove when moved to football god
                let openwsl_backend_canister = actor (NetworkEnvironmentVariables.DATA_CANISTER_ID) : actor {
                  updateDataHash : (category: Text) -> async Result.Result<(), T.Error>;
                };
                let _ = await openwsl_backend_canister.updateDataHash("players");
                return;
              };
              case _ {

              };
            };
          };
          case (#err _){}
        };      


        
      };
      case _ {}
    };
  };
  

    //Leagues
    //Clubs
    //Players
    //Fixtures


  
  system func preupgrade() {
    stable_profiles := profilesInstance.getProfiles();
    stable_predictions := predictionsInstance.getUserPredictions();
    stable_seasons := seasonsInstance.getAllData();
    stable_nextSeasonId := seasonsInstance.getNextSeasonId();
    stable_nextFixtureId := seasonsInstance.getNextFixtureId();
    stable_teams := teamsInstance.getTeams();
    stable_nextTeamId := teamsInstance.getNextTeamId();
    stable_euro2024_predictions := euro2024Instance.getUserPredictions();
    stable_euro2024_events := euro2024Instance.getEvents();
    stable_euro2024_state := euro2024Instance.getState();
    stable_next_euro2024_event_id := euro2024Instance.getStableNextEventId();
    stable_euro2024_fixtures := euro2024Instance.getEuro2024Fixtures();
    stable_euro2024_leaderboard_entries := euro2024Instance.getLeaderboardEntries();
  };

  system func postupgrade() {
    profilesInstance.setData(stable_profiles);
    predictionsInstance.setData(stable_predictions);
    seasonsInstance.setData(stable_seasons, stable_nextSeasonId, stable_nextFixtureId);
    teamsInstance.setData(stable_teams, stable_nextTeamId);
    euro2024Instance.setData(stable_euro2024_predictions);
    euro2024Instance.setEvents(stable_euro2024_events);
    euro2024Instance.setState(stable_euro2024_state);
    euro2024Instance.setStableNextEventId(stable_next_euro2024_event_id);
    euro2024Instance.setStableFixtures(stable_euro2024_fixtures);
    euro2024Instance.setLeaderboardEntries(stable_euro2024_leaderboard_entries);
    euro2024Instance.setGetUsernameFunction(?getUsernameFromPrincipal);
    ignore Timer.setTimer<system>(#nanoseconds(Int.abs(1)), postUpgradeCallback);
  };

  private func postUpgradeCallback() : async (){
    
    dataCacheHashes := List.fromArray([
      { category = "leagues"; hash = "NEW_DEFAULT_VALUE" }
    ]);
  };

  private func getUsernameFromPrincipal(principalId: Text) : Text {
    let profile = profilesInstance.getProfile(principalId);
    switch(profile){
      case null{ return principalId };
      case (?foundProfile){
        return foundProfile.displayName;
      }
    }
  };  
    
};
