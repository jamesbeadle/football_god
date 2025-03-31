import FootballTypes "mo:waterway-mops/FootballTypes";
import Ids "mo:waterway-mops/Ids";
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
        countries: [Country];
    };

    public type Country = {
        id : Ids.CountryId;
        name : Text;
        code : Text;
    }
}