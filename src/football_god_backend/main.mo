import List "mo:base/List";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Nat64 "mo:base/Nat64";
import Int64 "mo:base/Int64";
import Float "mo:base/Float";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Debug "mo:base/Debug";

import Types "types";
import Seasons "seasons";
import Teams "teams";
import Predictions "predictions";
import Profiles "profiles";
import Book "book";
import Account "Account";

actor Self {
  
  let admins : [Principal] = [
    Principal.fromText("ztthu-cbxcc-xdbul-ju7cm-qxadr-u6y4i-57lof-nsmpm-wkdwf-nyxdl-oae")
  ];

  let profilesInstance = Profiles.Profiles();
  let seasonsInstance = Seasons.Seasons();
  let teamsInstance = Teams.Teams();
  let predictionsInstance = Predictions.Predictions();
  let bookInstance = Book.Book();
  
  let adminAccount = "adminaccount";

  //stable variables populated on pre upgrade
  private stable var activeSeason : Nat16 = 0;
  private stable var activeGameweek : Nat8 = 0;
  private stable var stable_profiles: [Types.Profile] = [];
  private stable var stable_predictions: [(Types.PrincipalName, List.List<Types.UserGameweek>)] = [];
  private stable var stable_seasons: [Types.Season] = [];
  private stable var stable_teams: [Types.Team] = [];
  private stable var stable_nextSeasonId : Nat16 = 0;
  private stable var stable_nextFixtureId : Nat32 = 0;
  private stable var stable_nextTeamId : Nat16 = 0;

  
  //admin functions
  private func isAdminForCaller(caller: Principal): Bool {
    switch (Array.find<Principal>(admins, func (admin) { admin == caller })) {
      case null { false };
      case _ { true };
    };
  };
  
  public shared query ({caller}) func isAdmin(): async Bool {
    return isAdminForCaller(caller);
  };

  //profile functions
  
  public shared ({caller}) func getProfile() : async ?Types.Profile {
    assert not Principal.isAnonymous(caller);
    let profile = profilesInstance.getProfile(Principal.toText(caller));
    
    if(profile == null){
      let result = profilesInstance.createProfile(Principal.toText(caller), Principal.toText(caller), "", getUserDepositAccount(caller));
      
      if(result == #ok(())){
        return profilesInstance.getProfile(Principal.toText(caller));
      };
    };

    return profile;
  };

  public shared ({caller}) func isDisplayNameValid(displayName: Text) : async Bool {
    assert not Principal.isAnonymous(caller);
    return profilesInstance.isDisplayNameValid(displayName);
  };

  public shared ({caller}) func updateDisplayName(displayName :Text) : async Result.Result<(), Types.Error> {
    assert not Principal.isAnonymous(caller);
    return profilesInstance.updateDisplayName(Principal.toText(caller), displayName);
  };

  public shared ({caller}) func updateWalletAddress(walletAddress :Text) : async Result.Result<(), Types.Error> {
    assert not Principal.isAnonymous(caller);
    return profilesInstance.updateWalletAddress(Principal.toText(caller), walletAddress);
  };

  //system state functions

  public shared ({caller}) func unsetActiveState() : async Result.Result<(), Types.Error> {
    
    let isCallerAdmin = isAdminForCaller(caller);
    if(isCallerAdmin == false){
      return #err(#NotAuthorized);
    };

    activeSeason := 0;
    activeGameweek := 0;
    return #ok(());
  };

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
    return seasonsInstance.getSeason(activeSeason);
  };

  public query func getActiveGameweek() : async ?Types.Gameweek {
    return seasonsInstance.getGameweek(activeSeason, activeGameweek);
  };

  //season functions

  public query func getSeasons() : async [Types.Season] {
    return seasonsInstance.getSeasons();
  };

  public query func getSeason(seasonId : Nat16) : async ?Types.Season {
    return seasonsInstance.getSeason(seasonId);
  };
  
  public shared ({caller}) func createSeason(name : Text, year : Nat16) : async Result.Result<(), Types.Error> {
    
    let isCallerAdmin = isAdminForCaller(caller);
    if(isCallerAdmin == false){
      return #err(#NotAuthorized);
    };

    return seasonsInstance.createSeason(name, year);
  };

  public shared ({caller}) func updateSeason(id : Nat16, newName : Text, newYear : Nat16) : async Result.Result<(), Types.Error> {
    let isCallerAdmin = isAdminForCaller(caller);
    if(isCallerAdmin == false){
      return #err(#NotAuthorized);
    };

    return seasonsInstance.updateSeason(id, newName, newYear);
  };

  public shared ({caller}) func deleteSeason(id : Nat16) : async Result.Result<(), Types.Error> {
    let isCallerAdmin = isAdminForCaller(caller);
    if(isCallerAdmin == false){
      return #err(#NotAuthorized);
    };

    return seasonsInstance.deleteSeason(id);
  };

  //gameweek functions

  public query func getGameweeks(seasonId : Nat16) : async [Types.Gameweek] {
    return seasonsInstance.getGameweeks(seasonId);
  };
  
  public shared ({caller}) func updateGameweekStatus(seasonId : Nat16, gameweekNumber : Nat8, status: Nat8) : async Result.Result<(), Types.Error> {
    
    let isCallerAdmin = isAdminForCaller(caller);
    if(isCallerAdmin == false){
      return #err(#NotAuthorized);
    };

    return seasonsInstance.updateGameweekStatus(seasonId, gameweekNumber, status);
  };

  //fixture functions

  public query func getFixtures(seasonId: Nat16, gameweekNumber: Nat8) : async [Types.Fixture] {
    return seasonsInstance.getFixtures(seasonId, gameweekNumber);
  };

  public query func getFixture(seasonId : Nat16, gameweekNumber: Nat8, fixtureId: Nat32) : async ?Types.Fixture {
    return seasonsInstance.getFixture(seasonId, gameweekNumber, fixtureId);
  };

  public shared ({caller}) func addFixtureToGameweek(seasonId: Nat16, gameweekNumber: Nat8, homeTeamId: Nat16, awayTeamId: Nat16) : async Result.Result<(), Types.Error> {
    
    let isCallerAdmin = isAdminForCaller(caller);
    if(isCallerAdmin == false){
      return #err(#NotAuthorized);
    };

    return seasonsInstance.addFixtureToGameweek(seasonId, gameweekNumber, homeTeamId, awayTeamId);
  };

  public shared ({caller}) func updateFixture(seasonId: Nat16, gameweekNumber: Nat8, fixtureId: Nat32, homeTeamId: Nat16, awayTeamId: Nat16, fixtureStatus: Nat8, homeGoals: Nat8, awayGoals: Nat8) : async Result.Result<(), Types.Error> {
    
    let isCallerAdmin = isAdminForCaller(caller);
    if(isCallerAdmin == false){
      return #err(#NotAuthorized);
    };

    let result = seasonsInstance.updateFixture(seasonId, gameweekNumber, fixtureId, homeTeamId, awayTeamId, fixtureStatus, homeGoals, awayGoals);

    let gameweekFixtures = seasonsInstance.getFixtures(seasonId, gameweekNumber);

    return predictionsInstance.updatePredictionsCount(seasonId, gameweekNumber, gameweekFixtures);
  };

  public shared ({caller}) func deleteFixture(seasonId : Nat16, gameweekNumber: Nat8, fixtureId: Nat32) : async Result.Result<(), Types.Error> {
    let isCallerAdmin = isAdminForCaller(caller);
    if(isCallerAdmin == false){
      return #err(#NotAuthorized);
    };

    let result = seasonsInstance.deleteFixture(seasonId, gameweekNumber, fixtureId);

    let gameweekFixtures = seasonsInstance.getFixtures(seasonId, gameweekNumber);
    return predictionsInstance.deleteFixture(seasonId, gameweekNumber, gameweekFixtures, fixtureId);


  };

  //team functions

  public query func getTeams() : async [Types.Team] {
    return teamsInstance.getTeams();
  };

  public shared ({caller}) func createTeam(name : Text) : async Result.Result<(), Types.Error> {
    
    let isCallerAdmin = isAdminForCaller(caller);
    if(isCallerAdmin == false){
      return #err(#NotAuthorized);
    };

    return teamsInstance.createTeam(name);
  };

  public shared ({caller}) func updateTeam(id : Nat16, newName : Text) : async Result.Result<(), Types.Error> {
    let isCallerAdmin = isAdminForCaller(caller);
    if(isCallerAdmin == false){
      return #err(#NotAuthorized);
    };

    return teamsInstance.updateTeam(id, newName);
  };

  public shared ({caller}) func deleteTeam(id : Nat16) : async Result.Result<(), Types.Error> {
    let isCallerAdmin = isAdminForCaller(caller);
    if(isCallerAdmin == false){
      return #err(#NotAuthorized);
    };

    return teamsInstance.deleteTeam(id);
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

    let validPredictions = checkValidPredictions(seasonId, gameweekNumber, predictions);

    if(not validPredictions){
      return #err(#NotAllowed);
    };

    let principalName = Principal.toText(caller); 
    return predictionsInstance.submitPredictions(principalName, seasonId, gameweekNumber, predictions);
  };

  private func checkValidPredictions(seasonId: Nat16, gameweekNumber: Nat8, predictions: [Types.Prediction]) : Bool {
      
      let fixtures = seasonsInstance.getFixtures(seasonId, gameweekNumber);
      let fixturesCount = Array.size<Types.Fixture>(fixtures);
      let predictionsCount = Array.size<Types.Prediction>(predictions);

      if (fixturesCount != predictionsCount) {
          return false;
      };

      let fixturesWithPredictions = Array.filter<Types.Fixture>(fixtures, func (fixture: Types.Fixture) : Bool {
          return Array.find<Types.Prediction>(predictions, func (prediction: Types.Prediction) : Bool {
              return prediction.fixtureId == fixture.id;
          }) != null;
      });

      return Array.size<Types.Fixture>(fixturesWithPredictions) == fixturesCount;
  };

  public shared ({caller}) func getPredictions(seasonId: Nat16, gameweekNumber: Nat8) : async [Types.Prediction] {
    assert not Principal.isAnonymous(caller);
    let principalName = Principal.toText(caller); 
    return predictionsInstance.getPredictions(principalName, seasonId, gameweekNumber); 
  };

  public shared ({caller}) func getUserPredictions(principalName: Text, seasonId: Nat16, gameweekNumber: Nat8) : async [Types.Prediction] {

    let gameweek = seasonsInstance.getGameweek(activeSeason, activeGameweek);
    
    switch gameweek {
      case (null) {
        return [];
      };
      
      case (?gw) {
        if(gw.status == 0 or gw.status == 1){
          return [];
        };
      };
    };

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

  private func getDefaultAccount() : Account.AccountIdentifier {
    Account.accountIdentifier(Principal.fromActor(Self), Account.defaultSubaccount())
  };

  private func getUserDepositAccount(caller: Principal) : Account.AccountIdentifier {
    Account.accountIdentifier(Principal.fromActor(Self), Account.principalToSubaccount(caller))
  };

  public shared func getGameweekPot() : async Int64 {
    let defaultSubAccount = getDefaultAccount();
    let potBalance = await bookInstance.getGameweekPotBalance(defaultSubAccount);
    
    let balanceICP = potBalance / 1e8;
    return Float.toInt64(Float.nearest(balanceICP));
  };

  public shared ({caller}) func getUserAccountBalance() : async Nat64 {
    assert not Principal.isAnonymous(caller);
    
    return await bookInstance.getUserAccountBalance(Principal.fromActor(Self), caller);
  };

  public shared ({caller}) func getPayoutData(seasonId : Nat16, gameweekNumber: Nat8) : async ?Types.PayoutData {
    let isCallerAdmin = isAdminForCaller(caller);
    if(isCallerAdmin == false){
      return null;
    };

    let defaultSubAccount = getDefaultAccount();
    let potBalance = await bookInstance.getGameweekPotBalance(defaultSubAccount);
    let balanceICP = potBalance / 1e8;

    let winnerCount = predictionsInstance.countWinners(seasonId, gameweekNumber);

    let payoutData: Types.PayoutData = {
      winners = winnerCount;
      totalPot = balanceICP;
    };

    return ?payoutData;
  };

  public shared ({caller}) func payoutSweepstake(seasonId : Nat16, gameweekNumber: Nat8) : async Result.Result<(), Types.Error> {
    let isCallerAdmin = isAdminForCaller(caller);
    if(isCallerAdmin == false){
      return #err(#NotAuthorized);
    };

    let defaultSubAccount = getDefaultAccount();
    let potBalance = await bookInstance.getGameweekPotBalance(defaultSubAccount);
    let winningPrincipals = predictionsInstance.getWinnerPrincipalIds(seasonId, gameweekNumber);
    let winnerShare = potBalance / Float.fromInt64(Int64.fromNat64(Nat64.fromNat(winningPrincipals.size())));

    for (i in Iter.range(0, winningPrincipals.size() - 1)) {
      await bookInstance.transferWinnings(Principal.fromActor(Self), Principal.fromText(winningPrincipals[i]), winnerShare);
    };

    return #ok(());
  };

  public shared ({caller}) func enterSweepstake(seasonId : Nat16, gameweekNumber: Nat8) : async Result.Result<(), Types.Error> {
    assert not Principal.isAnonymous(caller);
    
    let alreadyPaid = predictionsInstance.checkSweepstakePaid(Principal.toText(caller), seasonId, gameweekNumber);
    if(alreadyPaid){
      return #err(#NotAllowed);
    };

    let canAffordEntry = await bookInstance.canAffordEntry(Principal.fromActor(Self), caller);

    if(not canAffordEntry){
      return #err(#NotAllowed);
    };

    await bookInstance.transferEntryFee(Principal.fromActor(Self), caller);

    return predictionsInstance.enterSweepstake(Principal.toText(caller), seasonId, gameweekNumber);
  };

  public shared ({caller}) func withdrawICP(amount: Float) : async Result.Result<(), Types.Error> {
    assert not Principal.isAnonymous(caller);
    
    let userProfile = profilesInstance.getProfile(Principal.toText(caller));
    
    switch userProfile {
      case (null) {
        return #err(#NotFound);
      };
      case (?profile) {
        return await bookInstance.withdrawICP(Principal.fromActor(Self), caller, amount, profile.wallet);
      };
    };
  };

  public shared ({caller}) func getUsersWithBalances(page: Nat, pageSize: Nat) : async [Types.Profile] {
    let isCallerAdmin = isAdminForCaller(caller);
    if(isCallerAdmin == false){
      return [];
    };
    
    if(page < 1){
      return [];
    };

    let profiles = profilesInstance.getProfilesByPage(page, pageSize);
    let profilesWithBalances = await bookInstance.getProfileBalances(Principal.fromActor(Self), profiles);
    return profilesWithBalances;
  };

  system func preupgrade() {
    stable_profiles := profilesInstance.getProfiles();
    stable_predictions := predictionsInstance.getUserPredictions();
    stable_seasons := seasonsInstance.getAllData();
    stable_nextSeasonId := seasonsInstance.getNextSeasonId();
    stable_nextFixtureId := seasonsInstance.getNextFixtureId();
    stable_teams := teamsInstance.getTeams();
    stable_nextTeamId := teamsInstance.getNextTeamId();
  };

  system func postupgrade() {
    profilesInstance.setData(stable_profiles);
    predictionsInstance.setData(stable_predictions);
    seasonsInstance.setData(stable_seasons, stable_nextSeasonId, stable_nextFixtureId);
    teamsInstance.setData(stable_teams, stable_nextTeamId);
  };
  
}
