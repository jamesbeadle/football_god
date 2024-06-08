import T "types";
import Result "mo:base/Result";
import Map "mo:base/HashMap";
import Text "mo:base/Text";
import List "mo:base/List";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Int "mo:base/Int";
import Nat64 "mo:base/Nat64";
import Buffer "mo:base/Buffer";
import Time "mo:base/Time";
import TrieMap "mo:base/TrieMap";
import Order "mo:base/Order";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import DTOs "DTOs";

import Euro2024Teams "./data/euro2024_teams";

module {

  public class Euro2024() {

    private var teams : List.List<T.InternationalTeam> = List.fromArray(Euro2024Teams.Euro2024Teams().teams);

    private var userPredictions = Map.HashMap<T.PrincipalName, T.Euro2024Prediction>(0, Text.equal, Text.hash);

    private var events: [T.Euro2024Event] = [];
    private var leaderboardEntries: [T.LeaderboardEntry] = [];

    private var state: T.Euro2024State = {
      prizePool = 0;
      totalManagers = 0;
      stage = #Selecting;
    };

    public func getState() : T.Euro2024State {
      return state;
    };

    public func setState(stable_state: T.Euro2024State){
      state := stable_state;
    };

    public func setGameState(gameStage: T.GameState){
      let newSystemState: T.Euro2024State = {
        prizePool = state.prizePool;
        totalManagers = state.totalManagers;
        stage = gameStage;
      };
      state := newSystemState;
    };

    public func setData(stable_predictions : [(T.PrincipalName, T.Euro2024Prediction)]) {
      userPredictions := Map.fromIter<T.PrincipalName, T.Euro2024Prediction>(
        stable_predictions.vals(),
        stable_predictions.size(),
        Text.equal,
        Text.hash,
      );
    };

    public func setEvents(stable_events: [T.Euro2024Event]) {
      events := stable_events;
    };

    public func getEvents() : [T.Euro2024Event] {
      return events;
    };

    public func getPredictions(principalName : Text) : ?DTOs.Euro2024PredictionDTO {
      let userPrediction = userPredictions.get(principalName);
      switch(userPrediction){
        case null{
          return null;
        };
        case (?foundUserPrediction){
          return ?{
            alreadyEntered = true;
            groupAPrediction = foundUserPrediction.groupAPrediction;
            groupBPrediction = foundUserPrediction.groupBPrediction;
            groupCPrediction = foundUserPrediction.groupCPrediction;
            groupDPrediction = foundUserPrediction.groupDPrediction;
            groupEPrediction = foundUserPrediction.groupEPrediction;
            groupFPrediction = foundUserPrediction.groupFPrediction;
            r16Prediction = foundUserPrediction.r16Prediction;
            qfPrediction = foundUserPrediction.qfPrediction;
            sfPrediction = foundUserPrediction.sfPrediction;
            fPrediction = foundUserPrediction.fPrediction;
            entryTime = foundUserPrediction.entryTime;
            principalId = foundUserPrediction.principalId;
            totalScore = foundUserPrediction.totalScore;
          }
        }
      }
    };

    public func submitPredictions(principalName : Text, predictions : DTOs.Euro2024PredictionDTO) : Result.Result<(), T.Error> {
      userPredictions.put(
        principalName,
        {
          groupAPrediction = predictions.groupAPrediction;
          groupBPrediction = predictions.groupBPrediction;
          groupCPrediction = predictions.groupCPrediction;
          groupDPrediction = predictions.groupDPrediction;
          groupEPrediction = predictions.groupEPrediction;
          groupFPrediction = predictions.groupFPrediction;
          r16Prediction = predictions.r16Prediction;
          qfPrediction = predictions.qfPrediction;
          sfPrediction = predictions.sfPrediction;
          fPrediction = predictions.fPrediction;
          totalScore = 0;
          winnings = 0;
          principalId = principalName;
          entryTime = Time.now();
        },
      );

      state := {
        prizePool = state.prizePool; 
        stage = state.stage; 
        totalManagers = state.totalManagers + 1;
      };

      return #ok(());
    };

    public func getLeaderboardDTO(start : Nat, count : Nat) : DTOs.Euro2024LeaderBoardDTO {

      func compare(leaderboardEntry1 : DTOs.Euro2024LeaderboardEntryDTO, leaderboardEntry2 : DTOs.Euro2024LeaderboardEntryDTO) : Bool {
        return leaderboardEntry1.totalScore >= leaderboardEntry2.totalScore;
      };

      func mergeSort(entries : List.List<DTOs.Euro2024LeaderboardEntryDTO>) : List.List<DTOs.Euro2024LeaderboardEntryDTO> {
        let len = List.size(entries);

        if (len <= 1) {
          return entries;
        } else {
          let (firstHalf, secondHalf) = List.split(len / 2, entries);
          return List.merge(mergeSort(firstHalf), mergeSort(secondHalf), compare);
        };
      };

      func generatePositionText(sortedEntries : List.List<DTOs.Euro2024LeaderboardEntryDTO>) : List.List<DTOs.Euro2024LeaderboardEntryDTO> {
        var position = 1;
        var previousScore : ?Nat16 = null;

        func updatePosition(entry : DTOs.Euro2024LeaderboardEntryDTO) : DTOs.Euro2024LeaderboardEntryDTO {
          if (previousScore == null or previousScore != ?entry.totalScore) {
            previousScore := ?entry.totalScore;
            let updatedEntry = { entry with position = Int.toText(position) };
            position += 1;
            return updatedEntry;
          } else {
            return { entry with position = "-" };
          };
        };

        return List.map(sortedEntries, updatePosition);
      };

      let leaderboardEntries = List.fromArray(
        Array.map<(T.PrincipalName, T.Euro2024Prediction), DTOs.Euro2024LeaderboardEntryDTO>(
          Iter.toArray(userPredictions.entries()),
          func((principal, userPrediction) : (T.PrincipalName, T.Euro2024Prediction)) : DTOs.Euro2024LeaderboardEntryDTO {
            let dto : DTOs.Euro2024LeaderboardEntryDTO = {
              position = "";
              principalName = principal;
              displayName = principal;
              totalScore = userPrediction.totalScore;
            };
            return dto;
          },
        ),
      );
      let sortedLeaderboardEntries = mergeSort(leaderboardEntries);
      let positionedLeaderboardEntries = generatePositionText(sortedLeaderboardEntries);

      var totalEntries : Nat = List.size(positionedLeaderboardEntries);
      let paginatedLeaderboardEntries = List.take(List.drop(positionedLeaderboardEntries, start), count);

      let leaderboard : DTOs.Euro2024LeaderBoardDTO = {
        leaderboardEntries = List.toArray<DTOs.Euro2024LeaderboardEntryDTO>(paginatedLeaderboardEntries);
        totalEntries = Nat64.fromNat(totalEntries);
        totalPot = Nat64.fromNat(0);
        winningShare = Nat64.fromNat(0);
        status = 0;
      };

      return leaderboard;
    };

    public func getUserPredictions() : [(T.PrincipalName, T.Euro2024Prediction)] {
      return Iter.toArray(userPredictions.entries());
    };

    public func hasPredictions(principalName : Text) : Bool {
      let userPrediction = userPredictions.get(principalName);

      switch userPrediction {
        case (null) { return false };
        case (?prediction) {
          return true;
        };
      };
    };

    public func checkValidPredictions(predictions : DTOs.Euro2024PredictionDTO) : Bool {

      let allTeamIds = Buffer.fromArray<T.TeamId>([]);
      allTeamIds.add(predictions.groupAPrediction.winner);
      allTeamIds.add(predictions.groupAPrediction.loser);
      allTeamIds.add(predictions.groupBPrediction.winner);
      allTeamIds.add(predictions.groupBPrediction.loser);
      allTeamIds.add(predictions.groupCPrediction.winner);
      allTeamIds.add(predictions.groupCPrediction.loser);
      allTeamIds.add(predictions.groupDPrediction.winner);
      allTeamIds.add(predictions.groupDPrediction.loser);
      allTeamIds.add(predictions.groupEPrediction.winner);
      allTeamIds.add(predictions.groupEPrediction.loser);
      allTeamIds.add(predictions.groupFPrediction.winner);
      allTeamIds.add(predictions.groupFPrediction.loser);
      allTeamIds.add(predictions.r16Prediction.winner);
      allTeamIds.add(predictions.r16Prediction.loser);
      allTeamIds.add(predictions.qfPrediction.winner);
      allTeamIds.add(predictions.qfPrediction.loser);
      allTeamIds.add(predictions.sfPrediction.winner);
      allTeamIds.add(predictions.sfPrediction.loser);
      allTeamIds.add(predictions.fPrediction.winner);
      allTeamIds.add(predictions.fPrediction.loser);

      let allPlayerIds = Buffer.fromArray<T.PlayerId>([]);

      allPlayerIds.add(predictions.groupAPrediction.goalScorer);
      allPlayerIds.add(predictions.groupAPrediction.goalAssister);
      allPlayerIds.add(predictions.groupAPrediction.yellowCard);
      allPlayerIds.add(predictions.groupAPrediction.redCard);
      allPlayerIds.add(predictions.groupBPrediction.goalScorer);
      allPlayerIds.add(predictions.groupBPrediction.goalAssister);
      allPlayerIds.add(predictions.groupBPrediction.yellowCard);
      allPlayerIds.add(predictions.groupBPrediction.redCard);
      allPlayerIds.add(predictions.groupCPrediction.goalScorer);
      allPlayerIds.add(predictions.groupCPrediction.goalAssister);
      allPlayerIds.add(predictions.groupCPrediction.yellowCard);
      allPlayerIds.add(predictions.groupCPrediction.redCard);
      allPlayerIds.add(predictions.groupDPrediction.goalScorer);
      allPlayerIds.add(predictions.groupDPrediction.goalAssister);
      allPlayerIds.add(predictions.groupDPrediction.yellowCard);
      allPlayerIds.add(predictions.groupDPrediction.redCard);
      allPlayerIds.add(predictions.groupEPrediction.goalScorer);
      allPlayerIds.add(predictions.groupEPrediction.goalAssister);
      allPlayerIds.add(predictions.groupEPrediction.yellowCard);
      allPlayerIds.add(predictions.groupEPrediction.redCard);
      allPlayerIds.add(predictions.groupFPrediction.goalScorer);
      allPlayerIds.add(predictions.groupFPrediction.goalAssister);
      allPlayerIds.add(predictions.groupFPrediction.yellowCard);
      allPlayerIds.add(predictions.groupFPrediction.redCard);

      allPlayerIds.add(predictions.r16Prediction.goalScorer);
      allPlayerIds.add(predictions.r16Prediction.goalAssister);
      allPlayerIds.add(predictions.r16Prediction.yellowCard);
      allPlayerIds.add(predictions.r16Prediction.redCard);

      allPlayerIds.add(predictions.qfPrediction.goalScorer);
      allPlayerIds.add(predictions.qfPrediction.goalAssister);
      allPlayerIds.add(predictions.qfPrediction.yellowCard);
      allPlayerIds.add(predictions.qfPrediction.redCard);

      allPlayerIds.add(predictions.sfPrediction.goalScorer);
      allPlayerIds.add(predictions.sfPrediction.goalAssister);
      allPlayerIds.add(predictions.sfPrediction.yellowCard);
      allPlayerIds.add(predictions.sfPrediction.redCard);

      allPlayerIds.add(predictions.fPrediction.goalScorer);
      allPlayerIds.add(predictions.fPrediction.goalAssister);
      allPlayerIds.add(predictions.fPrediction.yellowCard);
      allPlayerIds.add(predictions.fPrediction.redCard);

      let allPlayers = getPlayers();

      for (playerId in Iter.fromArray(Buffer.toArray(allPlayerIds))) {

        let existingPlayer = List.find<T.InternationalPlayer>(
          allPlayers,
          func(p : T.InternationalPlayer) : Bool {
            return p.id == playerId;
          },
        );

        switch (existingPlayer) {
          case (null) {
            return false;
          };
          case _ {};
        };
      };

      for (teamId in Iter.fromArray(Buffer.toArray(allTeamIds))) {

        let existingTeam = List.find<T.InternationalTeam>(
          teams,
          func(t : T.InternationalTeam) : Bool {
            return t.id == teamId;
          },
        );

        switch (existingTeam) {
          case (null) {
            return false;
          };
          case _ {};
        };
      };

      return true;
    };

    public func getPlayers() : List.List<T.InternationalPlayer> {
      let playerBuffer = Buffer.fromArray<T.InternationalPlayer>([]);

      for(team in Iter.fromList<T.InternationalTeam>(teams))
      {
        playerBuffer.append(Buffer.fromArray(team.players));
      };

      return List.fromArray(Buffer.toArray(playerBuffer));
    };

    public func getTeams() : List.List<T.InternationalTeam> {
      let teamBuffer = Buffer.fromArray<T.InternationalTeam>([]);

      for(team in Iter.fromList<T.InternationalTeam>(teams))
      {
        teamBuffer.add(team);
      };

      return List.fromArray(Buffer.toArray(teamBuffer));
    };

    public func getTotalPlayers() : Nat{
        return Iter.size(userPredictions.entries());
    };

    public func getEuro2024StateDTO() : DTOs.Euro2024DTO {
      return {
        prizePool = state.prizePool;
        totalManagers = userPredictions.size();
        stage = state.stage;
      };
    };

    public func submitEvent(dto: DTOs.Euro2024EventDTO){
      let eventsBuffer = Buffer.fromArray<T.Euro2024Event>(events);
      eventsBuffer.add({
        eventType = dto.eventType;
        fixtureId = dto.fixtureId;
        playerId = dto.playerId;
        stageId = dto.stageId;
        teamId = dto.teamId;
      });
    };

    public func getAllEvents() : [DTOs.Euro2024EventDTO] {
      return Array.map<T.Euro2024Event, DTOs.Euro2024EventDTO>(
        events,
        func(evt: T.Euro2024Event) : DTOs.Euro2024EventDTO {
          {
            eventType = evt.eventType;
            fixtureId = evt.fixtureId;
            playerId = evt.playerId;
            stageId = evt.stageId;
            teamId = evt.teamId;
          }
        },
      );
    };

    public func calculateLeaderboard(){

      var entryMap : TrieMap.TrieMap<T.PrincipalName, Nat> = TrieMap.TrieMap<T.PrincipalName, Nat>(Text.equal, Text.hash);

      for(entry in userPredictions.entries()){
        entryMap.put(entry.0, calculateScore(entry.1));
      };

      let entries = Iter.toArray(entryMap.entries());
      let sortedEntries = Array.sort<(T.PrincipalName, Nat)>(entries, func((_: T.PrincipalName, scoreA: Nat), (_: T.PrincipalName, scoreB: Nat)) : Order.Order {
          if (scoreA < scoreB) { return #less };
          if (scoreA == scoreB) { return #equal };
          return #greater;
      });

      var leaderboardBuffer = Buffer.fromArray<T.LeaderboardEntry>([]);
      var currentPosition : Nat = 0;
      var lastScore : Nat = 0;
      var lastPositionText : Text = "";

      for (i in Iter.range(0, sortedEntries.size() - 1)) {
        let (principalName, score) = sortedEntries[i];
        
        if (i == 0 or score != lastScore) {
            currentPosition += 1;
            lastPositionText := Nat.toText(currentPosition);
        };

        leaderboardBuffer.add({
            principalName = principalName;
            position = currentPosition;
            positionText = lastPositionText;
            score = score;
        });

        lastScore := score;
    };
    leaderboardEntries := Buffer.toArray(leaderboardBuffer);

  };

  private func calculateScore(entry : T.Euro2024Prediction) : Nat {
      
      var totalScore: Nat = 0;


      var totalCorrectWinners = 0; 
      var correctWinnersScore = 0;
      var totalCorrectLosers = 0; 
      var correctLosersScore = 0;
      var totalCorrectScorers = 0;
      var correctScorersScore = 0;
      var totalCorrectAssisters = 0; 
      var correctAssistersScore = 0;
      var totalCorrectYellowCards = 0; 
      var correctYellowCardsScore = 0;
      var totalCorrectRedCards = 0; 
      var correctRedCardScore = 0;

      //A

      let predictionAWinner = entry.groupAPrediction.winner;
      let predictionALoser = entry.groupAPrediction.loser;
      let predictionAScorer = entry.groupAPrediction.goalScorer;
      let predictionAAssister = entry.groupAPrediction.goalAssister;
      let predictionAYellowCard = entry.groupAPrediction.yellowCard;
      let predictionARedCard = entry.groupAPrediction.redCard;


      let groupAWinnerMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.teamId == predictionAWinner;
        },
      );
      if (Option.isSome(groupAWinnerMatch)) {
        totalScore += 5;
        totalCorrectWinners += 1;
        correctWinnersScore += 5;
      };

      let groupALoserMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.teamId == predictionALoser;
        },
      );
      if (Option.isSome(groupALoserMatch)) {
        totalScore += 5;
        totalCorrectLosers += 1;
        correctLosersScore += 5;
      };

      let groupAScorerMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.playerId == predictionAScorer;
        },
      );
      if (Option.isSome(groupAScorerMatch)) {
        totalScore += 10;
        totalCorrectScorers += 1;
        correctScorersScore += 10;
      };

      let groupAAssisterMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.playerId == predictionAAssister;
        },
      );
      if (Option.isSome(groupAAssisterMatch)) {
        totalScore += 10;
        totalCorrectScorers += 1;
        correctScorersScore += 10;
      };

      let groupAYellowMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.playerId == predictionAYellowCard;
        },
      );
      if (Option.isSome(groupAYellowMatch)) {
        totalScore += 5;
        totalCorrectScorers += 1;
        correctScorersScore += 5;
      };

      let groupARedMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.playerId == predictionARedCard;
        },
      );
      if (Option.isSome(groupARedMatch)) {
        totalScore += 10;
        totalCorrectScorers += 1;
        correctScorersScore += 10;
      };

      //B

      let predictionBWinner = entry.groupBPrediction.winner;
      let predictionBLoser = entry.groupBPrediction.loser;
      let predictionBScorer = entry.groupBPrediction.goalScorer;
      let predictionBAssister = entry.groupBPrediction.goalAssister;
      let predictionBYellowCard = entry.groupBPrediction.yellowCard;
      let predictionBRedCard = entry.groupBPrediction.redCard;

      let groupBWinnerMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.teamId == predictionBWinner;
        },
      );
      if (Option.isSome(groupBWinnerMatch)) {
        totalScore += 5;
        totalCorrectWinners += 1;
        correctWinnersScore += 5;
      };

      let groupBLoserMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.teamId == predictionBLoser;
        },
      );
      if (Option.isSome(groupBLoserMatch)) {
        totalScore += 5;
        totalCorrectLosers += 1;
        correctLosersScore += 5;
      };

      let groupBScorerMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.playerId == predictionBScorer;
        },
      );
      if (Option.isSome(groupBScorerMatch)) {
        totalScore += 10;
        totalCorrectScorers += 1;
        correctScorersScore += 10;
      };

      let groupBAssisterMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.playerId == predictionBAssister;
        },
      );
      if (Option.isSome(groupBAssisterMatch)) {
        totalScore += 10;
        totalCorrectScorers += 1;
        correctScorersScore += 10;
      };

      let groupBYellowMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.playerId == predictionBYellowCard;
        },
      );
      if (Option.isSome(groupBYellowMatch)) {
        totalScore += 5;
        totalCorrectScorers += 1;
        correctScorersScore += 5;
      };

      let groupBRedMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.playerId == predictionBRedCard;
        },
      );
      if (Option.isSome(groupBRedMatch)) {
        totalScore += 10;
        totalCorrectScorers += 1;
        correctScorersScore += 10;
      };

      //C

      let predictionCWinner = entry.groupCPrediction.winner;
      let predictionCLoser = entry.groupCPrediction.loser;
      let predictionCScorer = entry.groupCPrediction.goalScorer;
      let predictionCAssister = entry.groupCPrediction.goalAssister;
      let predictionCYellowCard = entry.groupCPrediction.yellowCard;
      let predictionCRedCard = entry.groupCPrediction.redCard;

      let groupCWinnerMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.teamId == predictionCWinner;
        },
      );
      if (Option.isSome(groupCWinnerMatch)) {
        totalScore += 5;
        totalCorrectWinners += 1;
        correctWinnersScore += 5;
      };

      let groupCLoserMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.teamId == predictionCLoser;
        },
      );
      if (Option.isSome(groupCLoserMatch)) {
        totalScore += 5;
        totalCorrectLosers += 1;
        correctLosersScore += 5;
      };

      let groupCScorerMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.playerId == predictionCScorer;
        },
      );
      if (Option.isSome(groupCScorerMatch)) {
        totalScore += 10;
        totalCorrectScorers += 1;
        correctScorersScore += 10;
      };

      let groupCAssisterMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.playerId == predictionCAssister;
        },
      );
      if (Option.isSome(groupCAssisterMatch)) {
        totalScore += 10;
        totalCorrectScorers += 1;
        correctScorersScore += 10;
      };

      let groupCYellowMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.playerId == predictionCYellowCard;
        },
      );
      if (Option.isSome(groupCYellowMatch)) {
        totalScore += 5;
        totalCorrectScorers += 1;
        correctScorersScore += 5;
      };

      let groupCRedMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.playerId == predictionCRedCard;
        },
      );
      if (Option.isSome(groupCRedMatch)) {
        totalScore += 10;
        totalCorrectScorers += 1;
        correctScorersScore += 10;
      };

      //D

      let predictionDWinner = entry.groupDPrediction.winner;
      let predictionDLoser = entry.groupDPrediction.loser;
      let predictionDScorer = entry.groupDPrediction.goalScorer;
      let predictionDAssister = entry.groupDPrediction.goalAssister;
      let predictionDYellowCard = entry.groupDPrediction.yellowCard;
      let predictionDRedCard = entry.groupDPrediction.redCard;

      let groupDWinnerMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.teamId == predictionDWinner;
        },
      );
      if (Option.isSome(groupDWinnerMatch)) {
        totalScore += 5;
        totalCorrectWinners += 1;
        correctWinnersScore += 5;
      };

      let groupDLoserMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.teamId == predictionDLoser;
        },
      );
      if (Option.isSome(groupDLoserMatch)) {
        totalScore += 5;
        totalCorrectLosers += 1;
        correctLosersScore += 5;
      };

      let groupDScorerMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.playerId == predictionDScorer;
        },
      );
      if (Option.isSome(groupDScorerMatch)) {
        totalScore += 10;
        totalCorrectScorers += 1;
        correctScorersScore += 10;
      };

      let groupDAssisterMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.playerId == predictionDAssister;
        },
      );
      if (Option.isSome(groupDAssisterMatch)) {
        totalScore += 10;
        totalCorrectScorers += 1;
        correctScorersScore += 10;
      };

      let groupDYellowMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.playerId == predictionDYellowCard;
        },
      );
      if (Option.isSome(groupDYellowMatch)) {
        totalScore += 5;
        totalCorrectScorers += 1;
        correctScorersScore += 5;
      };

      let groupDRedMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.playerId == predictionDRedCard;
        },
      );
      if (Option.isSome(groupDRedMatch)) {
        totalScore += 10;
        totalCorrectScorers += 1;
        correctScorersScore += 10;
      };

      //E

      let predictionEWinner = entry.groupEPrediction.winner;
      let predictionELoser = entry.groupEPrediction.loser;
      let predictionEScorer = entry.groupEPrediction.goalScorer;
      let predictionEAssister = entry.groupEPrediction.goalAssister;
      let predictionEYellowCard = entry.groupEPrediction.yellowCard;
      let predictionERedCard = entry.groupEPrediction.redCard;

      let groupEWinnerMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.teamId == predictionEWinner;
        },
      );
      if (Option.isSome(groupEWinnerMatch)) {
        totalScore += 5;
        totalCorrectWinners += 1;
        correctWinnersScore += 5;
      };

      let groupELoserMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.teamId == predictionELoser;
        },
      );
      if (Option.isSome(groupELoserMatch)) {
        totalScore += 5;
        totalCorrectLosers += 1;
        correctLosersScore += 5;
      };

      let groupEScorerMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.playerId == predictionEScorer;
        },
      );
      if (Option.isSome(groupEScorerMatch)) {
        totalScore += 10;
        totalCorrectScorers += 1;
        correctScorersScore += 10;
      };

      let groupEAssisterMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.playerId == predictionEAssister;
        },
      );
      if (Option.isSome(groupEAssisterMatch)) {
        totalScore += 10;
        totalCorrectScorers += 1;
        correctScorersScore += 10;
      };

      let groupEYellowMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.playerId == predictionEYellowCard;
        },
      );
      if (Option.isSome(groupEYellowMatch)) {
        totalScore += 5;
        totalCorrectScorers += 1;
        correctScorersScore += 5;
      };

      let groupERedMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.playerId == predictionERedCard;
        },
      );
      if (Option.isSome(groupERedMatch)) {
        totalScore += 10;
        totalCorrectScorers += 1;
        correctScorersScore += 10;
      };

      //F

      let predictionFWinner = entry.groupFPrediction.winner;
      let predictionFLoser = entry.groupFPrediction.loser;
      let predictionFScorer = entry.groupFPrediction.goalScorer;
      let predictionFAssister = entry.groupFPrediction.goalAssister;
      let predictionFYellowCard = entry.groupFPrediction.yellowCard;
      let predictionFRedCard = entry.groupFPrediction.redCard;

      let groupFWinnerMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.teamId == predictionFWinner;
        },
      );
      if (Option.isSome(groupFWinnerMatch)) {
        totalScore += 5;
        totalCorrectWinners += 1;
        correctWinnersScore += 5;
      };

      let groupFLoserMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.teamId == predictionFLoser;
        },
      );
      if (Option.isSome(groupFLoserMatch)) {
        totalScore += 5;
        totalCorrectLosers += 1;
        correctLosersScore += 5;
      };

      let groupFScorerMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.playerId == predictionFScorer;
        },
      );
      if (Option.isSome(groupFScorerMatch)) {
        totalScore += 10;
        totalCorrectScorers += 1;
        correctScorersScore += 10;
      };

      let groupFAssisterMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.playerId == predictionFAssister;
        },
      );
      if (Option.isSome(groupFAssisterMatch)) {
        totalScore += 10;
        totalCorrectScorers += 1;
        correctScorersScore += 10;
      };

      let groupFYellowMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.playerId == predictionFYellowCard;
        },
      );
      if (Option.isSome(groupFYellowMatch)) {
        totalScore += 5;
        totalCorrectScorers += 1;
        correctScorersScore += 5;
      };

      let groupFRedMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.playerId == predictionFRedCard;
        },
      );
      if (Option.isSome(groupFRedMatch)) {
        totalScore += 10;
        totalCorrectScorers += 1;
        correctScorersScore += 10;
      };

      //Group Stage Winner Bonus
      if(totalCorrectWinners >= 3){
        totalScore += correctWinnersScore;
      };

      //Group Stage Loser Bonus
      if(totalCorrectLosers >= 3){
        totalScore += correctLosersScore;
      };

      //Group Stage Scorer Bonus
      if(totalCorrectScorers >= 3){
        totalScore += correctScorersScore;
      };

      //Group Stage Assister Bonus
      if(totalCorrectAssisters >= 3){
        totalScore += correctAssistersScore;
      };

      //Group Stage Yellow Card Bonus
      if(totalCorrectYellowCards >= 3){
        totalScore += correctYellowCardsScore;
      };

      //Group Stage Red Card Bonus
      if(totalCorrectRedCards >= 3){
        totalScore += correctRedCardScore;
      };

      //R16
      let predictionR16Winner = entry.r16Prediction.winner;
      let predictionR16Loser = entry.r16Prediction.loser;
      let predictionR16Scorer = entry.r16Prediction.goalScorer;
      let predictionR16Assister = entry.r16Prediction.goalAssister;
      let predictionR16YellowCard = entry.r16Prediction.yellowCard;
      let predictionR16RedCard = entry.r16Prediction.redCard;

      let r16WinnerMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.teamId == predictionR16Winner;
        },
      );
      if (Option.isSome(r16WinnerMatch)) {
        totalScore += 10;
      };

      let r16LoserMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.teamId == predictionR16Loser;
        },
      );
      if (Option.isSome(r16LoserMatch)) {
        totalScore += 10;
      };

      //Bonus
      if(Option.isSome(r16WinnerMatch) and Option.isSome(r16LoserMatch)){
        totalScore += 40;
      };

      let r16ScorerMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.playerId == predictionR16Scorer;
        },
      );
      if (Option.isSome(r16ScorerMatch)) {
        totalScore += 20;
      };

      let r16AssisterMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.playerId == predictionR16Assister;
        },
      );
      if (Option.isSome(r16AssisterMatch)) {
        totalScore += 20;
      };

      //Bonus
      if(Option.isSome(r16ScorerMatch) and Option.isSome(r16AssisterMatch)){
        totalScore += 80;
      };

      let r16YellowCardMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.playerId == predictionR16YellowCard;
        },
      );
      if (Option.isSome(r16YellowCardMatch)) {
        totalScore += 10;
      };

      let r16RedCardMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.playerId == predictionR16RedCard;
        },
      );
      if (Option.isSome(r16RedCardMatch)) {
        totalScore += 20;
      };

      //Bonus
      if(Option.isSome(r16YellowCardMatch) and Option.isSome(r16RedCardMatch)){
        totalScore += 60;
      };

      //QF
      let predictionQFWinner = entry.qfPrediction.winner;
      let predictionQFLoser = entry.qfPrediction.loser;
      let predictionQFScorer = entry.qfPrediction.goalScorer;
      let predictionQFAssister = entry.qfPrediction.goalAssister;
      let predictionQFYellowCard = entry.qfPrediction.yellowCard;
      let predictionQFRedCard = entry.qfPrediction.redCard;

      let qfWinnerMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.teamId == predictionQFWinner;
        },
      );
      if (Option.isSome(qfWinnerMatch)) {
        totalScore += 15;
      };

      let qfLoserMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.teamId == predictionQFLoser;
        },
      );
      if (Option.isSome(qfLoserMatch)) {
        totalScore += 15;
      };

      //Bonus
      if(Option.isSome(qfWinnerMatch) and Option.isSome(qfLoserMatch)){
        totalScore += 60;
      };

      let qfScorerMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.playerId == predictionQFScorer;
        },
      );
      if (Option.isSome(qfScorerMatch)) {
        totalScore += 30;
      };

      let qfAssisterMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.playerId == predictionQFAssister;
        },
      );
      if (Option.isSome(qfAssisterMatch)) {
        totalScore += 30;
      };

      //Bonus
      if(Option.isSome(qfScorerMatch) and Option.isSome(qfAssisterMatch)){
        totalScore += 120;
      };

      let qfYellowCardMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.playerId == predictionQFYellowCard;
        },
      );
      if (Option.isSome(qfYellowCardMatch)) {
        totalScore += 15;
      };

      let qfRedCardMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.playerId == predictionQFRedCard;
        },
      );
      if (Option.isSome(qfRedCardMatch)) {
        totalScore += 30;
      };

      //Bonus
      if(Option.isSome(qfYellowCardMatch) and Option.isSome(qfRedCardMatch)){
        totalScore += 90;
      };


      //SF
      let predictionSFWinner = entry.sfPrediction.winner;
      let predictionSFLoser = entry.sfPrediction.loser;
      let predictionSFScorer = entry.sfPrediction.goalScorer;
      let predictionSFAssister = entry.sfPrediction.goalAssister;
      let predictionSFYellowCard = entry.sfPrediction.yellowCard;
      let predictionSFRedCard = entry.sfPrediction.redCard;

      let sfWinnerMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.teamId == predictionSFWinner;
        },
      );
      if (Option.isSome(sfWinnerMatch)) {
        totalScore += 20;
      };

      let sfLoserMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.teamId == predictionSFLoser;
        },
      );
      if (Option.isSome(sfLoserMatch)) {
        totalScore += 20;
      };

      //Bonus
      if(Option.isSome(sfWinnerMatch) and Option.isSome(sfLoserMatch)){
        totalScore += 80;
      };

      let sfScorerMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.playerId == predictionSFScorer;
        },
      );
      if (Option.isSome(sfScorerMatch)) {
        totalScore += 40;
      };

      let sfAssisterMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.playerId == predictionSFAssister;
        },
      );
      if (Option.isSome(sfAssisterMatch)) {
        totalScore += 40;
      };

      //Bonus
      if(Option.isSome(sfScorerMatch) and Option.isSome(sfAssisterMatch)){
        totalScore += 160;
      };

      let sfYellowCardMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.playerId == predictionSFYellowCard;
        },
      );
      if (Option.isSome(sfYellowCardMatch)) {
        totalScore += 20;
      };

      let sfRedCardMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.playerId == predictionSFRedCard;
        },
      );
      if (Option.isSome(sfRedCardMatch)) {
        totalScore += 40;
      };

      //Bonus
      if(Option.isSome(sfYellowCardMatch) and Option.isSome(sfRedCardMatch)){
        totalScore += 120;
      };

      //F
      let predictionFinalWinner = entry.fPrediction.winner;
      let predictionFinalLoser = entry.fPrediction.loser;
      let predictionFinalScorer = entry.fPrediction.goalScorer;
      let predictionFinalAssister = entry.fPrediction.goalAssister;
      let predictionFinalYellowCard = entry.fPrediction.yellowCard;
      let predictionFinalRedCard = entry.fPrediction.redCard;

      let fWinnerMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.teamId == predictionFinalWinner;
        },
      );
      if (Option.isSome(fWinnerMatch)) {
        totalScore += 25;
      };

      let fLoserMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.teamId == predictionFinalLoser;
        },
      );
      if (Option.isSome(fLoserMatch)) {
        totalScore += 25;
      };

      //Bonus
      if(Option.isSome(fWinnerMatch) and Option.isSome(fLoserMatch)){
        totalScore += 100;
      };

      let fScorerMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.playerId == predictionFinalScorer;
        },
      );
      if (Option.isSome(fScorerMatch)) {
        totalScore += 50;
      };

      let fAssisterMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.playerId == predictionFinalAssister;
        },
      );
      if (Option.isSome(fAssisterMatch)) {
        totalScore += 50;
      };

      //Bonus
      if(Option.isSome(fScorerMatch) and Option.isSome(fAssisterMatch)){
        totalScore += 200;
      };

      let fYellowCardMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.playerId == predictionFinalYellowCard;
        },
      );
      if (Option.isSome(fYellowCardMatch)) {
        totalScore += 25;
      };

      let fRedCardMatch = Array.find<T.Euro2024Event>(
        events,
        func(event : T.Euro2024Event) : Bool {
          return event.playerId == predictionFinalRedCard;
        },
      );
      if (Option.isSome(fRedCardMatch)) {
        totalScore += 50;
      };

      //Bonus
      if(Option.isSome(fYellowCardMatch) and Option.isSome(fRedCardMatch)){
        totalScore += 150;
      };

        
      return totalScore;
    };

    public func adminDelete2024Entry(principalId: T.PrincipalName) : Bool {
      userPredictions.delete(principalId);
      return true;
    };

    public func adminGetEuro2024Entries(limit: Nat, offset: Nat) : [DTOs.Euro2024PredictionDTO] {
      
      let entries = Array.map<(T.PrincipalName, T.Euro2024Prediction), DTOs.Euro2024PredictionDTO>(
        Iter.toArray(userPredictions.entries()),
        func(prediction : (T.PrincipalName, T.Euro2024Prediction)) : DTOs.Euro2024PredictionDTO {
          return {
            alreadyEntered = true;
            groupAPrediction = prediction.1.groupAPrediction;
            groupBPrediction = prediction.1.groupBPrediction;
            groupCPrediction  = prediction.1.groupCPrediction;
            groupDPrediction  = prediction.1.groupDPrediction;
            groupEPrediction = prediction.1.groupEPrediction;
            groupFPrediction = prediction.1.groupFPrediction;
            r16Prediction  = prediction.1.r16Prediction;
            qfPrediction  = prediction.1.qfPrediction;
            sfPrediction = prediction.1.sfPrediction;
            fPrediction  = prediction.1.fPrediction;
            principalId  = prediction.1.principalId;
            entryTime = prediction.1.entryTime;
            totalScore  = prediction.1.totalScore;
          };
        }
      );

      let droppedEntries = List.drop<DTOs.Euro2024PredictionDTO>(List.fromArray(entries), offset);
      let paginatedEntries = List.take<DTOs.Euro2024PredictionDTO>(droppedEntries, limit);
      return List.toArray(paginatedEntries);
    };

    public func addEuro2024Event(euroEvent: T.Euro2024Event) :  async Result.Result<(), T.Error> {
      let eventBuffer = Buffer.fromArray<T.Euro2024Event>(events);
      eventBuffer.add(euroEvent);
      events := Buffer.toArray(eventBuffer);
      calculateLeaderboard();
      return #ok();
    };

  };
};
