import Types "types";
import Result "mo:base/Result";
import Map "mo:base/HashMap";
import Text "mo:base/Text";
import List "mo:base/List";

module {
    
  public class Predictions(){

    private type PrincipalName = Text;
    private var userPredictions = Map.HashMap<PrincipalName, List.List<Types.Prediction>>(0, Text.equal, Text.hash);
    private var nextId : Nat16 = 1;

    public func submitPredictions(principalName: Text, seasonId: Nat16, gameweekId: Nat8, predictions: [Types.Prediction]) : Result.Result<(), Types.Error> {
        
        let id = nextId;

        //create list of predictions for game week

        //check if list already exists 

        //update the list if exists

        // add the list if it doesn't
        
        nextId := nextId + 1;
        return #ok(());
    };

  }
}
