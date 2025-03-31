import Ids "mo:waterway-mops/Ids";
import FootballIds "mo:waterway-mops/football/FootballIds";
import Enums "mo:waterway-mops/Enums";

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
    leagueId: FootballIds.LeagueId;
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