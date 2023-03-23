import List "mo:base/List";
import Types "types";
import Result "mo:base/Result";

module {
    
  public class Seasons(){

    private var seasons = List.nil<Types.Season>();
    private var nextId : Nat16 = 1;

    public func createSeason(name : Text, year : Nat16) : Result.Result<(), Types.Error> {
        
        let id = nextId;
        let newSeason : Types.Season = {
          id = id;
          name = name;
          year = year;
          active = false;
        };
        
        seasons := List.push(newSeason, seasons);
        
        nextId := nextId + 1;
        return #ok(());
    };

    public func updateSeason(id : Nat16, newName : Text, newYear : Nat16) : Result.Result<(), Types.Error> {
    
        seasons := List.map<Types.Season, Types.Season>(seasons,
        func (season: Types.Season): Types.Season {
            if (season.id == id) {
            { id = season.id; name = newName; year = newYear; active = season.active }
            } 
            else { season }
        });

        return #ok(());
    };

    public func deleteSeason(id : Nat16) : Result.Result<(), Types.Error> {
        
            seasons := List.filter(seasons, func(season: Types.Season): Bool { season.id != id });
            return #ok(());
    };

    public func getSeasons() : [Types.Season] {
        return List.toArray(seasons);
    };
  }
}
