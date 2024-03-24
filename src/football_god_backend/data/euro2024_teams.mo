import T "../types";

module {

  public class Euro2024Fixtures() {
    public let fixtures : [T.Euro2024Fixture] = [
      {
        id = 1;
        homeTeamId = 1;
        awayTeamId = 2;
        homeGoals  = 0;
        awayGoals = 0;
        status = 0;
        stage = #GroupStage;
        group = ?#A;
      }
    ];
  };
};
