import Types "types";
import Result "mo:base/Result";
import Map "mo:base/HashMap";
import Text "mo:base/Text";
import List "mo:base/List";
import Debug "mo:base/Debug";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Nat8 "mo:base/Nat8";

module {
    
  public class Predictions(){

    private type PrincipalName = Text;
   
    private var userPredictions = Map.HashMap<PrincipalName, List.List<Types.UserGameweek>>(0, Text.equal, Text.hash);
   
     public func submitPredictions(principalName: Text, seasonId: Nat16, gameweekNumber: Nat8, predictions: [Types.Prediction]) : Result.Result<(), Types.Error> {
        
        let userGameweek: Types.UserGameweek = {
          seasonId = seasonId;
          gameweekNumber = gameweekNumber;
          predictions = List.fromArray<Types.Prediction>(predictions);
          enteredSweepstake = false;
          correctScores = 0;
          predictionCount = 0;
          winnings = 0;
        }; 

        let existingUserGameweeks = userPredictions.get(principalName);
        let updatedUserGameweeks = switch existingUserGameweeks {
          case (null) { List.push<Types.UserGameweek>(userGameweek, List.nil<Types.UserGameweek>()) };
          case (?userGameweeks) {
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
            return List.toArray(gameweeks);
          };
        };
    };

    
    public func getLeaderboard(seasonId: Nat16, gameweekNumber: Nat8, start: Nat, count: Nat) : [Types.LeaderboardEntry] {
      
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

        let leaderboardEntries = Array.map< (PrincipalName, List.List<Types.UserGameweek>), List.List<Types.LeaderboardEntry>>(Iter.toArray(userPredictions.entries()), func ((principal, userGameweeks): (PrincipalName, List.List<Types.UserGameweek>)) : List.List<Types.LeaderboardEntry> {
            let filteredGameweeks = List.filter(userGameweeks, func (ugw: Types.UserGameweek) : Bool {
                return ugw.seasonId == seasonId and ugw.gameweekNumber == gameweekNumber;
            });
            
            return List.map<Types.UserGameweek, Types.LeaderboardEntry>(filteredGameweeks, func (ugw: Types.UserGameweek) : Types.LeaderboardEntry {
                return {
                    principalName = principal;
                    correctScores = ugw.correctScores;
                    predictionCount = ugw.predictionCount;
                };
            });
        });


        let flattenedLeaderboardEntries = List.flatten<Types.LeaderboardEntry>(List.fromArray(leaderboardEntries));
        let sortedLeaderboardEntries = mergeSort(flattenedLeaderboardEntries);
        let paginatedLeaderboardEntries = List.take(List.drop(sortedLeaderboardEntries, start), count);

        return List.toArray<Types.LeaderboardEntry>(paginatedLeaderboardEntries);
    };


    public func countWinners(seasonId: Nat16, gameweekNumber: Nat8) : Nat {
        let leaderboardEntries = Array.map< (PrincipalName, List.List<Types.UserGameweek>), List.List<Types.LeaderboardEntry>>(Iter.toArray(userPredictions.entries()), func ((principal, userGameweeks): (PrincipalName, List.List<Types.UserGameweek>)) : List.List<Types.LeaderboardEntry> {
            let filteredGameweeks = List.filter(userGameweeks, func (ugw: Types.UserGameweek) : Bool {
                return ugw.seasonId == seasonId and ugw.gameweekNumber == gameweekNumber;
            });

            return List.map<Types.UserGameweek, Types.LeaderboardEntry>(filteredGameweeks, func (ugw: Types.UserGameweek) : Types.LeaderboardEntry {
                return {
                    principalName = principal;
                    correctScores = ugw.correctScores;
                    predictionCount = ugw.predictionCount;
                };
            });
        });

        let flattenedLeaderboardEntries = List.flatten<Types.LeaderboardEntry>(List.fromArray(leaderboardEntries));

        // Find the highest number of correct scores
        let highestCorrectScores = List.foldLeft<Types.LeaderboardEntry, Nat8>(flattenedLeaderboardEntries, 0, func (highest: Nat8, entry: Types.LeaderboardEntry) : Nat8 {
            if (entry.correctScores > highest) {
                return entry.correctScores;
            } else {
                return highest;
            };
        });

        // Count the winners with the highest correct scores
        let winnerCount = List.foldLeft<Types.LeaderboardEntry, Nat>(flattenedLeaderboardEntries, 0, func (count: Nat, entry: Types.LeaderboardEntry) : Nat {
            if (entry.correctScores == highestCorrectScores) {
                return count + 1;
            } else {
                return count;
            };
        });

        return winnerCount;
    };


    public func getWinnerPrincipalIds(seasonId: Nat16, gameweekNumber: Nat8) : [PrincipalName] {
      let leaderboardEntries = Array.map<(PrincipalName, List.List<Types.UserGameweek>), List.List<Types.LeaderboardEntry>>(Iter.toArray(userPredictions.entries()), func ((principal, userGameweeks): (PrincipalName, List.List<Types.UserGameweek>)) : List.List<Types.LeaderboardEntry> {
        let filteredGameweeks = List.filter(userGameweeks, func (ugw: Types.UserGameweek) : Bool {
          return ugw.seasonId == seasonId and ugw.gameweekNumber == gameweekNumber;
        });

        return List.map<Types.UserGameweek, Types.LeaderboardEntry>(filteredGameweeks, func (ugw: Types.UserGameweek) : Types.LeaderboardEntry {
          return {
            principalName = principal;
            correctScores = ugw.correctScores;
            predictionCount = ugw.predictionCount;
          };
        });
      });

      let flattenedLeaderboardEntries = List.flatten<Types.LeaderboardEntry>(List.fromArray(leaderboardEntries));

      // Find the highest number of correct scores
      let highestCorrectScores = List.foldLeft<Types.LeaderboardEntry, Nat8>(flattenedLeaderboardEntries, 0, func (highest: Nat8, entry: Types.LeaderboardEntry) : Nat8 {
        if (entry.correctScores > highest) {
          return entry.correctScores;
        } else {
          return highest;
        };
      });

      // Filter the winners with the highest correct scores
      let winners = List.filter<Types.LeaderboardEntry>(flattenedLeaderboardEntries, func (entry: Types.LeaderboardEntry) : Bool {
        return entry.correctScores == highestCorrectScores;
      });

      // Extract the principal ids of the winners
      let winnerPrincipalIds = List.map<Types.LeaderboardEntry, PrincipalName>(winners, func (entry: Types.LeaderboardEntry) : PrincipalName {
        return entry.principalName;
      });

      return List.toArray<PrincipalName>(winnerPrincipalIds);
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





  }
}
