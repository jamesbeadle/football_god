import List "mo:base/List";
import Types "types";
import Result "mo:base/Result";

module {
    
  public class Teams(){

    private var teams = List.nil<Types.Team>();
    private var nextId : Nat16 = 1;

    public func createTeam(name : Text) : Result.Result<(), Types.Error> {
        
        let id = nextId;
        let newTeam : Types.Team = {
            id = id;
            name = name;
        };
        
        var newTeamList = List.nil<Types.Team>();
        newTeamList := List.push(newTeam, newTeamList);

        teams := List.append(teams, newTeamList);
        
        nextId := nextId + 1;
        return #ok(());
    };

    public func updateTeam(id : Nat16, newName : Text) : Result.Result<(), Types.Error> {
    
        teams := List.map<Types.Team, Types.Team>(teams,
        func (team: Types.Team): Types.Team {
            if (team.id == id) {
            { id = team.id; name = newName; }
            } 
            else { team }
        });

        return #ok(());
    };

    public func deleteTeam(id : Nat16) : Result.Result<(), Types.Error> {
        
            teams := List.filter(teams, func(team: Types.Team): Bool { team.id != id });
            return #ok(());
    };

    public func getTeams() : [Types.Team] {
        return List.toArray(teams);
    };
  }
}
