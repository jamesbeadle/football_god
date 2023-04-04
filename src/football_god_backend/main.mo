import List "mo:base/List";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Nat64 "mo:base/Nat64";
import Int64 "mo:base/Int64";
import Float "mo:base/Float";
import Iter "mo:base/Iter";
import Int "mo:base/Int";
import Time      "mo:base/Time";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Debug "mo:base/Debug";
import Types "types";
import Seasons "seasons";
import Teams "teams";
import Predictions "predictions";
import Profiles "profiles";
import Account "Account";
import Ledger "canister:ledger";

actor Self {
  
  let admins : [Principal] = [
    Principal.fromText("zzlzc-qp3hr-or44h-2ur67-umtpf-66ybr-megk3-qpqq3-icp2x-5c3vd-zqe")
  ];

  let profilesInstance = Profiles.Profiles();
  let seasonInstance = Seasons.Seasons();
  let teamInstance = Teams.Teams();
  let predictionsInstance = Predictions.Predictions();
  
  var activeSeason : Nat16 = 0;
  var activeGameweek : Nat8 = 0;
  let entry_fee: Nat64 = 100_000_000;
  let icp_fee: Nat64 = 10_000;

  let adminAccount = "adminaccount";


  //admin functions
  private func isAdminForCaller(caller: Principal): Bool {
    //Debug.print(debug_show(caller));
    switch (Array.find<Principal>(admins, func (admin) { admin == caller })) {
      case null { false };
      case _ { true };
    };
  };
  
  public shared query ({caller}) func isAdmin(): async Bool {
    return isAdminForCaller(caller);
  };

  //profile functions
  
  public shared ({caller}) func checkForProfile() : async Bool {
    assert not Principal.isAnonymous(caller);
    return profilesInstance.checkForProfile(Principal.toText(caller));
  };

  public shared ({caller}) func getProfile() : async ?Types.Profile {
    assert not Principal.isAnonymous(caller);
    return profilesInstance.getProfile(Principal.toText(caller));
  };

  public shared ({caller}) func isDisplayNameValid(displayName: Text) : async Bool {
    assert not Principal.isAnonymous(caller);
    return profilesInstance.isDisplayNameValid(displayName);
  };

  public shared ({caller}) func saveProfile(displayName :Text, walletAddress: Text) : async Result.Result<(), Types.Error> {
    assert not Principal.isAnonymous(caller);
    return profilesInstance.updateProfile(Principal.toText(caller), displayName, walletAddress);
  };

  //system state functions

  public shared ({caller}) func setActiveSeason(seasonId : Nat16) : async Result.Result<(), Types.Error> {
    
    let isCallerAdmin = isAdminForCaller(caller);
    if(isCallerAdmin == false){
      return #err(#NotAuthorized);
    };

    activeSeason := seasonId;
    return #ok(());
  };

  public shared ({caller}) func setActiveGameweek(gameweekNumber : Nat8) : async Result.Result<(), Types.Error> {
    let isCallerAdmin = isAdminForCaller(caller);
    if(isCallerAdmin == false){
      return #err(#NotAuthorized);
    };

    activeGameweek := gameweekNumber;
    return #ok(());
  };

  public query func getActiveSeason() : async ?Types.Season {
    return seasonInstance.getSeason(activeSeason);
  };

  public query func getActiveGameweek() : async ?Types.Gameweek {
    return seasonInstance.getGameweek(activeSeason, activeGameweek);
  };

  //season functions

  public query func getSeasons() : async [Types.Season] {
    return seasonInstance.getSeasons();
  };

  public query func getSeason(seasonId : Nat16) : async ?Types.Season {
    return seasonInstance.getSeason(seasonId);
  };
  
  public shared ({caller}) func createSeason(name : Text, year : Nat16) : async Result.Result<(), Types.Error> {
    
    let isCallerAdmin = isAdminForCaller(caller);
    if(isCallerAdmin == false){
      return #err(#NotAuthorized);
    };

    return seasonInstance.createSeason(name, year);
  };

  public shared ({caller}) func updateSeason(id : Nat16, newName : Text, newYear : Nat16) : async Result.Result<(), Types.Error> {
    let isCallerAdmin = isAdminForCaller(caller);
    if(isCallerAdmin == false){
      return #err(#NotAuthorized);
    };

    return seasonInstance.updateSeason(id, newName, newYear);
  };

  public shared ({caller}) func deleteSeason(id : Nat16) : async Result.Result<(), Types.Error> {
    let isCallerAdmin = isAdminForCaller(caller);
    if(isCallerAdmin == false){
      return #err(#NotAuthorized);
    };

    return seasonInstance.deleteSeason(id);
  };

  //gameweek functions

  public query func getGameweeks(seasonId : Nat16) : async [Types.Gameweek] {
    return seasonInstance.getGameweeks(seasonId);
  };
  
  public shared ({caller}) func updateGameweekStatus(seasonId : Nat16, gameweekNumber : Nat8, status: Nat8) : async Result.Result<(), Types.Error> {
    
    let isCallerAdmin = isAdminForCaller(caller);
    if(isCallerAdmin == false){
      return #err(#NotAuthorized);
    };

    return seasonInstance.updateGameweekStatus(seasonId, gameweekNumber, status);
  };

  //fixture functions

  public query func getFixtures(seasonId: Nat16, gameweekNumber: Nat8) : async [Types.Fixture] {
    return seasonInstance.getFixtures(seasonId, gameweekNumber);
  };

  public query func getFixture(seasonId : Nat16, gameweekNumber: Nat8, fixtureId: Nat32) : async ?Types.Fixture {
    return seasonInstance.getFixture(seasonId, gameweekNumber, fixtureId);
  };

  public shared ({caller}) func addFixtureToGameweek(seasonId: Nat16, gameweekNumber: Nat8, homeTeamId: Nat16, awayTeamId: Nat16) : async Result.Result<(), Types.Error> {
    
    let isCallerAdmin = isAdminForCaller(caller);
    if(isCallerAdmin == false){
      return #err(#NotAuthorized);
    };

    return seasonInstance.addFixtureToGameweek(seasonId, gameweekNumber, homeTeamId, awayTeamId);
  };

  public shared ({caller}) func updateFixture(seasonId: Nat16, gameweekNumber: Nat8, fixtureId: Nat32, homeTeamId: Nat16, awayTeamId: Nat16, fixtureStatus: Nat8, homeGoals: Nat8, awayGoals: Nat8) : async Result.Result<(), Types.Error> {
    
    let isCallerAdmin = isAdminForCaller(caller);
    if(isCallerAdmin == false){
      return #err(#NotAuthorized);
    };

    return seasonInstance.updateFixture(seasonId, gameweekNumber, fixtureId, homeTeamId, awayTeamId, fixtureStatus, homeGoals, awayGoals);
  };

  public shared ({caller}) func deleteFixture(seasonId : Nat16, gameweekNumber: Nat8, fixtureId: Nat32) : async Result.Result<(), Types.Error> {
    let isCallerAdmin = isAdminForCaller(caller);
    if(isCallerAdmin == false){
      return #err(#NotAuthorized);
    };

    return seasonInstance.deleteFixture(seasonId, gameweekNumber, fixtureId);
  };

  //team functions

  public query func getTeams() : async [Types.Team] {
    return teamInstance.getTeams();
  };

  public shared ({caller}) func createTeam(name : Text) : async Result.Result<(), Types.Error> {
    
    let isCallerAdmin = isAdminForCaller(caller);
    if(isCallerAdmin == false){
      return #err(#NotAuthorized);
    };

    return teamInstance.createTeam(name);
  };

  public shared ({caller}) func updateTeam(id : Nat16, newName : Text) : async Result.Result<(), Types.Error> {
    let isCallerAdmin = isAdminForCaller(caller);
    if(isCallerAdmin == false){
      return #err(#NotAuthorized);
    };

    return teamInstance.updateTeam(id, newName);
  };

  public shared ({caller}) func deleteTeam(id : Nat16) : async Result.Result<(), Types.Error> {
    let isCallerAdmin = isAdminForCaller(caller);
    if(isCallerAdmin == false){
      return #err(#NotAuthorized);
    };

    return teamInstance.deleteTeam(id);
  };

  //prediction functions

  public shared ({caller}) func submitPredictions(seasonId: Nat16, gameweekNumber: Nat8, predictions: [Types.Prediction]) : async Result.Result<(), Types.Error> {
    assert not Principal.isAnonymous(caller);

    let hasProfile = profilesInstance.checkForProfile(Principal.toText(caller));

    if (not hasProfile){
      return #err(#NotAllowed);
    };

    let currentSeason = switch (await getActiveSeason()) {  
        case null { return #err(#NotAllowed) };
        case (?season) { season }
    };

    let currentGameweek = switch (await getActiveGameweek()) {  
        case null { return #err(#NotAllowed) };
        case (?gameweek) { gameweek }
    };

    if(seasonId != currentSeason.id){
      return #err(#NotAllowed);
    };

    if(gameweekNumber != currentGameweek.number){
      return #err(#NotAllowed);
    };

    if(currentGameweek.status != 1){
      return #err(#NotAllowed);
    };

    let principalName = Principal.toText(caller); 
    return predictionsInstance.submitPredictions(principalName, seasonId, gameweekNumber, predictions);
  };

  public shared ({caller}) func getPredictions(principalName: Text, seasonId: Nat16, gameweekNumber: Nat8) : async [Types.Prediction] {
    return predictionsInstance.getPredictions(principalName, seasonId, gameweekNumber); 
  };

  public shared ({caller}) func checkSweepstakePaid(seasonId: Nat16, gameweekNumber: Nat8) : async Bool {
    assert not Principal.isAnonymous(caller);
    let principalName = Principal.toText(caller); 
    return predictionsInstance.checkSweepstakePaid(principalName, seasonId, gameweekNumber); 
  };

  public shared ({caller}) func getUserHistory(seasonId: Nat16) : async [Types.UserGameweek] {
    assert not Principal.isAnonymous(caller);
    let principalName = Principal.toText(caller); 
   return predictionsInstance.getUserHistory(principalName, seasonId);
  };


  // Ledger functions

  func myAccountId() : Account.AccountIdentifier {
      Account.accountIdentifier(Principal.fromActor(Self), Account.defaultSubaccount());
  };
  
  public shared ({caller}) func getBalance() : async Ledger.Tokens {
    assert not Principal.isAnonymous(caller);
    let source_account = Account.accountIdentifier(Principal.fromActor(Self), Account.principalToSubaccount(caller));
    let balance = await Ledger.account_balance({ account = source_account });
    return balance;
  };

  public shared func getGameweekPot() : async Int64 {
    
    let source_account = Account.accountIdentifier(Principal.fromActor(Self), Account.defaultSubaccount());
    let balance = await Ledger.account_balance({ account = source_account });
    let balance_95 = Float.fromInt64(Int64.fromNat64(balance.e8s)) * 0.95;
    let balanceICP = balance_95 / 1e8;
    return Float.toInt64(balanceICP);
  };

  public shared ({caller}) func getPayoutData(seasonId : Nat16, gameweekNumber: Nat8) : async ?Types.PayoutData {
    let isCallerAdmin = isAdminForCaller(caller);
    if(isCallerAdmin == false){
      return null;
    };

    let source_account = Account.accountIdentifier(Principal.fromActor(Self), Account.defaultSubaccount());
    let balance = await Ledger.account_balance({ account = source_account });
    let balance_95 = Float.fromInt64(Int64.fromNat64(balance.e8s)) * 0.95;
    let balanceICP = balance_95 / 1e8;

    let payoutData: Types.PayoutData = {
      winners = predictionsInstance.countWinners(seasonId, gameweekNumber);
      totalPot = Float.toInt64(balanceICP);
    };
    
    return ?payoutData;
  };

  public shared ({caller}) func payoutSweepstake(seasonId : Nat16, gameweekNumber: Nat8) : async Result.Result<(), Types.Error> {
    let isCallerAdmin = isAdminForCaller(caller);
    if(isCallerAdmin == false){
      return #err(#NotAuthorized);
    };
    
    let source_account = Account.accountIdentifier(Principal.fromActor(Self), Account.defaultSubaccount());
    let balance = await Ledger.account_balance({ account = source_account });
    let balance_95 = Float.fromInt64(Int64.fromNat64(balance.e8s)) * 0.95;
    let balance_05 = Float.fromInt64(Int64.fromNat64(balance.e8s)) - balance_95;
    
    let winningPrincipals = predictionsInstance.getWinnerPrincipalIds(seasonId, gameweekNumber);
    let winningAmount = balance_95 / Float.fromInt64(Int64.fromNat64(Nat64.fromNat(winningPrincipals.size())));
    for (i in Iter.range(0, winningPrincipals.size() - 1)) {
      let res = await Ledger.transfer({
          memo = 0;
          from_subaccount = null;
          to = Account.accountIdentifier(Principal.fromActor(Self), Account.principalToSubaccount(Principal.fromText(winningPrincipals[i])));
          amount = { e8s = Int64.toNat64(Float.toInt64(winningAmount)) };
          fee = { e8s = icp_fee };
          created_at_time = ?{ timestamp_nanos = Nat64.fromNat(Int.abs(Time.now())) };
        });
    };
    
    return #ok(());
  };
  
  public shared ({caller}) func enterSweepstake(seasonId : Nat16, gameweekNumber: Nat8) : async Result.Result<(), Types.Error> {
    assert not Principal.isAnonymous(caller);
    let principalName = Principal.toText(caller); 
   
    let alreadyPaid = predictionsInstance.checkSweepstakePaid(principalName, seasonId, gameweekNumber);

    if(alreadyPaid){
      return #err(#NotAllowed);
    };

    let source_account = Account.accountIdentifier(Principal.fromActor(Self), Account.principalToSubaccount(caller));
    let balance = await Ledger.account_balance({ account = source_account });

    let hasBalance = balance.e8s > entry_fee;

    if(hasBalance){
      return #err(#NotAllowed);
    };

    let result = await Ledger.transfer({
        memo: Nat64    = 0;
        from_subaccount = ?Account.principalToSubaccount(caller);
        to = Account.accountIdentifier(Principal.fromActor(Self), Account.defaultSubaccount());
        amount = { e8s = entry_fee - icp_fee};
        fee = { e8s = icp_fee };
        created_at_time = ?{ timestamp_nanos = Nat64.fromNat(Int.abs(Time.now())) };
    });

    return predictionsInstance.enterSweepstake(principalName, seasonId, gameweekNumber);
  };

  public shared ({caller}) func withdrawICP(amount: Nat64) : async Result.Result<(), Types.Error> {
    assert not Principal.isAnonymous(caller);
    let principalName = Principal.toText(caller); 

    let source_account = Account.accountIdentifier(Principal.fromActor(Self), Account.principalToSubaccount(caller));
    let balance = await Ledger.account_balance({ account = source_account });
    let withdrawable = balance.e8s - icp_fee;

    if(amount > withdrawable){
      return #err(#NotAllowed);
    };

    let userProfile = profilesInstance.getProfile(principalName);

    switch userProfile {
      case (null) {
        return #err(#NotFound);
      };
      case (?profile) {
        let account_id = Account.accountIdentifier(Principal.fromText(profile.wallet), Account.defaultSubaccount());
        
        let result = await Ledger.transfer({
            memo: Nat64    = 0;
            from_subaccount = ?Account.principalToSubaccount(caller);
            to = account_id;
            amount = { e8s = amount };
            fee = { e8s = icp_fee };
            created_at_time = ?{ timestamp_nanos = Nat64.fromNat(Int.abs(Time.now())) };
        });

        return #ok(());


      };
    };
  };

  public shared ({caller}) func getUsersWithBalances() : async [Types.Profile] {
    let isCallerAdmin = isAdminForCaller(caller);
    if(isCallerAdmin == false){
      return [];
    };
    
    let allProfiles = profilesInstance.getProfiles();
    var profilesWithBalances: [Types.Profile] = [];

    for (i in Iter.range(0, allProfiles.size() - 1)) {
      let source_account = Account.accountIdentifier(Principal.fromActor(Self), Account.principalToSubaccount(Principal.fromText(allProfiles[i].principalName)));
      let balance = await Ledger.account_balance({ account = source_account });

      let updatedProfile = {
        principalName = allProfiles[i].principalName;
        displayName = allProfiles[i].displayName;
        wallet = allProfiles[i].wallet;
        depositAddress = allProfiles[i].depositAddress;
        balance = balance.e8s;
      };
    
      profilesWithBalances := Array.append<Types.Profile>(profilesWithBalances, [updatedProfile]);
    };


    return profilesWithBalances;
  };


  
}
