import Types "types";
import Result "mo:base/Result";
import Map "mo:base/HashMap";
import Text "mo:base/Text";
import List "mo:base/List";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Int "mo:base/Int";
import Nat64 "mo:base/Nat64";
import DTOs "DTOs";

module {

  public class Euro2024() {

    private var userPredictions = Map.HashMap<Types.PrincipalName, Types.Euro2024Prediction>(0, Text.equal, Text.hash);

    public func setData(stable_predictions : [(Types.PrincipalName, Types.Euro2024Prediction)]) {
      userPredictions := Map.fromIter<Types.PrincipalName, Types.Euro2024Prediction>(
        stable_predictions.vals(),
        stable_predictions.size(),
        Text.equal,
        Text.hash,
      );
    };

    public func getPredictions(principalName : Text) : ?Types.Euro2024Prediction {
      return userPredictions.get(principalName);
    };

    public func checkSweepstakePaid(principalName : Text) : Bool {
      let userPrediction = userPredictions.get(principalName);

      switch userPrediction {
        case (null) { return false };
        case (?prediction) {
          return prediction.sweepstakePaid 
        };
      };
    };

    public func submitPredictions(principalName : Text, predictions : DTOs.Euro2024PredictionDTO, sweepstakeEntered: Bool) : Result.Result<(), Types.Error> {

      userPredictions.put(principalName, {
        sweepstakePaid = sweepstakeEntered;
        groupAWinnerTeamId = predictions.groupAWinnerTeamId;
        groupALoserTeamId = predictions.groupALoserTeamId;
        groupAGoalscorer = predictions.groupAGoalscorer;
        groupAGoalAssister = predictions.groupAGoalAssister;
        groupAYellowCard = predictions.groupAYellowCard;
        groupARedCard = predictions.groupARedCard;

        groupBWinnerTeamId = predictions.groupBWinnerTeamId;
        groupBLoserTeamId = predictions.groupBLoserTeamId;
        groupBGoalscorer = predictions.groupBGoalscorer;
        groupBGoalAssister = predictions.groupBGoalAssister;
        groupBYellowCard = predictions.groupBYellowCard;
        groupBRedCard = predictions.groupBRedCard;

        groupCWinnerTeamId = predictions.groupCWinnerTeamId;
        groupCLoserTeamId = predictions.groupCLoserTeamId;
        groupCGoalscorer = predictions.groupCGoalscorer;
        groupCGoalAssister = predictions.groupCGoalAssister;
        groupCYellowCard = predictions.groupCYellowCard;
        groupCRedCard = predictions.groupCRedCard;

        groupDWinnerTeamId = predictions.groupDWinnerTeamId;
        groupDLoserTeamId = predictions.groupDLoserTeamId;
        groupDGoalscorer = predictions.groupDGoalscorer;
        groupDGoalAssister = predictions.groupDGoalAssister;
        groupDYellowCard = predictions.groupDYellowCard;
        groupDRedCard = predictions.groupDRedCard;

        groupEWinnerTeamId = predictions.groupEWinnerTeamId;
        groupELoserTeamId = predictions.groupELoserTeamId;
        groupEGoalscorer = predictions.groupEGoalscorer;
        groupEGoalAssister = predictions.groupEGoalAssister;
        groupEYellowCard = predictions.groupEYellowCard;
        groupERedCard = predictions.groupERedCard;

        groupFWinnerTeamId = predictions.groupFWinnerTeamId;
        groupFLoserTeamId = predictions.groupFLoserTeamId;
        groupFGoalscorer = predictions.groupFGoalscorer;
        groupFGoalAssister = predictions.groupFGoalAssister;
        groupFYellowCard = predictions.groupFYellowCard;
        groupFRedCard = predictions.groupFRedCard;

        roundOf16Winner = predictions.roundOf16Winner;
        roundOf16Loser = predictions.roundOf16Loser;
        roundOf16Goalscorer = predictions.roundOf16Goalscorer;
        roundOf16GoalAssister = predictions.roundOf16GoalAssister;
        roundOf16YellowCard = predictions.roundOf16YellowCard;
        roundOf16RedCard = predictions.roundOf16RedCard;

        quarterFinalWinner = predictions.quarterFinalWinner;
        quarterFinalLoser = predictions.quarterFinalLoser;
        quarterFinalGoalscorer = predictions.quarterFinalGoalscorer;
        quarterFinalGoalAssister = predictions.quarterFinalGoalAssister;
        quarterFinalYellowCard = predictions.quarterFinalYellowCard;
        quarterFinalRedCard = predictions.quarterFinalRedCard;

        semiFinalWinner = predictions.semiFinalWinner;
        semiFinalLoser = predictions.semiFinalLoser;
        semiFinalGoalscorer = predictions.semiFinalGoalscorer;
        semiFinalGoalAssister = predictions.semiFinalGoalAssister;
        semiFinalYellowCard = predictions.semiFinalYellowCard;
        semiFinalRedCard = predictions.semiFinalRedCard;

        finalWinner = predictions.finalWinner;
        finalLoser = predictions.finalLoser;
        finalGoalscorer = predictions.finalGoalscorer;
        finalGoalAssister = predictions.finalGoalAssister;
        finalYellowCard = predictions.finalYellowCard;
        finalRedCard = predictions.finalRedCard;
        totalScore = 0;
        winnings = 0;
      });

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
        Array.map<(Types.PrincipalName, Types.Euro2024Prediction), DTOs.Euro2024LeaderboardEntryDTO>(
          Iter.toArray(userPredictions.entries()),
          func((principal, userPrediction) : (Types.PrincipalName, Types.Euro2024Prediction)) : DTOs.Euro2024LeaderboardEntryDTO {
            let dto: DTOs.Euro2024LeaderboardEntryDTO = {
              position = "";
              principalName = principal;
              displayName = principal;
              totalScore = userPrediction.totalScore;
              enteredSweepstake = userPrediction.sweepstakePaid;
              winnings = userPrediction.winnings;
            };
            return dto;
          },
        )
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

    public func getUserPredictions() : [(Types.PrincipalName, Types.Euro2024Prediction)] {
      return Iter.toArray(userPredictions.entries());
    };

    public func countWinners() : Nat {
      let leaderboardDTO = getLeaderboardDTO(0, Iter.size(userPredictions.entries()));
      let highestCorrectScores = List.foldLeft<DTOs.Euro2024LeaderboardEntryDTO, Nat16>(
        List.fromArray(leaderboardDTO.leaderboardEntries),
        0,
        func(highest : Nat16, entry : DTOs.Euro2024LeaderboardEntryDTO) : Nat16 {
          if (entry.totalScore > highest) {
            return entry.totalScore;
          } else {
            return highest;
          };
        },
      );

      let winnerCount = List.foldLeft<DTOs.Euro2024LeaderboardEntryDTO, Nat>(
        List.fromArray(leaderboardDTO.leaderboardEntries),
        0,
        func(count : Nat, entry : DTOs.Euro2024LeaderboardEntryDTO) : Nat {
          if ((entry.totalScore == highestCorrectScores and entry.enteredSweepstake)) {
            return count + 1;
          } else {
            return count;
          };
        },
      );

      return winnerCount;
    };

    public func getWinnerPrincipalIds() : [Types.PrincipalName] {
      let leaderboardEntries = List.fromArray(
        Array.map<(Types.PrincipalName, Types.Euro2024Prediction), DTOs.Euro2024LeaderboardEntryDTO>(
          Iter.toArray(userPredictions.entries()),
          func((principal, userPrediction) : (Types.PrincipalName, Types.Euro2024Prediction)) : DTOs.Euro2024LeaderboardEntryDTO {
            let dto: DTOs.Euro2024LeaderboardEntryDTO = {
              position = "";
              principalName = principal;
              displayName = principal;
              totalScore = userPrediction.totalScore;
              enteredSweepstake = userPrediction.sweepstakePaid;
              winnings = userPrediction.winnings;
            };
            return dto;
          },
        )
      );
      
      let highestCorrectScore = List.foldLeft<DTOs.Euro2024LeaderboardEntryDTO, Nat16>(
        leaderboardEntries,
        0,
        func(highest : Nat16, entry : DTOs.Euro2024LeaderboardEntryDTO) : Nat16 {
          if (entry.totalScore > highest) {
            return entry.totalScore;
          } else {
            return highest;
          };
        },
      );

      let winners = List.filter<DTOs.Euro2024LeaderboardEntryDTO>(
        leaderboardEntries,
        func(entry : DTOs.Euro2024LeaderboardEntryDTO) : Bool {
          return (entry.totalScore == highestCorrectScore and entry.enteredSweepstake);
        },
      );

      let winnerPrincipalIds = List.map<DTOs.Euro2024LeaderboardEntryDTO, Types.PrincipalName>(
        winners,
        func(entry : DTOs.Euro2024LeaderboardEntryDTO) : Types.PrincipalName {
          return entry.principalName;
        },
      );

      return List.toArray<Types.PrincipalName>(winnerPrincipalIds);
    };

    public func updateWinnings(principalName : Text, winnings : Nat64) : () {
      let userPrediction = userPredictions.get(principalName);

      switch userPrediction {
        case (null) {};
        case (?prediction) {
          
          let updatedPrediction: Types.Euro2024Prediction = {

            sweepstakePaid = prediction.sweepstakePaid;
            totalScore = prediction.totalScore;
            winnings = winnings;
            groupAWinnerTeamId = prediction.groupAWinnerTeamId;
            groupALoserTeamId = prediction.groupALoserTeamId;
            groupAGoalscorer = prediction.groupAGoalscorer;
            groupAGoalAssister = prediction.groupAGoalAssister;
            groupAYellowCard = prediction.groupAYellowCard;
            groupARedCard = prediction.groupARedCard;

            groupBWinnerTeamId = prediction.groupBWinnerTeamId;
            groupBLoserTeamId = prediction.groupBLoserTeamId;
            groupBGoalscorer = prediction.groupBGoalscorer;
            groupBGoalAssister = prediction.groupBGoalAssister;
            groupBYellowCard = prediction.groupBYellowCard;
            groupBRedCard = prediction.groupBRedCard;

            groupCWinnerTeamId = prediction.groupCWinnerTeamId;
            groupCLoserTeamId = prediction.groupCLoserTeamId;
            groupCGoalscorer = prediction.groupCGoalscorer;
            groupCGoalAssister = prediction.groupCGoalAssister;
            groupCYellowCard = prediction.groupCYellowCard;
            groupCRedCard = prediction.groupCRedCard;

            groupDWinnerTeamId = prediction.groupDWinnerTeamId;
            groupDLoserTeamId = prediction.groupDLoserTeamId;
            groupDGoalscorer = prediction.groupDGoalscorer;
            groupDGoalAssister = prediction.groupDGoalAssister;
            groupDYellowCard = prediction.groupDYellowCard;
            groupDRedCard = prediction.groupDRedCard;

            groupEWinnerTeamId = prediction.groupEWinnerTeamId;
            groupELoserTeamId = prediction.groupELoserTeamId;
            groupEGoalscorer = prediction.groupEGoalscorer;
            groupEGoalAssister = prediction.groupEGoalAssister;
            groupEYellowCard = prediction.groupEYellowCard;
            groupERedCard = prediction.groupERedCard;

            groupFWinnerTeamId = prediction.groupFWinnerTeamId;
            groupFLoserTeamId = prediction.groupFLoserTeamId;
            groupFGoalscorer = prediction.groupFGoalscorer;
            groupFGoalAssister = prediction.groupFGoalAssister;
            groupFYellowCard = prediction.groupFYellowCard;
            groupFRedCard = prediction.groupFRedCard;

            roundOf16Winner = prediction.roundOf16Winner;
            roundOf16Loser = prediction.roundOf16Loser;
            roundOf16Goalscorer = prediction.roundOf16Goalscorer;
            roundOf16GoalAssister = prediction.roundOf16GoalAssister;
            roundOf16YellowCard = prediction.roundOf16YellowCard;
            roundOf16RedCard = prediction.roundOf16RedCard;

            quarterFinalWinner = prediction.quarterFinalWinner;
            quarterFinalLoser = prediction.quarterFinalLoser;
            quarterFinalGoalscorer = prediction.quarterFinalGoalscorer;
            quarterFinalGoalAssister = prediction.quarterFinalGoalAssister;
            quarterFinalYellowCard = prediction.quarterFinalYellowCard;
            quarterFinalRedCard = prediction.quarterFinalRedCard;

            semiFinalWinner = prediction.semiFinalWinner;
            semiFinalLoser = prediction.semiFinalLoser;
            semiFinalGoalscorer = prediction.semiFinalGoalscorer;
            semiFinalGoalAssister = prediction.semiFinalGoalAssister;
            semiFinalYellowCard = prediction.semiFinalYellowCard;
            semiFinalRedCard = prediction.semiFinalRedCard;

            finalWinner = prediction.finalWinner;
            finalLoser = prediction.finalLoser;
            finalGoalscorer = prediction.finalGoalscorer;
            finalGoalAssister = prediction.finalGoalAssister;
            finalYellowCard = prediction.finalYellowCard;
            finalRedCard = prediction.finalRedCard;
          };
          
          userPredictions.put(principalName, updatedPrediction);

        };
      };
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
      
      //TODO
      //make sure all the teams are valid international teams
      //make sure all the players are valid international players
      
      
      return true;
    };

  };
};
