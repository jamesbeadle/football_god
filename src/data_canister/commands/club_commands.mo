import FootballIds "mo:waterway-mops/football/FootballIds";
import FootballEnums "mo:waterway-mops/football/FootballEnums";

module ClubCommands {

  public type CreateClub = {
    leagueId: FootballIds.LeagueId;
    name : Text;
    friendlyName : Text;
    primaryColourHex : Text;
    secondaryColourHex : Text;
    thirdColourHex : Text;
    abbreviatedName : Text;
    shirtType : FootballEnums.ShirtType;
  };
  
  public type UpdateClub = {
    leagueId: FootballIds.LeagueId;
    clubId : FootballIds.ClubId;
    name : Text;
    friendlyName : Text;
    primaryColourHex : Text;
    secondaryColourHex : Text;
    thirdColourHex : Text;
    abbreviatedName : Text;
    shirtType : FootballEnums.ShirtType;
  };

  public type PromoteClub = {
    leagueId: FootballIds.LeagueId;
    clubId: FootballIds.ClubId;
    toLeagueId: FootballIds.LeagueId;
  };

  public type RelegateClub = {
    leagueId: FootballIds.LeagueId;
    clubId: FootballIds.ClubId;
    relegatedToLeagueId: FootballIds.LeagueId;
  };
}