import FootballTypes "mo:waterway-mops/FootballTypes";
module ClubCommands {

  public type CreateClub = {
    leagueId: FootballTypes.LeagueId;
    name : Text;
    friendlyName : Text;
    primaryColourHex : Text;
    secondaryColourHex : Text;
    thirdColourHex : Text;
    abbreviatedName : Text;
    shirtType : FootballTypes.ShirtType;
  };
  
  public type UpdateClub = {
    leagueId: FootballTypes.LeagueId;
    clubId : FootballTypes.ClubId;
    name : Text;
    friendlyName : Text;
    primaryColourHex : Text;
    secondaryColourHex : Text;
    thirdColourHex : Text;
    abbreviatedName : Text;
    shirtType : FootballTypes.ShirtType;
  };

  public type PromoteClub = {
    leagueId: FootballTypes.LeagueId;
    clubId: FootballTypes.ClubId;
    toLeagueId: FootballTypes.LeagueId;
  };

  public type RelegateClub = {
    leagueId: FootballTypes.LeagueId;
    clubId: FootballTypes.ClubId;
    relegatedToLeagueId: FootballTypes.LeagueId;
  };
}