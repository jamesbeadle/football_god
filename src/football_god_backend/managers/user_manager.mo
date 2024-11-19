import Result "mo:base/Result";
import List "mo:base/List";
import Text "mo:base/Text";
import Nat64 "mo:base/Nat64";
import Blob "mo:base/Blob";
import Buffer "mo:base/Buffer";
import Array "mo:base/Array";
import Option "mo:base/Option";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Account "../utilities/Account";
import T "../types/app_types";
import Base "../types/base_types";
import RequestDTOs "../dtos/request_DTOs";
import ResponseDTOs "../dtos/response_DTOs";
import BettingTypes "../types/betting_types";
import Environment "../environment";
import FootballTypes "../types/football_types";
import Utilities "../utilities/utilities";
import Management "../utilities/Management";
import ProfileCanister "../canister_definitions/profile-canister";
import Cycles "mo:base/ExperimentalCycles";
import Order "mo:base/Order";

module {

  public class UserManager() {

    private var profileCanisterIds: [(Base.PrincipalId, Base.CanisterId)] = [];
    private var uniqueProfileCanisterIds: [Base.CanisterId] = [];
    private var activeProfileCanisterId = "";
    private var usernames: [(Base.PrincipalId, Text)] = [];
    
    public func getProfile(principalId : Text) : async Result.Result<ResponseDTOs.ProfileDTO, T.Error> {
      await checkOrCreateProfile(principalId);
      let profileCanisterId = Array.find(profileCanisterIds, func(profileCanisterEntry: (Base.PrincipalId, Base.CanisterId)) : Bool {
        profileCanisterEntry.0 == principalId;
      });

      switch(profileCanisterId){
        case (?foundCanisterId){
          let profile_canister = actor (foundCanisterId.1) : actor {
            getProfile : (principalId : Text) -> async Result.Result<ResponseDTOs.ProfileDTO, T.Error>;
          };
          return await profile_canister.getProfile(principalId);
        };
        case (null){
          return #err(#NotFound);
        }
      };
    };
      
    public func updateUsername(dto: RequestDTOs.UpdateUsernameDTO) : async Result.Result<(), T.Error> {
      await checkOrCreateProfile(dto.principalId);
      if(not validUsername(dto.username, dto.principalId)){
        return #err(#NotAllowed);
      };
      let userProfileCanisterId = Array.find<(Base.PrincipalId, Base.CanisterId)>(profileCanisterIds, func(entry: (Base.PrincipalId, Base.CanisterId)) : Bool {
        entry.0 == dto.principalId;
      });

      switch(userProfileCanisterId){
        case (?foundCanisterId){
          let profile_canister = actor (foundCanisterId.1) : actor {
            updateUsername : (dto: RequestDTOs.UpdateUsernameDTO) -> async Result.Result<(), T.Error>;
          };
          return await profile_canister.updateUsername(dto);
        };
        case (null){
          return #err(#NotFound);
        }
      };
    };

    public func updateProfilePicture(dto: RequestDTOs.UpdateProfilePictureDTO) : async Result.Result<(), T.Error> {
      await checkOrCreateProfile(dto.principalId);
      if(not validProfilePicture(dto.profilePicture)){
        return #err(#NotAllowed);
      };
      let userProfileCanisterId = Array.find<(Base.PrincipalId, Base.CanisterId)>(profileCanisterIds, func(entry: (Base.PrincipalId, Base.CanisterId)) : Bool {
        entry.0 == dto.principalId;
      });

      switch(userProfileCanisterId){
        case (?foundCanisterId){
          let profile_canister = actor (foundCanisterId.1) : actor {
            updateProfilePicture : (dto: RequestDTOs.UpdateProfilePictureDTO) -> async Result.Result<(), T.Error>;
          };
          return await profile_canister.updateProfilePicture(dto);
        };
        case (null){
          return #err(#NotFound);
        }
      };
    };

    public func updateWithdrawalAddress(dto: RequestDTOs.UpdateWithdrawalAddressDTO) : async Result.Result<(), T.Error> {
      await checkOrCreateProfile(dto.principalId);
      if(not validWithdrawalAddress(dto.withdrawalAddress)){
        return #err(#NotAllowed);
      };
      let userProfileCanisterId = Array.find<(Base.PrincipalId, Base.CanisterId)>(profileCanisterIds, func(entry: (Base.PrincipalId, Base.CanisterId)) : Bool {
        entry.0 == dto.principalId;
      });

      switch(userProfileCanisterId){
        case (?foundCanisterId){
          let profile_canister = actor (foundCanisterId.1) : actor {
            updateWithdrawalAddress : (dto: RequestDTOs.UpdateWithdrawalAddressDTO) -> async Result.Result<(), T.Error>;
          };
          return await profile_canister.updateWithdrawalAddress(dto);
        };
        case (null){
          return #err(#NotFound);
        }
      }
    };

    public func pauseAccount(dto: RequestDTOs.PauseAccountDTO) : async Result.Result<(), T.Error> {
      await checkOrCreateProfile(dto.principalId);
      let userProfileCanisterId = Array.find<(Base.PrincipalId, Base.CanisterId)>(profileCanisterIds, func(entry: (Base.PrincipalId, Base.CanisterId)) : Bool {
        entry.0 == dto.principalId;
      });

      switch(userProfileCanisterId){
        case (?foundCanisterId){
          let profile_canister = actor (foundCanisterId.1) : actor {
            pauseAccount : (dto: RequestDTOs.PauseAccountDTO) -> async Result.Result<(), T.Error>;
          };
          return await profile_canister.pauseAccount(dto);
        };
        case (null){
          return #err(#NotFound);
        }
      };
    };

    public func setMaxBetLimit(dto: RequestDTOs.SetMaxBetLimit) : async Result.Result<(), T.Error> {
      await checkOrCreateProfile(dto.principalId);
      let userProfileCanisterId = Array.find<(Base.PrincipalId, Base.CanisterId)>(profileCanisterIds, func(entry: (Base.PrincipalId, Base.CanisterId)) : Bool {
        entry.0 == dto.principalId;
      });

      switch(userProfileCanisterId){
        case (?foundCanisterId){
          let profile_canister = actor (foundCanisterId.1) : actor {
            setMaxBetLimit : (dto: RequestDTOs.SetMaxBetLimit) -> async Result.Result<(), T.Error>;
          };
          return await profile_canister.setMaxBetLimit(dto);
        };
        case (null){
          return #err(#NotFound);
        }
      };
    };

    public func setMonthlyBetLimit(dto: RequestDTOs.SetMonthlyBetLimitDTO) : async Result.Result<(), T.Error> {
      await checkOrCreateProfile(dto.principalId);
      let userProfileCanisterId = Array.find<(Base.PrincipalId, Base.CanisterId)>(profileCanisterIds, func(entry: (Base.PrincipalId, Base.CanisterId)) : Bool {
        entry.0 == dto.principalId;
      });

      switch(userProfileCanisterId){
        case (?foundCanisterId){
          let profile_canister = actor (foundCanisterId.1) : actor {
            setMonthlyBetLimit : (dto: RequestDTOs.SetMonthlyBetLimitDTO) -> async Result.Result<(), T.Error>;
          };
          return await profile_canister.setMonthlyBetLimit(dto);
        };
        case (null){
          return #err(#NotFound);
        }
      };
    };

    public func placeBet(dto: RequestDTOs.SubmitBetslipDTO) : async Result.Result<BettingTypes.BetSlip, T.Error> {
      await checkOrCreateProfile(dto.principalId);
      let userProfileCanisterId = Array.find<(Base.PrincipalId, Base.CanisterId)>(profileCanisterIds, func(entry: (Base.PrincipalId, Base.CanisterId)) : Bool {
        entry.0 == dto.principalId;
      });

      switch(userProfileCanisterId){
        case (?foundCanisterId){
          let profile_canister = actor (foundCanisterId.1) : actor {
            placeBet : (dto: RequestDTOs.SubmitBetslipDTO) -> async Result.Result<BettingTypes.BetSlip, T.Error>;
          };
          return await profile_canister.placeBet(dto);
        };
        case (null){
          return #err(#NotFound);
        }
      };
    };

    public func getBets(dto: RequestDTOs.GetBetsDTO) : async Result.Result<[BettingTypes.BetSlip], T.Error>{
      await checkOrCreateProfile(dto.principalId);
      let userProfileCanisterId = Array.find<(Base.PrincipalId, Base.CanisterId)>(profileCanisterIds, func(entry: (Base.PrincipalId, Base.CanisterId)) : Bool {
        entry.0 == dto.principalId;
      });

      switch(userProfileCanisterId){
        case (?foundCanisterId){
          let profile_canister = actor (foundCanisterId.1) : actor {
            getBets : (dto: RequestDTOs.GetBetsDTO) -> async Result.Result<[BettingTypes.BetSlip], T.Error>;
          };
          return await profile_canister.getBets(dto);
        };
        case (null){
          return #err(#NotFound);
        }
      };
    };

    public func settleBet(betslip: BettingTypes.BetSlip) : async () {
      
      let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
        getBetslipFixtures : shared query (dto: RequestDTOs.GetBetslipFixturesDTO) -> async Result.Result<[ResponseDTOs.FixtureDTO], T.Error>;
      };
      let fixturesResult = await data_canister.getBetslipFixtures({
        selections = betslip.selections;
      });

      switch(fixturesResult){
        case (#ok betFixtures){ 

          let updatedSelectionBuffer = Buffer.fromArray<BettingTypes.Selection>([]);
          label selectionLoop for(selection in Iter.fromArray(betslip.selections)){
            let fixtureResult = Array.find<ResponseDTOs.FixtureDTO>(betFixtures, func (fixture: ResponseDTOs.FixtureDTO) : Bool {
              fixture.id == selection.fixtureId;
            });

            switch(fixtureResult){
              case (?fixture){
                switch(selection.selectionDetail){
                  case(#AnytimeAssist detail){
                    let foundAssist = Array.find<FootballTypes.PlayerEventData>(fixture.events, func(playerEvent: FootballTypes.PlayerEventData) : Bool {
                      playerEvent.eventType == #GoalAssisted and playerEvent.playerId == detail.playerId;
                    });

                    if(Option.isSome(foundAssist)){
                      updatedSelectionBuffer.add(createWinningSelection(selection));
                    } else {
                      updatedSelectionBuffer.add(createLosingSelection(selection));
                    };
                  };
                  case(#AnytimeGoalscorer detail){
                    let foundGoal = Array.find<FootballTypes.PlayerEventData>(fixture.events, func(playerEvent: FootballTypes.PlayerEventData) : Bool {
                      playerEvent.eventType == #Goal and playerEvent.playerId == detail.playerId;
                    });

                    if(Option.isSome(foundGoal)){
                      updatedSelectionBuffer.add(createWinningSelection(selection));
                    } else {
                      updatedSelectionBuffer.add(createLosingSelection(selection));
                    };
                  };
                  case(#BothTeamsToScore detail){

                    var correctResult = false;

                    if(
                      detail.bothTeamsToScore and 
                      fixture.homeGoals > 0 and 
                      fixture.awayGoals > 0){
                        correctResult := true;
                    };

                    if(
                      not detail.bothTeamsToScore and 
                      (fixture.homeGoals == 0 or 
                      fixture.awayGoals == 0)){
                        correctResult := true;
                    };

                    if(correctResult){
                      updatedSelectionBuffer.add(createWinningSelection(selection));
                    } else {
                      updatedSelectionBuffer.add(createLosingSelection(selection));
                    }
                  };
                  case(#BothTeamsToScoreAndWinner detail){

                    var correctScoreResult = false;

                    if(
                      detail.bothTeamsToScore and 
                      fixture.homeGoals > 0 and 
                      fixture.awayGoals > 0){
                        correctScoreResult := true;
                    };

                    if(
                      not detail.bothTeamsToScore and 
                      (fixture.homeGoals == 0 or 
                      fixture.awayGoals == 0)){
                        correctScoreResult := true;
                    };

                    var correctWinnerResult = false;

                    if(detail.matchResult == #HomeWin and fixture.homeGoals > fixture.awayGoals){
                      correctWinnerResult := true;
                    };

                    if(detail.matchResult == #Draw and fixture.homeGoals == fixture.awayGoals){
                      correctWinnerResult := true;
                    };

                    if(detail.matchResult == #AwayWin and fixture.homeGoals < fixture.awayGoals){
                      correctWinnerResult := true;
                    };

                    if(correctScoreResult and correctWinnerResult){
                      updatedSelectionBuffer.add(createWinningSelection(selection));
                    } else {
                      updatedSelectionBuffer.add(createLosingSelection(selection));
                    };
                  };
                  case(#CorrectResult detail){
                    var correctResult = false;

                    if(detail.matchResult == #HomeWin and fixture.homeGoals > fixture.awayGoals){
                      correctResult := true;
                    };

                    if(detail.matchResult == #Draw and fixture.homeGoals == fixture.awayGoals){
                      correctResult := true;
                    };

                    if(detail.matchResult == #AwayWin and fixture.homeGoals < fixture.awayGoals){
                      correctResult := true;
                    };

                    if(correctResult){
                      updatedSelectionBuffer.add(createWinningSelection(selection));
                    } else {
                      updatedSelectionBuffer.add(createLosingSelection(selection));
                    };
                  };
                  case(#CorrectScore detail){
                    let correctResult = detail.homeGoals == fixture.homeGoals and detail.awayGoals == fixture.awayGoals;
                    if(correctResult){
                      updatedSelectionBuffer.add(createWinningSelection(selection));
                    } else {
                      updatedSelectionBuffer.add(createLosingSelection(selection));
                    };
                  };
                  case(#FirstAssist detail){
                    let assists = Array.filter<FootballTypes.PlayerEventData>(fixture.events, func(playerEvent: FootballTypes.PlayerEventData){
                      playerEvent.eventType == #GoalAssisted;
                    });
                    
                    if(Array.size(assists) == 0){
                      updatedSelectionBuffer.add(createLosingSelection(selection));
                      continue selectionLoop;
                    };

                    let sortedAssists = Array.sort(
                      assists,
                      func(a : FootballTypes.PlayerEventData, b : FootballTypes.PlayerEventData) : Order.Order {
                        if (a.eventEndMinute < b.eventEndMinute) { return #greater };
                        if (a.eventEndMinute == b.eventEndMinute) { return #equal };
                        return #less;
                      },
                    );

                    let firstAssist = sortedAssists[0];
                    if(firstAssist.playerId == detail.playerId){
                      updatedSelectionBuffer.add(createWinningSelection(selection));
                    } else {
                      updatedSelectionBuffer.add(createLosingSelection(selection));
                    };
                  };
                  case(#FirstGoalscorer detail){

                  };
                  case(#HalfTimeFullTimeResult detail){

                  };
                  case(#HalfTimeScore detail){

                  };
                  case(#LastAssist detail){

                  };
                  case(#LastGoalscorer detail){

                  };
                  case(#MissPenalty detail){

                  };
                  case(#PenaltyGiven detail){

                  };
                  case(#PenaltyMissed detail){

                  };
                  case(#PenaltyScored detail){

                  };
                  case(#RedCard detail){

                  };
                  case(#ScoreBrace detail){

                  };
                  case(#ScoreHatrick detail){

                  };
                  case(#ScoreHeader detail){

                  };
                  case(#ScoreOutsideBox detail){

                  };
                  case(#ScorePenalty detail){

                  };
                  case(#YellowCard detail){

                  };
                };

              };
              case (null){}
            };          
          };  
        };
        case (#err _){}
      };

      //Get the fixture from the data canister

      //Evaluate each selection on each betslip in accordance with the bet type to determine winnings

      //Pay winnings to user

      //Record the winnings

      //Settle the bet win lose with winnings if applicable in users canister

      //Update the users totals for months etc
    };

    private func createWinningSelection(selection: BettingTypes.Selection) : BettingTypes.Selection {
      return {
        fixtureId = selection.fixtureId;
        odds = selection.odds;
        result = #Won;
        selectionDetail = selection.selectionDetail;
        selectionType = selection.selectionType;
        stake = selection.stake;
        status = #Settled;
        winnings = selection.odds * Utilities.convertNat64ToFloat(selection.stake);
      };
    };

    private func createLosingSelection(selection: BettingTypes.Selection) : BettingTypes.Selection {
      return {
        fixtureId = selection.fixtureId;
        odds = selection.odds;
        result = #Lost;
        selectionDetail = selection.selectionDetail;
        selectionType = selection.selectionType;
        stake = selection.stake;
        status = #Settled;
        winnings = 0;
      };
    };

    private func checkOrCreateProfile(principalId: Base.PrincipalId) : async () {
      if(activeProfileCanisterId == ""){
        await createProfileCanister();
        await createProfile(principalId);
      };

      let foundProfileCanisterId = Array.find<(Base.PrincipalId, Base.CanisterId)>(profileCanisterIds, func(entry: (Base.PrincipalId, Base.CanisterId)) : Bool {
        entry.0 == principalId;
      });

      if(Option.isNull(foundProfileCanisterId)){
        if(await activeCanisterFull()){
          await createProfileCanister();
        };
        await createProfile(principalId);
      };
    };

    private func createProfileCanister() : async () {
      
      Cycles.add<system>(50_000_000_000_000);
      
      let canister = await ProfileCanister._ProfileCanister();
      
      let canister_principal = Principal.fromActor(canister);
      let canisterId = Principal.toText(canister_principal);
      activeProfileCanisterId := canisterId;
      let uniqueProfileCanisterIdsBuffer = Buffer.fromArray<Base.CanisterId>(uniqueProfileCanisterIds);
      uniqueProfileCanisterIdsBuffer.add(canisterId);
      uniqueProfileCanisterIds := Buffer.toArray(uniqueProfileCanisterIdsBuffer);
      
      let IC : Management.Management = actor (Environment.Default);
      let _ = await Utilities.updateCanister_(canister, ?Principal.fromText(Environment.BACKEND_CANISTER_ID), IC);
    };

    private func createProfile(principalId: Base.PrincipalId) : async () {
      let profileCanisterIdsBuffer = Buffer.fromArray<(Base.PrincipalId, Base.CanisterId)>(profileCanisterIds);
      
      let profile_canister = actor (activeProfileCanisterId) : actor {
        createProfile : (principalId : Text) -> async Result.Result<(), T.Error>;
      };
      let profileResult = await profile_canister.createProfile(principalId);

      switch(profileResult){
        case (#ok _){
          profileCanisterIdsBuffer.add(principalId, activeProfileCanisterId);
          profileCanisterIds := Buffer.toArray(profileCanisterIdsBuffer);
        };
        case (#err _){}
      };    
    };

    private func activeCanisterFull() : async Bool {
      let profile_canister = actor (activeProfileCanisterId) : actor {
        canisterFull : () -> async Bool;
      };
      return await profile_canister.canisterFull();
    };

    private func validWithdrawalAddress(withdrawalAddress : Text) : Bool {
      let account_id = Account.decode(withdrawalAddress);
      switch account_id {
        case (#ok array) {
          if (Account.validateAccountIdentifier(Blob.fromArray(array))) {
            return true;
          };
        };
        case (#err _) { return false; };
      };
      return false;
    };

    private func validUsername(username : Text, potentialPrincipalId: Base.PrincipalId) : Bool {

      if (Text.size(username) < 3 or Text.size(username) > 20) {
        return false;
      };

      let isAlphanumeric = func(s : Text) : Bool {
        let chars = Text.toIter(s);
        for (c in chars) {
          if (not ((c >= 'a' and c <= 'z') or (c >= 'A' and c <= 'Z') or (c >= '0' and c <= '9'))) {
            return false;
          };
        };
        return true;
      };

      if (not isAlphanumeric(username)) {
        return false;
      };

      //TODO: ALSO CHECK IF THE USERNAME IS ALREADY TAKEN
      let foundUsername = Array.find<(Base.PrincipalId, Text)>(usernames, func(entry: (Base.PrincipalId, Text)) : Bool {
        entry.1 == username and entry.0 != potentialPrincipalId;
      });

      if(Option.isSome(foundUsername)){
        return false;
      };


      return true;
    };

    private func validProfilePicture(profilePicture : Blob) : Bool {
      let sizeInKB = Array.size(Blob.toArray(profilePicture)) / 1024;
      return (sizeInKB > 0 and sizeInKB <= 500);
    };

    //Stable storage functions

    public func getStableProfileCanisterIds() : [(Base.PrincipalId, Base.CanisterId)] {
      return profileCanisterIds;
    };

    public func setStableProfileCanisterIds(stable_profile_canister_ids: [(Base.PrincipalId, Base.CanisterId)]) {
      profileCanisterIds := stable_profile_canister_ids;
    };

    public func getStableUniqueProfileCanisterIds () : [Base.CanisterId] {
      return uniqueProfileCanisterIds;
    };

    public func setStableUniqueProfileCanisterIds(stable_unique_profile_canister_ids: [Base.CanisterId]){
      uniqueProfileCanisterIds := stable_unique_profile_canister_ids;
    };

    public func getStableActiveProfileCanisterId() : Base.CanisterId {
      return activeProfileCanisterId;
    };

    public func setStableActiveProfileCanisterId(stable_active_profile_canister_id: Base.CanisterId) {
      activeProfileCanisterId := stable_active_profile_canister_id;
    };

    public func getStableUsernames() : [(Base.PrincipalId, Text)] {
      return usernames;
    };

    public func setStableUsernames(stable_usernames: [(Base.PrincipalId, Text)]) {
      usernames := stable_usernames;
    };

  };
};
