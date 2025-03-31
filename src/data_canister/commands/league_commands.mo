import FootballTypes "mo:waterway-mops/FootballTypes";
import Enums "mo:waterway-mops/Enums";
import Ids "mo:waterway-mops/Ids";
module LeagueCommands {

  public type CreateLeague = {
    name: Text;
    abbreviation: Text;
    teamCount: Nat8;
    relatedGender: Enums.Gender;
    governingBody: Text;
    formed: Int;
    countryId: Ids.CountryId;
    logo: ?Blob;
  };

  public type UpdateLeague = {
    leagueId: FootballTypes.LeagueId;
    name: Text;
    abbreviation: Text;
    teamCount: Nat8;
    relatedGender: Enums.Gender;
    governingBody: Text;
    formed: Int;
    countryId: Ids.CountryId;
    logo: Blob;
  };
}