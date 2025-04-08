import MopsPlayerNotificationCommands "../notification_commands/mops_player_notification_commands";
import MopsNotificationCommands "../mops_notification_commands/mops_notification_commands";
import MopsClubNotificationCommands "../mops_notification_commands/mops_club_notification_commands";
import Result "mo:base/Result";
import Iter "mo:base/Iter";
import Enums "mo:waterway-mops/Enums";
import Ids "mo:waterway-mops/Ids";
import CanisterIds "mo:waterway-mops/CanisterIds";
import MopsNotificationEnums "../mops_notification_commands/mops_notification_enums";
import MopsAppEnums "../mops_notification_commands/mops_app_enums";

module {

  public class NotificationManager() {

    let newClubApps: [(MopsAppEnums.App, Ids.CanisterId)] = [
        (#OpenFPL, CanisterIds.OPENFPL_BACKEND_CANISTER_ID),
        (#OpenWSL, CanisterIds.OPENWSL_BACKEND_CANISTER_ID),
        (#JeffBets, CanisterIds.JEFF_BETS_BACKEND_CANISTER_ID)
    ];

    let updateClubApps: [(MopsAppEnums.App, Ids.CanisterId)] = [
        (#OpenFPL, CanisterIds.OPENFPL_BACKEND_CANISTER_ID),
        (#OpenWSL, CanisterIds.OPENWSL_BACKEND_CANISTER_ID),
        (#JeffBets, CanisterIds.JEFF_BETS_BACKEND_CANISTER_ID)
    ];


    public func distributeNotification(notificationType: MopsNotificationEnums.NotificationType, dto: MopsNotificationCommands.Notification) : async Result.Result<(), Enums.Error>{
       
        switch(notificationType){
            case (#NewClub){
                for(app in Iter.fromArray(newClubApps)){
                    let application_canister = actor (app.1) : actor {
                        newClubNotification : (dto: MopsClubNotificationCommands.NewClubNotification) -> async Result.Result<(), Enums.Error>;
                    };
                    switch(dto){
                        case (#NewClub foundDTO){
                            let _ = await application_canister.newClubNotification(foundDTO);
                        };
                        case (_){}
                    };
                };
            };
            case (#UpdateClub){
                for(app in Iter.fromArray(updateClubApps)){
                    let application_canister = actor (app.1) : actor {
                        updateClubNotification : (dto: MopsClubNotificationCommands.UpdatedClubNotification) -> async Result.Result<(), Enums.Error>;
                    };
                    switch(dto){
                        case (#UpdateClub foundDTO){
                            let _ = await application_canister.updateClubNotification(foundDTO);
                        };
                        case (_){}
                    };
                };
            };
            case (#PromotedClub){};
            case (#RelegatedClub){};
            case (#InitialFixturesAdded){};
            case (#SeasonBegun){};
            case (#GameweekBegun){};
            case (#GameweekComplete){};
            case (#FixtureFinalised){};
            case (#SeasonComplete){};
            case (#PlayerValueUp){};
            case (#PlayerValueDown){};
            case (#PlayerLoan){};
            case (#PlayerLoanRecalled){};
            case (#PlayerLoanExpired){};
            case (#PlayerTransferred){};
            case (#PlayerFreeAgent){};
            case (#PlayerCreated){};
            case (#PlayerUpdated){};
            case (#PlayerInjuryUpdated){};
            case (#PlayerRetired){};
            case (#PlayerUnretired){};
            case (#PlayerPositionChange){};
        };
        return #ok();
    }

  };

};
