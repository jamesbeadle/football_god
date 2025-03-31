import FootballTypes "mo:waterway-mops/FootballTypes";
import BaseTypes "mo:waterway-mops/BaseTypes";
module PlayerQueries {
    public type GetPlayers = {
        leagueId: FootballTypes.LeagueId;
    };

    public type Players = {
        leagueId: FootballTypes.LeagueId;

    };

    public type Player = {

    };

    public type GetPlayerEvents = {
        
    };

    public type PlayerEvents = {
        
    };

    public type GetLoanedPlayers = {

    };

    public type LoanedPlayers = {

    };

    public type GetRetiredPlayers = {

    };

    public type RetiredPlayers = {

    };

    public type GetPlayerDetails = {
        leagueId: FootballTypes.LeagueId;
        playerId : FootballTypes.PlayerId;
        seasonId : FootballTypes.SeasonId;
    };

    public type PlayerDetails = {
        player: DetailedPlayer
    };


    public type DetailedPlayer = {
        id : FootballTypes.PlayerId;
        clubId : FootballTypes.ClubId;
        position : FootballTypes.PlayerPosition;
        firstName : Text;
        lastName : Text;
        shirtNumber : Nat8;
        valueQuarterMillions : Nat16;
        dateOfBirth : Int;
        nationality : BaseTypes.CountryId;
        seasonId : FootballTypes.SeasonId;
        gameweeks : [PlayerGameweek];
        valueHistory : [FootballTypes.ValueHistory];
        status : FootballTypes.PlayerStatus;
        parentClubId : FootballTypes.ClubId;
        latestInjuryEndDate : Int;
        injuryHistory : [FootballTypes.InjuryHistory];
        retirementDate : Int;
    };
        
    public type PlayerGameweek = {
        number : Nat8;
        events : [FootballTypes.PlayerEventData];
        points : Int16;
        fixtureId : FootballTypes.FixtureId;
    };


    public type GetPlayerDetailsForGameweek = {
        leagueId: FootballTypes.LeagueId;
        seasonId: FootballTypes.SeasonId;
        gameweek: FootballTypes.GameweekNumber;
    };

    public type PlayerDetailsForGameweek = {

    };


    public type PlayerPoints = {
        id : Nat16;
        gameweek : FootballTypes.GameweekNumber;
        points : Int16;
        clubId : FootballTypes.ClubId;
        position : FootballTypes.PlayerPosition;
        events : [FootballTypes.PlayerEventData];
    };


    public type GetPlayersMap = {

    };

    public type PlayersMap = {

    };








}