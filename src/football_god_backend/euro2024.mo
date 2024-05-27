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
import DTOs "DTOs";

import Euro2024Teams "./data/euro2024_teams";

module {

  public class Euro2024() {

    private var teams : List.List<T.InternationalTeam> = List.fromArray(Euro2024Teams.Euro2024Teams().teams);

    private var userPredictions = Map.HashMap<T.PrincipalName, T.Euro2024Prediction>(0, Text.equal, Text.hash);

    //TODO: ADD TO STABLE STORAGE
    private var events: [T.Euro2024Event] = [];

    private var state: T.Euro2024State = {
      prizePool = 0;
      totalManagers = 0;
      stage = #Selecting;
    };

    public func getState() : T.Euro2024State {
      return state;
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
        totalManagers = state.totalManagers;
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
      //TODO: Calculate the leaderboard based on the events that have been submitted
        //redo a calculation for all events
      
      //calculation assumes that it is being run after each game is finished therefore the points that have been awarded are final

    };

  };
};
