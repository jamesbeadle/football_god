import FootballTypes "mo:waterway-mops/FootballTypes";
module AppQueries {
    public type GetDataHashes = {
        leagueId: FootballTypes.LeagueId;
    };

    public type DataHashes = {
        dataHashes: [DataHash];
    };

    public type DataHash = {
        category : Text;
        hash : Text;
    };

    public type GetCountries = {

    };

    public type Countries = {
        
    }
}