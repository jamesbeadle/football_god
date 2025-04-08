import FootballIds "mo:waterway-mops/football/FootballIds";
module MopsClubNotificationCommands = {
    public type CreateClubNotification = {
        leagueId: FootballIds.LeagueId;
        clubId: FootballIds.ClubId;
    };
    public type UpdateClubNotification = {
        leagueId: FootballIds.LeagueId;
        clubId: FootballIds.ClubId;
    };
    public type PromoteClubNotification = {
        leagueId: FootballIds.LeagueId;
        clubId: FootballIds.ClubId;
    };
    public type RelegateClubNotification = {
        leagueId: FootballIds.LeagueId;
        clubId: FootballIds.ClubId;
    };
};