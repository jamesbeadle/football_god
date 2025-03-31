import BaseTypes "mo:waterway-mops/BaseTypes";
import FootballTypes "mo:waterway-mops/FootballTypes";
module LeagueCommands {

  public type CreateLeague = {
    name: Text;
    abbreviation: Text;
    teamCount: Nat8;
    relatedGender: BaseTypes.Gender;
    governingBody: Text;
    formed: Int;
    countryId: BaseTypes.CountryId;
    logo: ?Blob;
  };

  public type UpdateLeague = {
    leagueId: FootballTypes.LeagueId;
    name: Text;
    abbreviation: Text;
    teamCount: Nat8;
    relatedGender: BaseTypes.Gender;
    governingBody: Text;
    formed: Int;
    countryId: BaseTypes.CountryId;
    logo: Blob;
  };
}