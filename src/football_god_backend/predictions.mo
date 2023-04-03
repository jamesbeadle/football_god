import Types "types";
import Result "mo:base/Result";
import Map "mo:base/HashMap";
import Text "mo:base/Text";
import List "mo:base/List";
import Debug "mo:base/Debug";

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
              };
            } else {
              return ugw;
            };
          });

          userPredictions.put(principalName, updatedUserGameweeks);

          return #ok(());
        };
      };
    }



  }
}
