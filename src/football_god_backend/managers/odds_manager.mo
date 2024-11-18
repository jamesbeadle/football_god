import T "../types/app_types";
import Base "../types/base_types";
import FootballTypes "../types/football_types";
import BettingTypes "../types/betting_types";
import Result "mo:base/Result";
import RequestDTOs "../dtos/request_DTOs";
import ResponseDTOs "../dtos/response_DTOs";

module {

  public class OddsManager() {

    private var bettableLeagueFixtureIds: [(FootballTypes.LeagueId, [FootballTypes.FixtureId])] = [];
    private var cachedCalculatedOdds: [(FootballTypes.LeagueId, [(FootballTypes.FixtureId, BettingTypes.MatchOdds)])] = [];

    public func getStableBettableLeagueFixtureIds() : [(FootballTypes.LeagueId, [FootballTypes.FixtureId])] {
      return bettableLeagueFixtureIds;
    };

    public func setStableBettableLeagueFixtureIds(stable_bettable_league_fixture_ids: [(FootballTypes.LeagueId, [FootballTypes.FixtureId])]){
      bettableLeagueFixtureIds := stable_bettable_league_fixture_ids;
    };

    public func setFixtureToActive(fixtureId: FootballTypes.FixtureId) : async Result.Result<(), T.Error> {
      //add active fixture id
      return #err(#NotFound);
    };
    
    public func setFixtureToComplete(fixtureId: FootballTypes.FixtureId) : async Result.Result<(), T.Error> {
      //remove active fixture id
      //update related bets
        //payout winning bets
      
      return #err(#NotFound);
    };

    public func getBettableLeagueFixtures(leagueId: FootballTypes.LeagueId) : Result.Result<[ResponseDTOs.BettableFixtureDTO], T.Error> {
      
      //include high level odds for win lose and draw based on current data
      return #err(#NotFound);
    };

    public func getBettableFixture(leagueId: FootballTypes.LeagueId, fixtureId: FootballTypes.FixtureId) : Result.Result<[ResponseDTOs.MatchOddsDTO], T.Error> {
      
      //include complete range of odds
      return #err(#NotFound);
    };
    

    //TODO: Complete for betting
    /*
    public func getEventOdds(eventId: T.EventId, homeTeamData: T.HomeTeamData, awayTeamData: T.AwayTeamData) : async DTOs.LiveOddsDTO {
      
      //CORRECT RESULT CALCS:
      var chanceOfHomeWin: Float = 1;
      var chanceOfAwayWin: Float = 1;
      var chanceOfDraw: Float = 1;

      //check last 6 games for home team
      //check last 6 home games for home team
      //check prior results for home team against 2 teams above and below away team

      //from this adjust the chance of home team win

      //adjust for away team

      //compute draw odds
      
      
      
      //CORRECT SCORE ODDS:

      //look at the most common results the home team has been involved in the last 6 games
      //look at the most common results the away team has been involved in the last 6 games
      //look at the scores for the home team against teams positioned 2 places above and below the away team
      //look at the scores for the away team against teams positioned 2 places above and below the home team


      
      
      return {
        eventId: T.EventId;
        correctResultOdds: ResultOddsDTO;
        correctScoreOdds: [ScoreOddsDTO];
        firstGoalScorerOdds: [PlayerOddsDTO];
        anytimeGoalScorerOdds: [PlayerOddsDTO];
        score2OrMoreOdds:  [PlayerOddsDTO];
        score3OrMoreOdds:  [PlayerOddsDTO];
        scoreFreekickOdds:  [PlayerOddsDTO];
        missPenaltyOdds:  [PlayerOddsDTO];
        yellowCardOdds:  [PlayerOddsDTO];
        redCardOdds: [PlayerOddsDTO];
        scorecastOdds: [ScorecastOddsDTO];
      };
    };
    */
  };
};
