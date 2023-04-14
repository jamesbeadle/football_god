module DTOs {
   
    public type HomeDTO = {
        systemUpdating: Bool;
        activeSeasonName: Text;
        activeGameweekNumber: Nat8;
        gameweekPot: Nat64;
        fixtures: [FixtureDTO];
        gameweekStatus: Nat8;
    };

    public type PlayDTO = {
        activeSeasonName: Text;
        activeSeasonId: Nat16;
        activeGameweekNumber: Nat8;
        fixtures: [FixtureDTO];
        sweepstakePaid: Bool;
        accountBalance: Nat64;
        userId: Text;
    };

    public type SubmitPlayDTO = {
        fixtures: [FixtureDTO];
        enterSweepstake: Bool;
    };

    public type ViewPredictionDTO = {
        seasonName: Text;
        fixtures: [FixtureDTO];
        playerName: Text;
        correctScores: Nat8;
        totalFixtures: Nat8;
    };

    public type HistoryDTO = {
        seasons: [SeasonDTO];
        activeSeasonId: Nat16;
        activeSeasonName: Text;
        seasonGameweeks: [GameweekDTO];
        userId: Text;
    };

    public type GetHistoryDTO = {
        seasonId: Nat16;
    };

    public type LeaderBoardDTO = {
        seasons: [SeasonDTO];
        activeSeasonId: Nat16;
        activeSeasonName: Text;
        activeGameweekNumber: Nat8;
        leaderboardEntries: [LeaderboardEntryDTO];
        totalEntries: Nat64;
        page: Nat;
        count: Nat;
    };

    public type LeaderboardEntryDTO = {
        principalName: Text;
        position: Text;
        displayName: Text;
        correctScores: Nat8;
        totalFixtures: Nat8;
        enteredSweepstake: Bool;
    };

    public type GetleaderboardDTO = {
        seasonId: Nat16;
        gameweekNumber: Nat16;
        page: Nat32;
        count: Nat16;
    };

    public type AdminDTO = {
        activeSeasonId: Nat16;
        activeSeasonName: Text;
        activeGameweekNumber: Nat8;
        activeGameweekStatus: Text;
        seasons: [SeasonDTO];
    };

    public type BalancesDTO = {
        potAccountBalance: Nat64;
        userBalances: [UserBalanceDTO];
        totalEntries: Nat64;
    };

    public type UserBalanceDTO = {
        principalName: Text;
        displayName: Text;
        balance: Nat64;
    };

    public type GetBalancesDTO = {
        page: Nat32;
        count: Nat16;
    };

    public type CorrectPredictionsDTO = {
        seasonName: Text;
        homeTeamName: Text;
        awayTeamName: Text;
        homeGoals: Nat8;
        awayGoals: Nat8;
        correctUsers: [ProfileDTO];
        totalEntries: Nat64;
    };

    public type GetCorrectPredictionsDTO = {
        seasonId: Nat16;
        gameweekNumber: Nat8;
        fixtureId: Nat32;
        page: Nat32;
        count: Nat16;
    };

    public type PayoutDTO = {
        activeSeasonName: Text;
        activeGameweekNumber: Nat8;
        potAccountBalance: Nat64;
        adminFee: Nat64;
        gameweekPot: Nat64;
        winnerCount: Nat64;
        winnerShare: Nat64;
    };

    public type FixturesDTO = {
        seasonName: Text;
        fixtures: [FixtureDTO];
        teams: [TeamDTO];
    };

    public type GetFixturesDTO = {
        seasonId: Nat16;
        gameweekNumber: Nat8;
    };

    public type AddFixtureDTO = {
        seasonId: Nat16;
        gameweekNumber: Nat8;
        homeTeamId: Nat16;
        awayTeamId: Nat16;
    };

    public type GetFixtureDTO = {
        teams: [TeamDTO];
        status: Nat8;
        homeScore: Nat8;
        awayScore: Nat8;
    };

    public type UpdateFixtureDTO = {
        seasonId: Nat16;
        gameweekNumber: Nat8;
        fixtureId: Nat32;
        homeTeamId: Nat16;
        awayTeamId: Nat16;
        status: Nat8;
        homeGoals: Nat8;
        awayGoals: Nat8;
    };

    public type DeleteFixtureDTO = {
        seasonId: Nat16;
        gameweekNumber: Nat8;
        fixtureId: Nat32;
    };

    public type SeasonsDTO = {
        seasons: [SeasonDTO];
    };

    public type CreateSeasonDTO = {
        seasonName: Text;
        seasonYear: Nat16;
    };

    public type UpdateSeasonDTO = {
        seasonId: Nat16;
        seasonName: Text;
        seasonYear: Nat16;
    };

    public type DeleteSeasonDTO = {
        seasonId: Nat16;
    };

    public type FixtureDTO = {
        fixtureId: Nat32;
        homeTeamId: Nat16;
        awayTeamId: Nat16;
        homeTeamName: Text;
        awayTeamName: Text;
        homeTeamGoals: Nat8;
        awayTeamGoals: Nat8;
        homeTeamPrediction: Nat8;
        awayTeamPrediction: Nat8;
        correct: Bool;
        status: Nat8;
    };

    public type SeasonDTO = {
        seasonId: Nat16;
        seasonName: Text;
        seasonYear: Nat16;
        gameweeks: [GameweekDTO];
    };

    public type UpdateGameweekStatusDTO = {
        seasonId: Nat16;
        gameweekNumber: Nat8;
        status: Nat8;
    };

    public type TeamsDTO = {
        teams: [TeamDTO];
    };

    public type CreateTeamDTO = {
        teamName: Text;
    };

    public type UpdateTeamDTO = {
        teamId: Nat16;
        teamName: Text;
    };

    public type DeleteTeamDTO = {
        teamId: Nat16;
    };

    public type GameweekDTO = {
        gameweekNumber: Nat8;
        sweepstakeEntered: Bool;
        correctScores: Nat8;
        totalFixtures: Nat8;
        winnings: Nat64;
    };

    public type ProfileDTO = {
        principalName: Text;
        depositAddress: Blob;
        displayName: Text;
        walletAddress: Text;
        balance: Nat64;
    };

    public type TeamDTO = {
        teamId: Nat16;
        teamName: Text;
    };

}
