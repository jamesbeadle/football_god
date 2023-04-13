import List "mo:base/List";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Nat8 "mo:base/Nat8";
import Nat64 "mo:base/Nat64";
import Int64 "mo:base/Int64";
import Float "mo:base/Float";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Debug "mo:base/Debug";
import Buffer "mo:base/Buffer";

import Types "types";
import Seasons "seasons";
import Teams "teams";
import Predictions "predictions";
import Profiles "profiles";
import Book "book";
import Account "Account";
import DTOs "DTOs";

actor Self {
  
  let admins : [Principal] = [
    Principal.fromText("5mdop-qg5yr-jbxve-kwibd-vzckf-zauna-bi6g3-53zd4-szfl3-lohay-2ae")
  ];

  let profilesInstance = Profiles.Profiles();
  let seasonsInstance = Seasons.Seasons();
  let teamsInstance = Teams.Teams();
  let predictionsInstance = Predictions.Predictions();
  let bookInstance = Book.Book();
  
  let adminAccount = "fa8d07c80a2e257cdac33786a99bafc4395ea2c913e0caa4c2d0fff0759b7879";

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



  public shared ({caller}) func getHomeDTO() : async DTOs.HomeDTO {

    let systemUpdating = (activeSeason == 0) or (activeGameweek == 0);
    var activeSeasonName = "";
    var activeGameweekNumber = activeGameweek;
    var gameweekPot = Nat64.fromNat(0);
    var fixtures: [DTOs.FixtureDTO] = [];
    var gameweekStatus = Nat8.fromNat(0);

    if(not systemUpdating){

      let season = seasonsInstance.getSeason(activeSeason);
      switch(season){
        case (null) {};
        case (?s) {
          activeSeasonName := s.name;
        };
      };

      let gameweek = seasonsInstance.getGameweek(activeSeason, activeGameweek);
      switch(gameweek){
        case (null) {};
        case (?g) {
          gameweekStatus := g.status;
        };
      };
    
      let defaultSubAccount = getDefaultAccount();
      gameweekPot := await bookInstance.getGameweekPotBalance(defaultSubAccount);

      let fixturesBuffer = Buffer.fromArray<DTOs.FixtureDTO>(fixtures);
      let gameweekFixtures = seasonsInstance.getFixtures(activeSeason, activeGameweek);
      switch (gameweekFixtures) {
        case (null) { };
        case (?fixtures) {
          for (fixture in Iter.fromList<Types.Fixture>(fixtures)) {
            let fixtureDTO: DTOs.FixtureDTO = {
              fixtureId = 0;
              homeTeamId = 0;
              awayTeamId = 0;
              homeTeamName = teamsInstance.getTeamName(fixture.homeTeamId);
              awayTeamName = teamsInstance.getTeamName(fixture.awayTeamId);
              homeTeamGoals = fixture.homeGoals;
              awayTeamGoals = fixture.awayGoals;
              homeTeamPrediction = 0;
              awayTeamPrediction = 0;
              correct = false;
              status = fixture.status;
            };
            fixturesBuffer.add(fixtureDTO);

          };
        };
      };
      fixtures := Buffer.toArray(fixturesBuffer);
    };

    let homeDTO: DTOs.HomeDTO = {
      systemUpdating = systemUpdating;
      activeSeasonName = activeSeasonName;
      activeGameweekNumber = activeGameweekNumber;
      gameweekPot = gameweekPot;
      fixtures = fixtures;
      gameweekStatus = gameweekStatus;
    };

    return homeDTO;
  };

  public shared ({caller}) func getPlayDTO() : async DTOs.PlayDTO {
    
    assert not Principal.isAnonymous(caller);
    let principalName = Principal.toText(caller);
    let systemUpdating = (activeSeason == 0) or (activeGameweek == 0);
    var activeSeasonName = "";
    var activeGameweekNumber = activeGameweek;
    var fixtures: [DTOs.FixtureDTO] = [];
    var sweepstakePaid = false;
    var accountBalance = Nat64.fromNat(0);


    if(not systemUpdating){

      let season = seasonsInstance.getSeason(activeSeason);
      switch(season){
        case (null) {};
        case (?s) {
          activeSeasonName := s.name;
        };
      };
    
      let fixturesBuffer = Buffer.fromArray<DTOs.FixtureDTO>(fixtures);
      let gameweekFixtures = seasonsInstance.getFixtures(activeSeason, activeGameweek);
      let existingPredictions = predictionsInstance.getPredictions(principalName, activeSeason, activeGameweek); 
      switch (gameweekFixtures) {
        case (null) { };
        case (?fixtures) {
          for (fixture in Iter.fromList<Types.Fixture>(fixtures)) {

            var predictedHomeGoals = Nat8.fromNat(0);
            var predictedAwayGoals = Nat8.fromNat(0);

            let existingPrediction = Array.find<Types.Prediction>(existingPredictions, func (prediction: Types.Prediction) : Bool {
              return prediction.fixtureId == fixture.id;
            });

            switch(existingPrediction){
              case (null) { };
              case (?prediction){
                predictedHomeGoals := prediction.homeGoals;
                predictedAwayGoals := prediction.awayGoals;
                sweepstakePaid := predictionsInstance.checkSweepstakePaid(principalName, activeSeason, activeGameweek);

                if(not sweepstakePaid){
                  accountBalance := await bookInstance.getUserAccountBalance(Principal.fromActor(Self), caller);
                };

              };
            };

            let fixtureDTO: DTOs.FixtureDTO = {
              fixtureId = fixture.id;
              homeTeamId = fixture.homeTeamId;
              awayTeamId = fixture.awayTeamId;
              homeTeamName = teamsInstance.getTeamName(fixture.homeTeamId);
              awayTeamName = teamsInstance.getTeamName(fixture.awayTeamId);
              homeTeamGoals = fixture.homeGoals;
              awayTeamGoals = fixture.awayGoals;
              homeTeamPrediction = predictedHomeGoals;
              awayTeamPrediction = predictedAwayGoals;
              correct = false;
              status = fixture.status;
            };
            fixturesBuffer.add(fixtureDTO);

          };
        };
      };
      fixtures := Buffer.toArray(fixturesBuffer);
    };


    let playDTO: DTOs.PlayDTO = {
      activeSeasonId = activeSeason;
      activeSeasonName = activeSeasonName;
      activeGameweekNumber = activeGameweekNumber;
      fixtures = fixtures;
      sweepstakePaid = sweepstakePaid;
      accountBalance = accountBalance;
    };

    return playDTO;
  };

  
  public shared ({caller}) func submitPlayDTO(playDTO: DTOs.SubmitPlayDTO) : async Result.Result<(), Types.Error> {
    
    assert not Principal.isAnonymous(caller);
    let principalName = Principal.toText(caller);
    let profile = profilesInstance.getProfile(principalName);
    
    if(profile == null){
      profilesInstance.createProfile(Principal.toText(caller), Principal.toText(caller), "", getUserDepositAccount(caller));
    };

    let currentSeason = switch (await getActiveSeason()) {  
        case null { return #err(#NotAllowed) };
        case (?season) { season }
    };

    let currentGameweek = switch (await getActiveGameweek()) {  
        case null { return #err(#NotAllowed) };
        case (?gameweek) { gameweek }
    };

    if(currentGameweek.status != 1){
      return #err(#NotAllowed);
    };

    let validPredictions = seasonsInstance.checkValidPredictions(activeSeason, activeGameweek, playDTO.fixtures);
    
    if(not validPredictions){
      return #err(#NotAllowed);
    };

    let paidForSweepstake = predictionsInstance.checkSweepstakePaid(Principal.toText(caller), activeSeason, activeGameweek);

    if(playDTO.enterSweepstake and not paidForSweepstake){
      let canAffordEntry = await bookInstance.canAffordEntry(Principal.fromActor(Self), caller);

      if(not canAffordEntry){
        return #err(#NotAllowed);
      };

      await bookInstance.transferEntryFee(Principal.fromActor(Self), caller);
    };

    return predictionsInstance.submitPredictions(principalName, activeSeason, activeGameweek, playDTO.fixtures, playDTO.enterSweepstake);
  };





























  //profile functions
  
  public shared ({caller}) func getProfile() : async ?Types.Profile {
    assert not Principal.isAnonymous(caller);
    let profile = profilesInstance.getProfile(Principal.toText(caller));
    
    if(profile == null){
      profilesInstance.createProfile(Principal.toText(caller), Principal.toText(caller), "", getUserDepositAccount(caller));
      return profilesInstance.getProfile(Principal.toText(caller));
    };

    return profile;
  };
  
  public shared ({caller}) func getPublicProfile(principalName: Text) : async ?Types.Profile {
    let profile = profilesInstance.getPublicProfile(principalName);
    
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

  public shared ({caller}) func isWalletValid(walletAddress: Text) : async Bool {
    assert not Principal.isAnonymous(caller);
    return profilesInstance.isWalletValid(walletAddress);
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
    if(activeSeason == id){  
      activeSeason := 0;
      activeGameweek := 0;
    };
    let result = predictionsInstance.deleteSeason(id);
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

    let fixtures = seasonsInstance.getFixtures(seasonId, gameweekNumber);
    switch(fixtures){
      case (null) {return []};
      case (?f) { return List.toArray(f);}
    };
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

    let fixtures = seasonsInstance.getFixtures(seasonId, gameweekNumber);
    switch(fixtures){
      case (null) {return #err(#NotAllowed);};
      case (?f) { 
        return predictionsInstance.updatePredictionsCount(seasonId, gameweekNumber, List.toArray(f));
      }
    };
    
  };

  public shared ({caller}) func deleteFixture(seasonId : Nat16, gameweekNumber: Nat8, fixtureId: Nat32) : async Result.Result<(), Types.Error> {
    let isCallerAdmin = isAdminForCaller(caller);
    if(isCallerAdmin == false){
      return #err(#NotAuthorized);
    };

    let result = seasonsInstance.deleteFixture(seasonId, gameweekNumber, fixtureId);

    let fixtures = seasonsInstance.getFixtures(seasonId, gameweekNumber);
    switch(fixtures){
      case (null) {return #err(#NotAllowed);};
      case (?f) { 
        return predictionsInstance.deleteFixture(seasonId, gameweekNumber, List.toArray(f), fixtureId);
      }
    };


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
  /*
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

    //let validPredictions = checkValidPredictions(seasonId, gameweekNumber, predictions);
    let validPredictions = false;

    if(not validPredictions){
      return #err(#NotAllowed);
    };

    let principalName = Principal.toText(caller); 
    return predictionsInstance.submitPredictions(principalName, seasonId, gameweekNumber, predictions);
  };
*/
  /*
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
  */

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

  public shared ({caller}) func getCorrectPredictions(seasonId: Nat16, gameweekNumber: Nat8, fixtureId: Nat32, start: Nat, count: Nat) : async ?Types.CorrectPredictions {
    let isCallerAdmin = isAdminForCaller(caller);
    if(isCallerAdmin == false){
      return null;
    };

    let fixture = seasonsInstance.getFixture(seasonId, gameweekNumber, fixtureId);
    switch fixture {
      case (null) { return null; };
      case (?foundFixture) {
        
        let predictions = ?predictionsInstance.getCorrectPredictions(seasonId, gameweekNumber, foundFixture, start, count); 
        switch predictions {
          case (null) { return null; };
          case (?foundPredictions) {
            let predictionsWithNames = profilesInstance.getPredictionNames(foundPredictions);
            return ?predictionsWithNames;
          };
        };
      };
    };
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

/*
  public shared func getGameweekPot() : async Int64 {
    let defaultSubAccount = getDefaultAccount();
    let potBalance = await bookInstance.getGameweekPotBalance(defaultSubAccount);
    
    let balanceICP = potBalance / 1e8;
    return Float.toInt64(Float.nearest(balanceICP));
  };
*/

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
    let potBalance = await bookInstance.getTotalBalance(defaultSubAccount);

    let winnerCount = predictionsInstance.countWinners(seasonId, gameweekNumber);

    let payoutData: Types.PayoutData = {
      winners = winnerCount;
      totalPot = potBalance;
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
    let winnerShare = Float.fromInt64(Int64.fromNat64(potBalance)) / Float.fromInt64(Int64.fromNat64(Nat64.fromNat(winningPrincipals.size())));

    for (i in Iter.range(0, winningPrincipals.size() - 1)) {
      await bookInstance.transferWinnings(Principal.fromActor(Self), Principal.fromText(winningPrincipals[i]), winnerShare);
      let result = predictionsInstance.updateWinnings(seasonId, gameweekNumber, winningPrincipals[i], Int64.toNat64(Float.toInt64(winnerShare)));
    };

    return await bookInstance.transferAdminFee(Principal.fromActor(Self), adminAccount);
  };

/*
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
*/
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

  public shared ({caller}) func getUsersWithBalances(page: Nat, pageSize: Nat) : async ?Types.UserBalances {
    let isCallerAdmin = isAdminForCaller(caller);
    if(isCallerAdmin == false){
      return null;
    };
    
    if(page < 1){
      return null;
    };

    let profiles = profilesInstance.getProfilesByPage(page, pageSize);
    let profilesWithBalances = await bookInstance.getProfileBalances(Principal.fromActor(Self), profiles);
    
    return ?profilesWithBalances;
  };

  //leaderboard functions
  

  public shared ({caller}) func getLeaderboard(seasonId: Nat16, gameweekNumber: Nat8, start: Nat, count: Nat) : async Types.Leaderboard {

    let leaderboard = predictionsInstance.getLeaderboard(seasonId, gameweekNumber, start, count);
    let leaderboardWithNames = profilesInstance.getLeaderboardNames(leaderboard);

    return leaderboardWithNames; 
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
