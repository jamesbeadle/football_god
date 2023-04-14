import List "mo:base/List";
import Result "mo:base/Result";
import Iter "mo:base/Iter";
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
        let sortedTeams = bubbleSort(teams, List.size(teams));
        return List.toArray(sortedTeams);
    };

    public func getTeamName(teamId: Nat16) : Text {
        let foundTeam = List.find<Types.Team>(teams, func (team: Types.Team): Bool {
            return team.id == teamId;
        });

        switch (foundTeam) {
            case (null) { return "" };
            case (?team) {
                return team.name;
            };
        };
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
    

    private func bubbleSort(list: List.List<Types.Team>, n: Nat): List.List<Types.Team> {
        if (n <= 1) {
            return list;
        } else {
            let sortedList = sortPass(list, n, 0);
            return bubbleSort(sortedList, n - 1);
        }
    };

    private func sortPass(list: List.List<Types.Team>, n: Int, idx: Nat): List.List<Types.Team> {
        if (idx >= n - 1) {
            return list;
        } else {
            let updatedList = swapIfGreater(list, idx);
            return sortPass(updatedList, n, idx + 1);
        }
    };

    private func swapIfGreater(list: List.List<Types.Team>, idx: Nat): List.List<Types.Team> {
        let team1 = List.get(list, idx);
        let team2 = List.get(list, idx + 1);

        switch (team1, team2) {
            case (?t1, ?t2) {
                if (t1.name > t2.name) {
                    return List.push(t2, List.push(t1, List.drop(list, idx + 2)));
                } else {
                    return list;
                }
            };
            case _ {
                return list;
            };
        };
    };
  }
}
