import MopsClubNotificationCommands "mops_club_notification_commands";
import MopsLeagueNotificationCommands "mops_league_notification_commands";
import MopsPlayerNotificationCommands "mops_player_notification_commands";
module NotificationCommands {
    public type Notification = {
        #NewClub : MopsClubNotificationCommands.NewClubNotification;
        #UpdateClub : MopsClubNotificationCommands.UpdateClubNotification;
        #PromoteClub : MopsClubNotificationCommands.PromoteClubNotification;
        #RelegateClub : MopsClubNotificationCommands.RelegateClubNotification;
        #CreateLeague : MopsLeagueNotificationCommands.CreateLeagueNotification;
        #UpdateLeague : MopsLeagueNotificationCommands.UpdateLeagueNotification;
        #AddInitialFixtures : MopsLeagueNotificationCommands.AddInitialFixtureNotification;
        #BeginSeason : MopsLeagueNotificationCommands.BeginSeasonNotification;
        #BeginGameweek : MopsLeagueNotificationCommands.BeginGameweekNotification;
        #CompleteGameweek : MopsLeagueNotificationCommands.CompleteGameweekNotification;
        #CompleteFixture : MopsLeagueNotificationCommands.CompleteFixtureNotification;
        #FinaliseFixture : MopsLeagueNotificationCommands.FinaliseFixtureNotification;
        #CompleteSeason : MopsLeagueNotificationCommands.CompleteSeasonNotification;
        #RevaluePlayerUp : MopsPlayerNotificationCommands.RevaluePlayerUpNotification;
        #RevaluePlayerDown : MopsPlayerNotificationCommands.RevaluePlayerDownNotification;
        #LoanPlayer : MopsPlayerNotificationCommands.LoanPlayerNotification;
        #RecallPlayer : MopsPlayerNotificationCommands.RecallPlayerNotification;
        #ExpireLoan : MopsPlayerNotificationCommands.ExpireLoanNotification;
        #TransferPlayer : MopsPlayerNotificationCommands.TransferPlayerNotification;
        #SetFreeAgent : MopsPlayerNotificationCommands.SetFreeAgentNotification;
        #CreatePlayer : MopsPlayerNotificationCommands.CreatePlayerNotification;
        #UpdatePlayer : MopsPlayerNotificationCommands.UpdatePlayerNotification;
        #InjuryUpdated : MopsPlayerNotificationCommands.InjuryUpdatedNotification;
        #RetirePlayer : MopsPlayerNotificationCommands.RetirePlayerNotification;
        #UnretirePlayer : MopsPlayerNotificationCommands.UnretirePlayerNotification;
        #ChangePlayerPosition : MopsPlayerNotificationCommands.ChangePlayerPositionNotification;
    }
}