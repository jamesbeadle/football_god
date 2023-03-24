import Types "types";
import Result "mo:base/Result";
import Map "mo:base/HashMap";
import Text "mo:base/Text";
import List "mo:base/List";
import Hash "mo:base/Hash";
import Prim "mo:prim";

module {
    
  public class Predictions(){

    private type PrincipalName = Text;

    let nat16Hash: (Nat16) -> Hash.Hash = func(x) { Prim.natToNat32(Prim.nat16ToNat(x)) };
    let nat16Eq: (Nat16, Nat16) -> Bool = func(x, y) { x == y };
    let nat8Hash: (Nat8) -> Hash.Hash = func(x) { Prim.natToNat32(Prim.nat8ToNat(x)) };
    let nat8Eq: (Nat8, Nat8) -> Bool = func(x, y) { x == y };
   
    private var userPredictions = Map.HashMap<Nat16, Map.HashMap<Nat8, Map.HashMap<PrincipalName, List.List<Types.Prediction>>>>(0, nat16Eq, nat16Hash);
   
    public func submitPredictions(principalName: Text, seasonId: Nat16, gameweekId: Nat8, predictions: [Types.Prediction]) : Result.Result<(), Types.Error> {
        
        let gameWeekPredictions = List.fromArray<Types.Prediction>(predictions);

        // Get season map or create a new one
        let seasonMap = switch (userPredictions.get(seasonId)) {
            case (null) {
                let newSeasonMap = Map.HashMap<Nat8, Map.HashMap<PrincipalName, List.List<Types.Prediction>>>(0, nat8Eq, nat8Hash);
                userPredictions.put(seasonId, newSeasonMap);
                newSeasonMap
            };
            case (?existingSeasonMap) {
                existingSeasonMap
            };
        };

        // Get gameweek map or create a new one
        let gameWeekMap = switch (seasonMap.get(gameweekId)) {
            case (null) {
                let newGameWeekMap = Map.HashMap<PrincipalName, List.List<Types.Prediction>>(0, Text.equal, Text.hash);
                seasonMap.put(gameweekId, newGameWeekMap);
                newGameWeekMap
            };
            case (?existingGameWeekMap) {
                existingGameWeekMap
            };
        };

        // Update or add the list of predictions for the given principal
        gameWeekMap.put(principalName, gameWeekPredictions);
        return #ok(());
    };

  }
}
