import List "mo:base/List";
import Result "mo:base/Result";
import Types "types";
import Array "mo:base/Array";
import Order "mo:base/Order";

module {

  public class Teams() {

    private var teams = List.nil<Types.Team>();
    private var nextTeamId : Nat16 = 1;

    public func setData(stable_teams : [Types.Team], stable_teamId : Nat16) {
      teams := List.fromArray(stable_teams);
      nextTeamId := stable_teamId;
    };

    public func getTeams() : [Types.Team] {
      let teamsArray = List.toArray(teams);
      let sortedArray = Array.sort(
        teamsArray,
        func(a : Types.Team, b : Types.Team) : Order.Order {
          if (a.name < b.name) { return #less };
          if (a.name == b.name) { return #equal };
          return #greater;
        },
      );
      return sortedArray;
    };

    public func getTeamName(teamId : Nat16) : Text {
      let foundTeam = List.find<Types.Team>(
        teams,
        func(team : Types.Team) : Bool {
          return team.id == teamId;
        },
      );

      switch (foundTeam) {
        case (null) { return "" };
        case (?team) {
          return team.name;
        };
      };
    };

    public func getNextTeamId() : Nat16 {
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
      teams := List.map<Types.Team, Types.Team>(
        teams,
        func(team : Types.Team) : Types.Team {
          if (team.id == id) { { id = team.id; name = newName } } else { team };
        },
      );

      return #ok(());
    };

    public func deleteTeam(id : Nat16) : Result.Result<(), Types.Error> {
      teams := List.filter(teams, func(team : Types.Team) : Bool { team.id != id });
      return #ok(());
    };

  };
};
