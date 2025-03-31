import Ids "mo:waterway-mops/Ids";
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

    public type GetCountries = {

    };

    public type Countries = {
        countries: [Country];
    };

    public type Country = {
        id : Ids.CountryId;
        name : Text;
        code : Text;
    }
}