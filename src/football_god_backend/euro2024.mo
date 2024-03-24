import Types "types";
import Result "mo:base/Result";
import Map "mo:base/HashMap";
import Text "mo:base/Text";
import List "mo:base/List";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Int "mo:base/Int";
import Nat8 "mo:base/Nat8";
import Nat32 "mo:base/Nat32";
import Nat64 "mo:base/Nat64";
import Buffer "mo:base/Buffer";
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

    public func submitPredictions(principalName : Text, predictions : DTOs.PlayEuro2024DTO) : Result.Result<(), Types.Error> {

      userPredictions.put(principalName, {
        sweepstakePaid = predictions.sweepstakePaid;
        groupAWinnerTeamId = predictions.prediction.groupAWinnerTeamId;
        groupALoserTeamId = predictions.prediction.groupALoserTeamId;
        groupAGoalscorer = predictions.prediction.groupAGoalscorer;
        groupAGoalAssister = predictions.prediction.groupAGoalAssister;
        groupAYellowCard = predictions.prediction.groupAYellowCard;
        groupARedCard = predictions.prediction.groupARedCard;

        groupBWinnerTeamId = predictions.prediction.groupBWinnerTeamId;
        groupBLoserTeamId = predictions.prediction.groupBLoserTeamId;
        groupBGoalscorer = predictions.prediction.groupBGoalscorer;
        groupBGoalAssister = predictions.prediction.groupBGoalAssister;
        groupBYellowCard = predictions.prediction.groupBYellowCard;
        groupBRedCard = predictions.prediction.groupBRedCard;

        groupCWinnerTeamId = predictions.prediction.groupCWinnerTeamId;
        groupCLoserTeamId = predictions.prediction.groupCLoserTeamId;
        groupCGoalscorer = predictions.prediction.groupCGoalscorer;
        groupCGoalAssister = predictions.prediction.groupCGoalAssister;
        groupCYellowCard = predictions.prediction.groupCYellowCard;
        groupCRedCard = predictions.prediction.groupCRedCard;

        groupDWinnerTeamId = predictions.prediction.groupDWinnerTeamId;
        groupDLoserTeamId = predictions.prediction.groupDLoserTeamId;
        groupDGoalscorer = predictions.prediction.groupDGoalscorer;
        groupDGoalAssister = predictions.prediction.groupDGoalAssister;
        groupDYellowCard = predictions.prediction.groupDYellowCard;
        groupDRedCard = predictions.prediction.groupDRedCard;

        groupEWinnerTeamId = predictions.prediction.groupEWinnerTeamId;
        groupELoserTeamId = predictions.prediction.groupELoserTeamId;
        groupEGoalscorer = predictions.prediction.groupEGoalscorer;
        groupEGoalAssister = predictions.prediction.groupEGoalAssister;
        groupEYellowCard = predictions.prediction.groupEYellowCard;
        groupERedCard = predictions.prediction.groupERedCard;

        groupFWinnerTeamId = predictions.prediction.groupFWinnerTeamId;
        groupFLoserTeamId = predictions.prediction.groupFLoserTeamId;
        groupFGoalscorer = predictions.prediction.groupFGoalscorer;
        groupFGoalAssister = predictions.prediction.groupFGoalAssister;
        groupFYellowCard = predictions.prediction.groupFYellowCard;
        groupFRedCard = predictions.prediction.groupFRedCard;

        roundOf16Winner = predictions.prediction.roundOf16Winner;
        roundOf16Loser = predictions.prediction.roundOf16Loser;
        roundOf16Goalscorer = predictions.prediction.roundOf16Goalscorer;
        roundOf16GoalAssister = predictions.prediction.roundOf16GoalAssister;
        roundOf16YellowCard = predictions.prediction.roundOf16YellowCard;
        roundOf16RedCard = predictions.prediction.roundOf16RedCard;

        quarterFinalWinner = predictions.prediction.quarterFinalWinner;
        quarterFinalLoser = predictions.prediction.quarterFinalLoser;
        quarterFinalGoalscorer = predictions.prediction.quarterFinalGoalscorer;
        quarterFinalGoalAssister = predictions.prediction.quarterFinalGoalAssister;
        quarterFinalYellowCard = predictions.prediction.quarterFinalYellowCard;
        quarterFinalRedCard = predictions.prediction.quarterFinalRedCard;

        semiFinalWinner = predictions.prediction.semiFinalWinner;
        semiFinalLoser = predictions.prediction.semiFinalLoser;
        semiFinalGoalscorer = predictions.prediction.semiFinalGoalscorer;
        semiFinalGoalAssister = predictions.prediction.semiFinalGoalAssister;
        semiFinalYellowCard = predictions.prediction.semiFinalYellowCard;
        semiFinalRedCard = predictions.prediction.semiFinalRedCard;

        finalWinner = predictions.prediction.finalWinner;
        finalLoser = predictions.prediction.finalLoser;
        finalGoalscorer = predictions.prediction.finalGoalscorer;
        finalGoalAssister = predictions.prediction.finalGoalAssister;
        finalYellowCard = predictions.prediction.finalYellowCard;
        finalRedCard = predictions.prediction.finalRedCard;
      });

      return #ok(());
    };

    public func getLeaderboardDTO(start : Nat, count : Nat) : DTOs.LeaderBoardDTO {

      func compare(leaderboardEntry1 : DTOs.LeaderboardEntryDTO, leaderboardEntry2 : DTOs.LeaderboardEntryDTO) : Bool {
        return leaderboardEntry1.correctScores >= leaderboardEntry2.correctScores;
      };

      func mergeSort(entries : List.List<DTOs.LeaderboardEntryDTO>) : List.List<DTOs.LeaderboardEntryDTO> {
        let len = List.size(entries);

        if (len <= 1) {
          return entries;
        } else {
          let (firstHalf, secondHalf) = List.split(len / 2, entries);
          return List.merge(mergeSort(firstHalf), mergeSort(secondHalf), compare);
        };
      };

      func generatePositionText(sortedEntries : List.List<DTOs.LeaderboardEntryDTO>) : List.List<DTOs.LeaderboardEntryDTO> {
        var position = 1;
        var previousScore : ?Nat8 = null;

        func updatePosition(entry : DTOs.LeaderboardEntryDTO) : DTOs.LeaderboardEntryDTO {
          if (previousScore == null or previousScore != ?entry.correctScores) {
            previousScore := ?entry.correctScores;
            let updatedEntry = { entry with position = Int.toText(position) };
            position += 1;
            return updatedEntry;
          } else {
            return { entry with position = "-" };
          };
        };

        return List.map(sortedEntries, updatePosition);
      };

      let leaderboardEntries = Array.map<(Types.PrincipalName, Types.Euro2024Prediction), List.List<DTOs.LeaderboardEntryDTO>>(
        Iter.toArray(userPredictions.entries()),
        func((principal, userPrediction) : (Types.PrincipalName, Types.Euro2024Prediction)) : List.List<DTOs.LeaderboardEntryDTO> {
          return {
            position = "";
            principalName = principal;
            displayName = principal;
            totalScore = userPrediction.totalScore;
            enteredSweepstake = userPrediction.sweepstakePaid;
          };
        },
      );

      let flattenedLeaderboardEntries = List.flatten<DTOs.LeaderboardEntryDTO>(List.fromArray(leaderboardEntries));
      let sortedLeaderboardEntries = mergeSort(flattenedLeaderboardEntries);
      let positionedLeaderboardEntries = generatePositionText(sortedLeaderboardEntries);

      var totalEntries : Nat = List.size(positionedLeaderboardEntries);
      let paginatedLeaderboardEntries = List.take(List.drop(positionedLeaderboardEntries, start), count);

      let leaderboard : DTOs.LeaderBoardDTO = {
        leaderboardEntries = List.toArray<DTOs.LeaderboardEntryDTO>(paginatedLeaderboardEntries);
        totalEntries = Nat64.fromNat(totalEntries);
        totalPot = Nat64.fromNat(0);
        winningShare = Nat64.fromNat(0);
        status = 0;
      };

      return leaderboard;
    };

    public func getUserPredictions() : [(Types.PrincipalName, List.List<Types.UserGameweek>)] {
      return Iter.toArray(userPredictions.entries());
    };

    public func getCorrectPredictions(start : Nat, count : Nat) : DTOs.CorrectPredictionsDTO {
      let iter = userPredictions.entries();
      var correctPredictions : [DTOs.CorrectPredictionDTO] = [];

      for ((principalName, userGameweeks) in iter) {
        let gameweek = List.find<Types.UserGameweek>(
          userGameweeks,
          func(ugw : Types.UserGameweek) : Bool {
            return ugw.seasonId == seasonId and ugw.gameweekNumber == gameweekNumber;
          },
        );

        switch gameweek {
          case (null) {};
          case (?gw) {
            let isPredictionCorrect = List.some<Types.Prediction>(
              gw.predictions,
              func(prediction : Types.Prediction) : Bool {
                return prediction.fixtureId == fixture.id and prediction.homeGoals == fixture.homeGoals and prediction.awayGoals == fixture.awayGoals;
              },
            );

            if (isPredictionCorrect) {
              let buffer = Buffer.fromArray<DTOs.CorrectPredictionDTO>(correctPredictions);
              let summary : DTOs.CorrectPredictionDTO = {
                principalName = principalName;
                displayName = "";
              };
              buffer.add(summary);

              correctPredictions := Buffer.toArray(buffer);
            };
          };
        };
      };

      let predictionsList = List.fromArray(correctPredictions);
      var totalEntries : Nat = List.size(predictionsList);
      let paginatedCorrectPredictions = List.take(List.drop(predictionsList, start), count);

      let correctPredictionsSummary : DTOs.CorrectPredictionsDTO = {
        seasonName = "";
        seasonId = seasonId;
        gameweekNumber = gameweekNumber;
        homeTeamName = "";
        awayTeamName = "";
        homeTeamGoals = fixture.homeGoals;
        awayTeamGoals = fixture.awayGoals;
        predictions = List.toArray(paginatedCorrectPredictions);
        totalEntries = Nat64.fromNat(totalEntries);
      };

      return correctPredictionsSummary;
    };

    public func countWinners() : Nat {
      let leaderboardEntries = Array.map<(Types.PrincipalName, List.List<Types.UserGameweek>), List.List<DTOs.LeaderboardEntryDTO>>(
        Iter.toArray(userPredictions.entries()),
        func((principal, userGameweeks) : (Types.PrincipalName, List.List<Types.UserGameweek>)) : List.List<DTOs.LeaderboardEntryDTO> {
          let filteredGameweeks = List.filter(
            userGameweeks,
            func(ugw : Types.UserGameweek) : Bool {
              return ugw.seasonId == seasonId and ugw.gameweekNumber == gameweekNumber;
            },
          );

          return List.map<Types.UserGameweek, DTOs.LeaderboardEntryDTO>(
            filteredGameweeks,
            func(ugw : Types.UserGameweek) : DTOs.LeaderboardEntryDTO {
              return {
                position = "";
                principalName = principal;
                displayName = principal;
                correctScores = ugw.correctScores;
                totalFixtures = ugw.predictionCount;
                enteredSweepstake = ugw.enteredSweepstake;
              };
            },
          );
        },
      );

      let flattenedLeaderboardEntries = List.flatten<DTOs.LeaderboardEntryDTO>(List.fromArray(leaderboardEntries));

      let highestCorrectScores = List.foldLeft<DTOs.LeaderboardEntryDTO, Nat8>(
        flattenedLeaderboardEntries,
        0,
        func(highest : Nat8, entry : DTOs.LeaderboardEntryDTO) : Nat8 {
          if (entry.correctScores > highest) {
            return entry.correctScores;
          } else {
            return highest;
          };
        },
      );

      let winnerCount = List.foldLeft<DTOs.LeaderboardEntryDTO, Nat>(
        flattenedLeaderboardEntries,
        0,
        func(count : Nat, entry : DTOs.LeaderboardEntryDTO) : Nat {
          let perfectScore = entry.correctScores == entry.totalFixtures and entry.totalFixtures > 0;
          if ((entry.correctScores == highestCorrectScores and entry.enteredSweepstake) or (perfectScore and not entry.enteredSweepstake)) {
            return count + 1;
          } else {
            return count;
          };
        },
      );

      return winnerCount;
    };

    public func getWinnerPrincipalIds() : [Types.PrincipalName] {
      let leaderboardEntries = Array.map<(Types.PrincipalName, List.List<Types.UserGameweek>), List.List<DTOs.LeaderboardEntryDTO>>(
        Iter.toArray(userPredictions.entries()),
        func((principal, userGameweeks) : (Types.PrincipalName, List.List<Types.UserGameweek>)) : List.List<DTOs.LeaderboardEntryDTO> {
          let filteredGameweeks = List.filter(
            userGameweeks,
            func(ugw : Types.UserGameweek) : Bool {
              return ugw.seasonId == seasonId and ugw.gameweekNumber == gameweekNumber;
            },
          );

          return List.map<Types.UserGameweek, DTOs.LeaderboardEntryDTO>(
            filteredGameweeks,
            func(ugw : Types.UserGameweek) : DTOs.LeaderboardEntryDTO {
              return {
                position = "";
                principalName = principal;
                displayName = principal;
                correctScores = ugw.correctScores;
                totalFixtures = ugw.predictionCount;
                enteredSweepstake = ugw.enteredSweepstake;
              };
            },
          );
        },
      );

      let flattenedLeaderboardEntries = List.flatten<DTOs.LeaderboardEntryDTO>(List.fromArray(leaderboardEntries));

      let highestCorrectScores = List.foldLeft<DTOs.LeaderboardEntryDTO, Nat8>(
        flattenedLeaderboardEntries,
        0,
        func(highest : Nat8, entry : DTOs.LeaderboardEntryDTO) : Nat8 {
          if (entry.correctScores > highest) {
            return entry.correctScores;
          } else {
            return highest;
          };
        },
      );

      let winners = List.filter<DTOs.LeaderboardEntryDTO>(
        flattenedLeaderboardEntries,
        func(entry : DTOs.LeaderboardEntryDTO) : Bool {
          let perfectScore = entry.correctScores == entry.totalFixtures and entry.totalFixtures > 0;
          return (entry.correctScores == highestCorrectScores and entry.enteredSweepstake) or (perfectScore and not entry.enteredSweepstake);
        },
      );

      let winnerPrincipalIds = List.map<DTOs.LeaderboardEntryDTO, Types.PrincipalName>(
        winners,
        func(entry : DTOs.LeaderboardEntryDTO) : Types.PrincipalName {
          return entry.principalName;
        },
      );

      return List.toArray<Types.PrincipalName>(winnerPrincipalIds);
    };

    public func updatePredictionsCount(fixtures : [Types.Fixture]) : Result.Result<(), Types.Error> {

      // Iterate through all users
      for ((principalName, userGameweeks) in userPredictions.entries()) {

        // Find the user's gameweek for the given season and gameweek number
        let gameweek = List.find<Types.UserGameweek>(
          userGameweeks,
          func(ugw : Types.UserGameweek) : Bool {
            return ugw.seasonId == seasonId and ugw.gameweekNumber == gameweekNumber;
          },
        );

        // If the user has a gameweek, update the predictionCount and correctScores
        switch gameweek {
          case (null) {}; // Do nothing if the user has no gameweek
          case (?gw) {
            // Update predictionCount
            let predictionCount = List.size<Types.Prediction>(gw.predictions);

            // Calculate correctScores
            let correctScores = List.foldLeft<Types.Prediction, Nat8>(
              gw.predictions,
              0,
              func(count : Nat8, prediction : Types.Prediction) : Nat8 {
                let matchingFixture = List.find<Types.Fixture>(
                  List.fromArray<Types.Fixture>(fixtures),
                  func(fixture : Types.Fixture) : Bool {
                    return fixture.id == prediction.fixtureId and fixture.status > 0;
                  },
                );

                switch matchingFixture {
                  case (null) { return count };
                  case (?fixture) {
                    let isCorrect = fixture.homeGoals == prediction.homeGoals and fixture.awayGoals == prediction.awayGoals;
                    if (isCorrect) {
                      return count + 1;
                    };
                    return count;
                  };
                };
              },
            );

            // Update the user's gameweek
            let updatedUserGameweek = {
              seasonId = gw.seasonId;
              gameweekNumber = gw.gameweekNumber;
              predictions = gw.predictions;
              enteredSweepstake = gw.enteredSweepstake;
              correctScores = correctScores;
              predictionCount = Nat8.fromNat(predictionCount);
              winnings = gw.winnings;
            };

            let updatedUserGameweeks = List.map<Types.UserGameweek, Types.UserGameweek>(
              userGameweeks,
              func(ugw : Types.UserGameweek) : Types.UserGameweek {
                if (ugw.seasonId == seasonId and ugw.gameweekNumber == gameweekNumber) {
                  return updatedUserGameweek;
                } else {
                  return ugw;
                };
              },
            );

            userPredictions.put(principalName, updatedUserGameweeks);
          };
        };
      };

      return #ok(());
    };

    public func updateWinnings(principalName : Text, winnings : Nat64) : () {
      let userPrediction = userPredictions.get(principalName);

      switch userPrediction {
        case (null) {};
        case (?gameweeks) {
          let updatedUserGameweeks = List.map<Types.UserGameweek, Types.UserGameweek>(
            gameweeks,
            func(ugw : Types.UserGameweek) : Types.UserGameweek {
              if (ugw.seasonId == seasonId and ugw.gameweekNumber == gameweekNumber) {
                return {
                  seasonId = ugw.seasonId;
                  gameweekNumber = ugw.gameweekNumber;
                  predictions = ugw.predictions;
                  enteredSweepstake = ugw.enteredSweepstake;
                  correctScores = ugw.correctScores;
                  predictionCount = ugw.predictionCount;
                  winnings = winnings;
                };
              } else {
                return ugw;
              };
            },
          );

          userPredictions.put(principalName, updatedUserGameweeks);
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

  };
};
