import FootballIds "mo:waterway-mops/football/FootballIds";

module AppQueries {
    public type GetDataHashes = {
        leagueId: FootballIds.LeagueId;
    };

    public type DataHashes = {
        dataHashes: [DataHash];
    };

    public type DataHash = {
        category : Text;
        hash : Text;
    };
}