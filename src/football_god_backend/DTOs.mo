module DTOs {
   
    public type HomeDTO = {
        systemUpdating: Bool;
        activeSeasonName: Text;
        activeGameweekNumber: Nat8;
        fixtures: [FixtureDTO];
        gameweekStatus: Nat8;
        hasPredictions: Bool;
        principalName: Text;
        activeSeasonId: Nat16;
    };

    public type GameweekPotDTO = {
        gameweekPot: Nat64;
    };

    public type PlayDTO = {
        activeSeasonName: Text;
        activeSeasonId: Nat16;
        activeGameweekNumber: Nat8;
        fixtures: [FixtureDTO];
        sweepstakePaid: Bool;
        userId: Text;
    };

    public type AccountBalanceDTO = {
        accountBalance: Nat64;
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

    public type LeaderBoardDTO = {
        seasons: [SeasonDTO];
        activeSeasonId: Nat16;
        activeSeasonName: Text;
        activeGameweekNumber: Nat8;
        leaderboardEntries: [LeaderboardEntryDTO];
        totalEntries: Nat64;
        totalPot: Nat64;
        winningShare: Nat64;
        status: Nat8;
    };

    public type LeaderboardEntryDTO = {
        principalName: Text;
        position: Text;
        displayName: Text;
        correctScores: Nat8;
        totalFixtures: Nat8;
        enteredSweepstake: Bool;
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

    public type PayoutDTO = {
        activeSeasonName: Text;
        activeGameweekNumber: Nat8;
        potAccountBalance: Nat64;
        adminFee: Nat64;
        gameweekPot: Nat64;
        winnerCount: Nat64;
        winnerShare: Nat64;
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
    };

    public type CorrectPredictionsDTO = {
        seasonName: Text;
        seasonId: Nat16;
        gameweekNumber: Nat8;
        homeTeamName: Text;
        awayTeamName: Text;
        homeTeamGoals: Nat8;
        awayTeamGoals: Nat8;
        predictions: [CorrectPredictionDTO];
        totalEntries: Nat64;
    };

    public type CorrectPredictionDTO = {
        principalName: Text;
        displayName: Text;
    };

}
