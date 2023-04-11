import Types "types";
import Result "mo:base/Result";
import Map "mo:base/HashMap";
import Text "mo:base/Text";
import List "mo:base/List";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Nat8 "mo:base/Nat8";
import Nat32 "mo:base/Nat32";
import Nat64 "mo:base/Nat64";
import Debug "mo:base/Debug";

module {
    
  public class Predictions(){
   
    private var userPredictions = Map.HashMap<Types.PrincipalName, List.List<Types.UserGameweek>>(0, Text.equal, Text.hash);

    public func setData(stable_predictions: [(Types.PrincipalName, List.List<Types.UserGameweek>)]){
      userPredictions := Map.fromIter<Types.PrincipalName, List.List<Types.UserGameweek>>(
            stable_predictions.vals(), stable_predictions.size(), Text.equal, Text.hash);
    };

    public func getUserPredictions() : [(Types.PrincipalName, List.List<Types.UserGameweek>)] {
      return Iter.toArray(userPredictions.entries());
    };
   
    public func submitPredictions(principalName: Text, seasonId: Nat16, gameweekNumber: Nat8, predictions: [Types.Prediction]) : Result.Result<(), Types.Error> {
        
        let userGameweek: Types.UserGameweek = {
          seasonId = seasonId;
          gameweekNumber = gameweekNumber;
          predictions = List.fromArray<Types.Prediction>(predictions);
          enteredSweepstake = false;
          correctScores = 0;
          predictionCount = Nat8.fromNat(Array.size<Types.Prediction>(predictions));
          winnings = 0;
        }; 

        let updatedUserGameweeks = switch (userPredictions.get(principalName)) {  
            case (null) { List.push<Types.UserGameweek>(userGameweek, List.nil<Types.UserGameweek>()) };
            case (?userGameweeks) {
              let alreadyExists = List.some(userGameweeks, func (ugw: Types.UserGameweek) : Bool {
                return ugw.seasonId == seasonId and ugw.gameweekNumber == gameweekNumber;
              });

              if (alreadyExists) {
                List.map<Types.UserGameweek, Types.UserGameweek>(userGameweeks, func (ugw: Types.UserGameweek) : Types.UserGameweek {
                  if (ugw.seasonId == seasonId and ugw.gameweekNumber == gameweekNumber) {
                    let updatedUserGameweek = {
                      seasonId = userGameweek.seasonId;
                      gameweekNumber = userGameweek.gameweekNumber;
                      predictions = userGameweek.predictions;
                      enteredSweepstake = ugw.enteredSweepstake;
                      correctScores = userGameweek.correctScores;
                      predictionCount = userGameweek.predictionCount;
                      winnings = userGameweek.winnings;
                    };
                    return updatedUserGameweek;
                  } else {
                    return ugw;
                  };
                });
              } else {
                List.push<Types.UserGameweek>(userGameweek, userGameweeks);
              }
            };
        };

        userPredictions.put(principalName, updatedUserGameweeks);

        return #ok(());
    };

    public func getPredictions(principalName: Text, seasonId: Nat16, gameweekNumber: Nat8) : [Types.Prediction] {
      let userGameweeks = userPredictions.get(principalName);

      switch userGameweeks {
        case (null) { return []; };
        case (?gameweeks) {
          let gameweek = List.find<Types.UserGameweek>(gameweeks, func (ugw: Types.UserGameweek) : Bool {
            return ugw.seasonId == seasonId and ugw.gameweekNumber == gameweekNumber;
          });

          switch gameweek {
            case (null) { return []; };
            case (?gw) { return List.toArray<Types.Prediction>(gw.predictions); };
          };
        };
      };
    };

    public func checkSweepstakePaid(principalName: Text, seasonId: Nat16, gameweekNumber: Nat8) : Bool {
      let userGameweeks = userPredictions.get(principalName);

      switch userGameweeks {
        case (null) { return false; };
        case (?gameweeks) {
          let gameweek = List.find<Types.UserGameweek>(gameweeks, func (ugw: Types.UserGameweek) : Bool {
            return ugw.seasonId == seasonId and ugw.gameweekNumber == gameweekNumber;
          });

          switch gameweek {
            case (null) { return false; };
            case (?gw) { return gw.enteredSweepstake; };
          };
        };
      };
    };

    public func enterSweepstake(principalName: Text, seasonId: Nat16, gameweekNumber: Nat8) : Result.Result<(), Types.Error> {
      let userGameweeks = userPredictions.get(principalName);

      switch userGameweeks {
        case (null) { return #err(#NotFound); };
        case (?gameweeks) {
          let updatedUserGameweeks = List.map<Types.UserGameweek, Types.UserGameweek>(gameweeks, func (ugw: Types.UserGameweek) : Types.UserGameweek {
            if (ugw.seasonId == seasonId and ugw.gameweekNumber == gameweekNumber) {
              return {
                seasonId = ugw.seasonId;
                gameweekNumber = ugw.gameweekNumber;
                predictions = ugw.predictions;
                enteredSweepstake = true;
                correctScores = ugw.correctScores;
                predictionCount = ugw.predictionCount;
                winnings = ugw.winnings;
              };
            } else {
              return ugw;
            };
          });

          userPredictions.put(principalName, updatedUserGameweeks);

          return #ok(());
        };
      };
    };
    
    public func getUserHistory(principalName: Text, seasonId: Nat16) : [Types.UserGameweek] {
      let userHistory = userPredictions.get(principalName);

      switch userHistory {
          case (null) { return []; };
          case (?gameweeks) {
            let filteredGameweeks = List.filter<Types.UserGameweek>(gameweeks, func (ugw: Types.UserGameweek) : Bool {
              return ugw.seasonId == seasonId;
            });
            return List.toArray(filteredGameweeks);
          };
        };
    };

    
    public func getLeaderboard(seasonId: Nat16, gameweekNumber: Nat8, start: Nat, count: Nat) : Types.Leaderboard {


        func compare(leaderboardEntry1: Types.LeaderboardEntry, leaderboardEntry2: Types.LeaderboardEntry) : Bool {
            return leaderboardEntry1.correctScores >= leaderboardEntry2.correctScores;
        };

        func mergeSort(entries: List.List<Types.LeaderboardEntry>) : List.List<Types.LeaderboardEntry> {
            let len = List.size(entries);
           
            if (len <= 1) {
                return entries;
            } else {
                let (firstHalf, secondHalf) = List.split(len / 2, entries);
                return List.merge(mergeSort(firstHalf), mergeSort(secondHalf), compare);
            };
        };

        let leaderboardEntries = Array.map< (Types.PrincipalName, List.List<Types.UserGameweek>), List.List<Types.LeaderboardEntry>>(Iter.toArray(userPredictions.entries()), func ((principal, userGameweeks): (Types.PrincipalName, List.List<Types.UserGameweek>)) : List.List<Types.LeaderboardEntry> {
            let filteredGameweeks = List.filter(userGameweeks, func (ugw: Types.UserGameweek) : Bool {
                return ugw.seasonId == seasonId and ugw.gameweekNumber == gameweekNumber and ugw.enteredSweepstake;
            });
            
            return List.map<Types.UserGameweek, Types.LeaderboardEntry>(filteredGameweeks, func (ugw: Types.UserGameweek) : Types.LeaderboardEntry {
                return {
                    principalName = principal;
                    displayName = principal;
                    correctScores = ugw.correctScores;
                    predictionCount = ugw.predictionCount;
                    enteredSweepstake = ugw.enteredSweepstake;
                };
            });
        });


        let flattenedLeaderboardEntries = List.flatten<Types.LeaderboardEntry>(List.fromArray(leaderboardEntries));
        let sortedLeaderboardEntries = mergeSort(flattenedLeaderboardEntries);
        
        var totalEntries: Nat = List.size(sortedLeaderboardEntries);
        let paginatedLeaderboardEntries = List.take(List.drop(sortedLeaderboardEntries, start), count);

        let leaderboard: Types.Leaderboard = {
          entries = List.toArray<Types.LeaderboardEntry>(paginatedLeaderboardEntries);
          totalEntries = Nat32.fromNat(totalEntries);
        };
        
        return leaderboard;
    };


    public func countWinners(seasonId: Nat16, gameweekNumber: Nat8) : Nat {
      let leaderboardEntries = Array.map< (Types.PrincipalName, List.List<Types.UserGameweek>), List.List<Types.LeaderboardEntry>>(Iter.toArray(userPredictions.entries()), func ((principal, userGameweeks): (Types.PrincipalName, List.List<Types.UserGameweek>)) : List.List<Types.LeaderboardEntry> {
          let filteredGameweeks = List.filter(userGameweeks, func (ugw: Types.UserGameweek) : Bool {
              return ugw.seasonId == seasonId and ugw.gameweekNumber == gameweekNumber;
          });

          return List.map<Types.UserGameweek, Types.LeaderboardEntry>(filteredGameweeks, func (ugw: Types.UserGameweek) : Types.LeaderboardEntry {
              return {
                  principalName = principal;
                  displayName = principal;
                  correctScores = ugw.correctScores;
                  predictionCount = ugw.predictionCount;
                  enteredSweepstake = ugw.enteredSweepstake;
              };
          });
      });

      let flattenedLeaderboardEntries = List.flatten<Types.LeaderboardEntry>(List.fromArray(leaderboardEntries));

      let highestCorrectScores = List.foldLeft<Types.LeaderboardEntry, Nat8>(flattenedLeaderboardEntries, 0, func (highest: Nat8, entry: Types.LeaderboardEntry) : Nat8 {
          if (entry.correctScores > highest) {
              return entry.correctScores;
          } else {
              return highest;
          };
      });

      let winnerCount = List.foldLeft<Types.LeaderboardEntry, Nat>(flattenedLeaderboardEntries, 0, func (count: Nat, entry: Types.LeaderboardEntry) : Nat {
          let perfectScore = entry.correctScores == entry.predictionCount and entry.predictionCount > 0;
          if ((entry.correctScores == highestCorrectScores and entry.enteredSweepstake) or (perfectScore and not entry.enteredSweepstake)) {
              return count + 1;
          } else {
              return count;
          };
      });

      return winnerCount;
    };

    public func getWinnerPrincipalIds(seasonId: Nat16, gameweekNumber: Nat8) : [Types.PrincipalName] {
      let leaderboardEntries = Array.map<(Types.PrincipalName, List.List<Types.UserGameweek>), List.List<Types.LeaderboardEntry>>(Iter.toArray(userPredictions.entries()), func ((principal, userGameweeks): (Types.PrincipalName, List.List<Types.UserGameweek>)) : List.List<Types.LeaderboardEntry> {
          let filteredGameweeks = List.filter(userGameweeks, func (ugw: Types.UserGameweek) : Bool {
              return ugw.seasonId == seasonId and ugw.gameweekNumber == gameweekNumber;
          });

          return List.map<Types.UserGameweek, Types.LeaderboardEntry>(filteredGameweeks, func (ugw: Types.UserGameweek) : Types.LeaderboardEntry {
              return {
                  principalName = principal;
                  displayName = principal;
                  correctScores = ugw.correctScores;
                  predictionCount = ugw.predictionCount;
                  enteredSweepstake = ugw.enteredSweepstake;
              };
          });
      });

      let flattenedLeaderboardEntries = List.flatten<Types.LeaderboardEntry>(List.fromArray(leaderboardEntries));

      let highestCorrectScores = List.foldLeft<Types.LeaderboardEntry, Nat8>(flattenedLeaderboardEntries, 0, func (highest: Nat8, entry: Types.LeaderboardEntry) : Nat8 {
          if (entry.correctScores > highest) {
              return entry.correctScores;
          } else {
              return highest;
          };
      });

      let winners = List.filter<Types.LeaderboardEntry>(flattenedLeaderboardEntries, func (entry: Types.LeaderboardEntry) : Bool {
          let perfectScore = entry.correctScores == entry.predictionCount and entry.predictionCount > 0;
          return (entry.correctScores == highestCorrectScores and entry.enteredSweepstake) or (perfectScore and not entry.enteredSweepstake);
      });

      let winnerPrincipalIds = List.map<Types.LeaderboardEntry, Types.PrincipalName>(winners, func (entry: Types.LeaderboardEntry) : Types.PrincipalName {
          return entry.principalName;
      });

      return List.toArray<Types.PrincipalName>(winnerPrincipalIds);
    };


    public func deleteFixture(seasonId: Nat16, gameweekNumber: Nat8, fixtures: [Types.Fixture], fixtureId: Nat32) : Result.Result<(), Types.Error> {
      
      // Iterate through all users
      for ((principalName, userGameweeks) in userPredictions.entries()) {
        // Update user gameweeks by removing the given fixtureId from predictions
        let updatedUserGameweeks = List.map<Types.UserGameweek, Types.UserGameweek>(userGameweeks, func (ugw: Types.UserGameweek) : Types.UserGameweek {
          if (ugw.seasonId == seasonId and ugw.gameweekNumber == gameweekNumber) {
            // Remove the prediction with the given fixtureId
            let updatedPredictions = List.filter<Types.Prediction>(ugw.predictions, func (prediction: Types.Prediction) : Bool {
              return prediction.fixtureId != fixtureId;
            });

            return {
              seasonId = ugw.seasonId;
              gameweekNumber = ugw.gameweekNumber;
              predictions = updatedPredictions;
              enteredSweepstake = ugw.enteredSweepstake;
              correctScores = ugw.correctScores;
              predictionCount = ugw.predictionCount;
              winnings = ugw.winnings;
            };
          } else {
            return ugw;
          };
        });

        // Update the user's gameweeks in userPredictions
        userPredictions.put(principalName, updatedUserGameweeks);
      };

      // Call updatePredictionsCount
      return updatePredictionsCount(seasonId, gameweekNumber, fixtures);
    };


    public func updatePredictionsCount(seasonId: Nat16, gameweekNumber: Nat8, fixtures: [Types.Fixture]) : Result.Result<(), Types.Error> {
      
      // Iterate through all users
      for ((principalName, userGameweeks) in userPredictions.entries()) {

        // Find the user's gameweek for the given season and gameweek number
        let gameweek = List.find<Types.UserGameweek>(userGameweeks, func (ugw: Types.UserGameweek) : Bool {
          return ugw.seasonId == seasonId and ugw.gameweekNumber == gameweekNumber;
        });

        // If the user has a gameweek, update the predictionCount and correctScores
        switch gameweek {
          case (null) { }; // Do nothing if the user has no gameweek
          case (?gw) {
            // Update predictionCount
            let predictionCount = List.size<Types.Prediction>(gw.predictions);
            
            // Calculate correctScores
            let correctScores = List.foldLeft<Types.Prediction, Nat8>(gw.predictions, 0, func (count: Nat8, prediction: Types.Prediction) : Nat8 {
              let matchingFixture = List.find<Types.Fixture>(List.fromArray<Types.Fixture>(fixtures), func (fixture: Types.Fixture) : Bool {
                return fixture.id == prediction.fixtureId;
              });

              switch matchingFixture {
                case (null) { return count; };
                case (?fixture) {
                  let isCorrect = fixture.homeGoals == prediction.homeGoals and fixture.awayGoals == prediction.awayGoals;
                  if(isCorrect){
                    return count + 1;
                  };
                  return count;
                };
              };
            });

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

            let updatedUserGameweeks = List.map<Types.UserGameweek, Types.UserGameweek>(userGameweeks, func (ugw: Types.UserGameweek) : Types.UserGameweek {
              if (ugw.seasonId == seasonId and ugw.gameweekNumber == gameweekNumber) {
                return updatedUserGameweek;
              } else {
                return ugw;
              };
            });

            userPredictions.put(principalName, updatedUserGameweeks);
          };
        };
      };

      return #ok(());
    };

    public func updateWinnings(seasonId: Nat16, gameweekNumber: Nat8, principalName: Text, winnings: Nat64) : Result.Result<(), Types.Error> {
      let userGameweeks = userPredictions.get(principalName);

      switch userGameweeks {
        case (null) { return #err(#NotFound); };
        case (?gameweeks) {
          let updatedUserGameweeks = List.map<Types.UserGameweek, Types.UserGameweek>(gameweeks, func (ugw: Types.UserGameweek) : Types.UserGameweek {
            if (ugw.seasonId == seasonId and ugw.gameweekNumber == gameweekNumber) {
              return {
                seasonId = ugw.seasonId;
                gameweekNumber = ugw.gameweekNumber;
                predictions = ugw.predictions;
                enteredSweepstake = ugw.enteredSweepstake;
                correctScores = ugw.correctScores;
                predictionCount = ugw.predictionCount;
                winnings = Nat64.toNat(winnings);
              };
            } else {
              return ugw;
            };
          });

          userPredictions.put(principalName, updatedUserGameweeks);

          return #ok(());
        };
      };
    };

    public func deleteSeason(seasonId: Nat16) : Result.Result<(), Types.Error> {
      // Iterate through all users
      for ((principalName, userGameweeks) in userPredictions.entries()) {
        // Remove all gameweeks with the given seasonId
        let updatedUserGameweeks = List.filter<Types.UserGameweek>(userGameweeks, func (ugw: Types.UserGameweek) : Bool {
          return ugw.seasonId != seasonId;
        });

        // Update the user's gameweeks in userPredictions
        userPredictions.put(principalName, updatedUserGameweeks);
      };

      return #ok(());
    };



  }
}
