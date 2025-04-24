import FootballIds "mo:waterway-mops/football/FootballIds";
import FootballEnums "mo:waterway-mops/football/FootballEnums";
import Enums "mo:waterway-mops/Enums";
module SummaryTypes {

    public type ClubSummary = {
        clubId: FootballIds.ClubId;
        leagueId: FootballIds.LeagueId;
        clubName: Text;
        position: Nat;
        positionText: Text;
        totalValue: Nat;
        priorValue: Nat;
        primaryColour: Text;
        secondaryColour: Text;
        thirdColour: Text;
        shirtType: FootballEnums.ShirtType;
        gender: Enums.Gender;
        totalPlayers: Nat16;
        totalGoalkeepers: Nat16;
        totalDefenders: Nat16;
        totalMidfielders: Nat16;
        totalForwards: Nat16;
        totalGKValue: Nat;
        totalDFValue: Nat;
        totalMFValue: Nat;
        totalFWValue: Nat;
        mvp: MostValuablePlayer;
    };

    public type MostValuablePlayer = {
        id: FootballIds.PlayerId;
        firstName: Text;
        lastName: Text;
        value: Nat16;
    };

    public type PlayerSummary = {
        playerId: FootballIds.PlayerId;
        clubId: FootballIds.ClubId;
        leagueId: FootballIds.LeagueId;
        position: Nat;
        positionText: Text;
        totalValue: Nat16;
        priorValue: Nat16;
    };

    public type DataTotals = {
        totalLeagues: Nat;
        totalClubs: Nat;
        totalPlayers: Nat;
        totalNeurons: Nat;
        totalProposals: Nat;
        totalGovernanceRewards: Nat;
    };
    
}