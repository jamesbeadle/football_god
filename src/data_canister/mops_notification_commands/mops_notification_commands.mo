import MopsClubNotificationCommands "mops_club_notification_commands";
import MopsLeagueNotificationCommands "mops_league_notification_commands";
import MopsPlayerNotificationCommands "mops_player_notification_commands";
module NotificationCommands {
    public type Notification = {
        #NewClub : MopsClubNotificationCommands.NewClubNotification;
        #UpdateClub : MopsClubNotificationCommands.UpdatedClubNotification;
        #PromotedClub : MopsClubNotificationCommands.PromotedClubNotification;
        #RelegatedClub : MopsClubNotificationCommands.RelegatedClubNotification;
        #InitialFixturesAdded : MopsLeagueNotificationCommands.InitialFixturesAddedNotification;
        #SeasonBegun : MopsLeagueNotificationCommands.SeasonBeginNotification;
        #GameweekBegun : MopsLeagueNotificationCommands.GameweekBeginNotification;
        #GameweekComplete : MopsLeagueNotificationCommands.GameweekCompleteNotification;
        #FixtureFinalised : MopsLeagueNotificationCommands.FixtureFinalisedNotification;
        #SeasonComplete : MopsLeagueNotificationCommands.SeasonCompleteNotification;
        #PlayerValueUp : MopsPlayerNotificationCommands.PlayerValueUpNotification;
        #PlayerValueDown : MopsPlayerNotificationCommands.PlayerValueDownNotification;
        #PlayerLoan : MopsPlayerNotificationCommands.PlayerLoanNotification;
        #PlayerLoanRecalled : MopsPlayerNotificationCommands.PlayerLoanRecallNotification;
        #PlayerLoanExpired : MopsPlayerNotificationCommands.PlayerLoanExpiredNotification;
        #PlayerTransferred : MopsPlayerNotificationCommands.PlayerTransferNotification;
        #PlayerFreeAgent : MopsPlayerNotificationCommands.PlayerFreeAgentNotification;
        #PlayerCreated : MopsPlayerNotificationCommands.PlayerCreatedNotification;
        #PlayerUpdated : MopsPlayerNotificationCommands.PlayerUpdatedNotification;
        #PlayerInjuryUpdated : MopsPlayerNotificationCommands.PlayerInjuryUpdatedNotification;
        #PlayerRetired : MopsPlayerNotificationCommands.PlayerRetirementNotification;
        #PlayerUnretired : MopsPlayerNotificationCommands.PlayerUnretiredNotification;
        #PlayerPositionChange : MopsPlayerNotificationCommands.PlayerPositionChangeNotification;
    }
}