import FootballIds "mo:waterway-mops/football/FootballIds";
module MopsClubNotificationCommands = {
    public type ClubChangeNotification = {
        leagueId: FootballIds.LeagueId;
        clubId: FootballIds.ClubId;
    };
};