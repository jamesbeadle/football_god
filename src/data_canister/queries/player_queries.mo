import FootballTypes "mo:waterway-mops/FootballTypes";
import Ids "mo:waterway-mops/Ids";
module PlayerQueries {
    public type GetPlayers = {
        leagueId: FootballTypes.LeagueId;
    };

    public type Players = {
        players: [Player];
    };

    public type Player = {
        id : Nat16;
        clubId : FootballTypes.ClubId;
        position : FootballTypes.PlayerPosition;
        firstName : Text;
        lastName : Text;
        shirtNumber : Nat8;
        valueQuarterMillions : Nat16;
        dateOfBirth : Int;
        nationality : Ids.CountryId;
        status : FootballTypes.PlayerStatus;
        leagueId: FootballTypes.LeagueId;
        parentLeagueId: FootballTypes.LeagueId;
        parentClubId: FootballTypes.ClubId;
        currentLoanEndDate: Int;

    };

    public type GetPlayerEvents = {
        
    };

    public type PlayerEvents = {
        
    };

    public type GetLoanedPlayers = {
        leagueId: FootballTypes.LeagueId;

    };

    public type LoanedPlayers = {
        players: [Player];
    };

    public type GetRetiredPlayers = {
        leagueId: FootballTypes.LeagueId;
        clubId : FootballTypes.ClubId;

    };

    public type RetiredPlayers = {
        players: [Player];
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
        nationality : Ids.CountryId;
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
        playerPoints: [PlayerQueries.PlayerPoints];
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
        leagueId: FootballTypes.LeagueId;
        seasonId: FootballTypes.SeasonId;
        gameweek: FootballTypes.GameweekNumber;
    };

    public type PlayersMap = {

    };

    public type PlayerScore = {
         id : Nat16;
        points : Int16;
        clubId : FootballTypes.ClubId;
        goalsScored : Int16;
        goalsConceded : Int16;
        position : FootballTypes.PlayerPosition;
        nationality : Ids.CountryId;
        dateOfBirth : Int;
        saves : Int16;
        assists : Int16;
        events : [FootballTypes.PlayerEventData];
    };








}