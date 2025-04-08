import Iter "mo:base/Iter";
import Result "mo:base/Result";

import CanisterIds "mo:waterway-mops/CanisterIds";
import Enums "mo:waterway-mops/Enums";
import Ids "mo:waterway-mops/Ids";

import MopsNotificationCommands "../mops_notification_commands/mops_notification_commands";
import MopsPlayerNotificationCommands "../mops_notification_commands/mops_player_notification_commands";
import MopsClubNotificationCommands "../mops_notification_commands/mops_club_notification_commands";

import MopsNotificationEnums "../mops_notification_commands/mops_notification_enums";
import MopsAppEnums "../mops_notification_commands/mops_app_enums";
import MopsLeagueNotificationCommands "../mops_notification_commands/mops_league_notification_commands";

// TODO John how do we make sure if a canister call fails the others continue

module {

  public class NotificationManager() {

    let defaultNotificationGroup: [(MopsAppEnums.App, Ids.CanisterId)] = [
        (#OpenFPL, CanisterIds.OPENFPL_BACKEND_CANISTER_ID),
        (#OpenWSL, CanisterIds.OPENWSL_BACKEND_CANISTER_ID),
        (#JeffBets, CanisterIds.JEFF_BETS_BACKEND_CANISTER_ID)
    ];


    public func distributeNotification(notificationType: MopsNotificationEnums.NotificationType, dto: MopsNotificationCommands.Notification) : async Result.Result<(), Enums.Error>{
       
        switch(notificationType){
            case (#NewClub){
                for(app in Iter.fromArray(defaultNotificationGroup)){
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
                for(app in Iter.fromArray(defaultNotificationGroup)){
                    let application_canister = actor (app.1) : actor {
                        updateClubNotification : (dto: MopsClubNotificationCommands.UpdateClubNotification) -> async Result.Result<(), Enums.Error>;
                    };
                    switch(dto){
                        case (#UpdateClub foundDTO){
                            let _ = await application_canister.updateClubNotification(foundDTO);
                        };
                        case (_){}
                    };
                };
            };
            case (#PromoteClub){
                for(app in Iter.fromArray(defaultNotificationGroup)){
                    let application_canister = actor (app.1) : actor {
                        promoteClubNotification : (dto: MopsClubNotificationCommands.PromoteClubNotification) -> async Result.Result<(), Enums.Error>;
                    };
                    switch(dto){
                        case (#PromoteClub foundDTO){
                            let _ = await application_canister.promoteClubNotification(foundDTO);
                        };
                        case (_){}
                    };
                };
            };
            case (#RelegateClub){
                for(app in Iter.fromArray(defaultNotificationGroup)){
                    let application_canister = actor (app.1) : actor {
                        relegateClubNotification : (dto: MopsClubNotificationCommands.RelegateClubNotification) -> async Result.Result<(), Enums.Error>;
                    };
                    switch(dto){
                        case (#RelegateClub foundDTO){
                            let _ = await application_canister.relegateClubNotification(foundDTO);
                        };
                        case (_){}
                    };
                };
            };
            case (#AddInitialFixtures){
                for(app in Iter.fromArray(defaultNotificationGroup)){
                    let application_canister = actor (app.1) : actor {
                        addInitialFixtureNotification : (dto: MopsLeagueNotificationCommands.AddInitialFixtureNotification) -> async Result.Result<(), Enums.Error>;
                    };
                    switch(dto){
                        case (#AddInitialFixtures foundDTO){
                            let _ = await application_canister.addInitialFixtureNotification(foundDTO);
                        };
                        case (_){}
                    };
                };
            };
            case (#BeginSeason){
                for(app in Iter.fromArray(defaultNotificationGroup)){
                    let application_canister = actor (app.1) : actor {
                        beginSeasonNotification : (dto: MopsLeagueNotificationCommands.BeginSeasonNotification) -> async Result.Result<(), Enums.Error>;
                    };
                    switch(dto){
                        case (#BeginSeason foundDTO){
                            let _ = await application_canister.beginSeasonNotification(foundDTO);
                        };
                        case (_){}
                    };
                };
            };
            case (#BeginGameweek){
                for(app in Iter.fromArray(defaultNotificationGroup)){
                    let application_canister = actor (app.1) : actor {
                        beginGameweekNotification : (dto: MopsLeagueNotificationCommands.BeginGameweekNotification) -> async Result.Result<(), Enums.Error>;
                    };
                    switch(dto){
                        case (#BeginGameweek foundDTO){
                            let _ = await application_canister.beginGameweekNotification(foundDTO);
                        };
                        case (_){}
                    };
                };
            };
            case (#CompleteGameweek){
                for(app in Iter.fromArray(defaultNotificationGroup)){
                    let application_canister = actor (app.1) : actor {
                        completeGameweekNotification : (dto: MopsLeagueNotificationCommands.CompleteGameweekNotification) -> async Result.Result<(), Enums.Error>;
                    };
                    switch(dto){
                        case (#CompleteGameweek foundDTO){
                            let _ = await application_canister.completeGameweekNotification(foundDTO);
                        };
                        case (_){}
                    };
                };
            };
            case (#FinaliseFixture){
                for(app in Iter.fromArray(defaultNotificationGroup)){
                    let application_canister = actor (app.1) : actor {
                        finaliseFixtureNotification : (dto: MopsLeagueNotificationCommands.FinaliseFixtureNotification) -> async Result.Result<(), Enums.Error>;
                    };
                    switch(dto){
                        case (#FinaliseFixture foundDTO){
                            let _ = await application_canister.finaliseFixtureNotification(foundDTO);
                        };
                        case (_){}
                    };
                };
            };
            case (#CompleteSeason){
                for(app in Iter.fromArray(defaultNotificationGroup)){
                    let application_canister = actor (app.1) : actor {
                        completeSeasonNotification : (dto: MopsLeagueNotificationCommands.CompleteSeasonNotification) -> async Result.Result<(), Enums.Error>;
                    };
                    switch(dto){
                        case (#CompleteSeason foundDTO){
                            let _ = await application_canister.completeSeasonNotification(foundDTO);
                        };
                        case (_){}
                    };
                };
            };
            case (#RevaluePlayerUp){
                for(app in Iter.fromArray(defaultNotificationGroup)){
                    let application_canister = actor (app.1) : actor {
                        revaluePlayerUpNotification : (dto: MopsPlayerNotificationCommands.RevaluePlayerUpNotification) -> async Result.Result<(), Enums.Error>;
                    };
                    switch(dto){
                        case (#RevaluePlayerUp foundDTO){
                            let _ = await application_canister.revaluePlayerUpNotification(foundDTO);
                        };
                        case (_){}
                    };
                };
            };
            case (#RevaluePlayerDown){
                for(app in Iter.fromArray(defaultNotificationGroup)){
                    let application_canister = actor (app.1) : actor {
                        revaluePlayerDownNotification : (dto: MopsPlayerNotificationCommands.RevaluePlayerDownNotification) -> async Result.Result<(), Enums.Error>;
                    };
                    switch(dto){
                        case (#RevaluePlayerDown foundDTO){
                            let _ = await application_canister.revaluePlayerDownNotification(foundDTO);
                        };
                        case (_){}
                    };
                };
            };
            case (#LoanPlayer){
                for(app in Iter.fromArray(defaultNotificationGroup)){
                    let application_canister = actor (app.1) : actor {
                        loanPlayerNotification : (dto: MopsPlayerNotificationCommands.LoanPlayerNotification) -> async Result.Result<(), Enums.Error>;
                    };
                    switch(dto){
                        case (#LoanPlayer foundDTO){
                            let _ = await application_canister.loanPlayerNotification(foundDTO);
                        };
                        case (_){}
                    };
                };
            };
            case (#RecallPlayer){
                for(app in Iter.fromArray(defaultNotificationGroup)){
                    let application_canister = actor (app.1) : actor {
                        recallPlayerNotification : (dto: MopsPlayerNotificationCommands.RecallPlayerNotification) -> async Result.Result<(), Enums.Error>;
                    };
                    switch(dto){
                        case (#RecallPlayer foundDTO){
                            let _ = await application_canister.recallPlayerNotification(foundDTO);
                        };
                        case (_){}
                    };
                };
            };
            case (#ExpireLoan){
                for(app in Iter.fromArray(defaultNotificationGroup)){
                    let application_canister = actor (app.1) : actor {
                        expireLoanNotification : (dto: MopsPlayerNotificationCommands.ExpireLoanNotification) -> async Result.Result<(), Enums.Error>;
                    };
                    switch(dto){
                        case (#ExpireLoan foundDTO){
                            let _ = await application_canister.expireLoanNotification(foundDTO);
                        };
                        case (_){}
                    };
                };
            };
            case (#TransferPlayer){
                for(app in Iter.fromArray(defaultNotificationGroup)){
                    let application_canister = actor (app.1) : actor {
                        transferPlayerNotification : (dto: MopsPlayerNotificationCommands.TransferPlayerNotification) -> async Result.Result<(), Enums.Error>;
                    };
                    switch(dto){
                        case (#TransferPlayer foundDTO){
                            let _ = await application_canister.transferPlayerNotification(foundDTO);
                        };
                        case (_){}
                    };
                };
            };
            case (#SetFreeAgent){
                for(app in Iter.fromArray(defaultNotificationGroup)){
                    let application_canister = actor (app.1) : actor {
                        setFreeAgentNotification : (dto: MopsPlayerNotificationCommands.SetFreeAgentNotification) -> async Result.Result<(), Enums.Error>;
                    };
                    switch(dto){
                        case (#SetFreeAgent foundDTO){
                            let _ = await application_canister.setFreeAgentNotification(foundDTO);
                        };
                        case (_){}
                    };
                };
            };
            case (#CreatePlayer){
                for(app in Iter.fromArray(defaultNotificationGroup)){
                    let application_canister = actor (app.1) : actor {
                        createPlayerNotification : (dto: MopsPlayerNotificationCommands.CreatePlayerNotification) -> async Result.Result<(), Enums.Error>;
                    };
                    switch(dto){
                        case (#CreatePlayer foundDTO){
                            let _ = await application_canister.createPlayerNotification(foundDTO);
                        };
                        case (_){}
                    };
                };
            };
            case (#UpdatePlayer){
                for(app in Iter.fromArray(defaultNotificationGroup)){
                    let application_canister = actor (app.1) : actor {
                        updatePlayerNotification : (dto: MopsPlayerNotificationCommands.UpdatePlayerNotification) -> async Result.Result<(), Enums.Error>;
                    };
                    switch(dto){
                        case (#UpdatePlayer foundDTO){
                            let _ = await application_canister.updatePlayerNotification(foundDTO);
                        };
                        case (_){}
                    };
                };
            };
            case (#InjuryUpdated){
                for(app in Iter.fromArray(defaultNotificationGroup)){
                    let application_canister = actor (app.1) : actor {
                        injuryUpdatedNotification : (dto: MopsPlayerNotificationCommands.InjuryUpdatedNotification) -> async Result.Result<(), Enums.Error>;
                    };
                    switch(dto){
                        case (#InjuryUpdated foundDTO){
                            let _ = await application_canister.injuryUpdatedNotification(foundDTO);
                        };
                        case (_){}
                    };
                };
            };
            case (#RetirePlayer){
                for(app in Iter.fromArray(defaultNotificationGroup)){
                    let application_canister = actor (app.1) : actor {
                        retirePlayerNotification : (dto: MopsPlayerNotificationCommands.RetirePlayerNotification) -> async Result.Result<(), Enums.Error>;
                    };
                    switch(dto){
                        case (#RetirePlayer foundDTO){
                            let _ = await application_canister.retirePlayerNotification(foundDTO);
                        };
                        case (_){}
                    };
                };
            };
            case (#UnretirePlayer){
                for(app in Iter.fromArray(defaultNotificationGroup)){
                    let application_canister = actor (app.1) : actor {
                        unretirePlayerNotification : (dto: MopsPlayerNotificationCommands.UnretirePlayerNotification) -> async Result.Result<(), Enums.Error>;
                    };
                    switch(dto){
                        case (#UnretirePlayer foundDTO){
                            let _ = await application_canister.unretirePlayerNotification(foundDTO);
                        };
                        case (_){}
                    };
                };
            };
            case (#ChangePlayerPosition){
                for(app in Iter.fromArray(defaultNotificationGroup)){
                    let application_canister = actor (app.1) : actor {
                        changePlayerPositionNotification : (dto: MopsPlayerNotificationCommands.ChangePlayerPositionNotification) -> async Result.Result<(), Enums.Error>;
                    };
                    switch(dto){
                        case (#ChangePlayerPosition foundDTO){
                            let _ = await application_canister.changePlayerPositionNotification(foundDTO);
                        };
                        case (_){}
                    };
                };
            };
        };
        return #ok();
    }

  };

};
