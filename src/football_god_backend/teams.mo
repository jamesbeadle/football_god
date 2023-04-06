import List "mo:base/List";
import Result "mo:base/Result";

import Types "types";

module {
    
  public class Teams(){

    private var teams = List.nil<Types.Team>();
    private var nextTeamId : Nat16 = 1;

    public func setData(stable_teams: [Types.Team], stable_teamId : Nat16){
        teams := List.fromArray(stable_teams);
        nextTeamId := stable_teamId;
    };

    public func getTeams() : [Types.Team] {
        return List.toArray(teams);
    };

    public func getNextTeamId() : Nat16{
        return nextTeamId;
    };

    public func createTeam(name : Text) : Result.Result<(), Types.Error> {
        let id = nextTeamId;
        let newTeam : Types.Team = {
            id = id;
            name = name;
        };
        
        var newTeamList = List.nil<Types.Team>();
        newTeamList := List.push(newTeam, newTeamList);

        teams := List.append(teams, newTeamList);
        
        nextTeamId := nextTeamId + 1;
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
  }
}
