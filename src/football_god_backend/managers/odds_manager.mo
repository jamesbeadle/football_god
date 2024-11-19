import T "../types/app_types";
import Base "../types/base_types";
import FootballTypes "../types/football_types";
import BettingTypes "../types/betting_types";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Option "mo:base/Option";
import Buffer "mo:base/Buffer";
import Iter "mo:base/Iter";
import RequestDTOs "../dtos/request_DTOs";
import ResponseDTOs "../dtos/response_DTOs";

module {

  public class OddsManager() {

    private var bettableLeagueFixtureIds: [(FootballTypes.LeagueId, [FootballTypes.FixtureId])] = [];
    private var matchOddsCache: [(FootballTypes.LeagueId, [(FootballTypes.FixtureId, BettingTypes.MatchOdds)])] = [];

    public func addBettableLeagueFixture(leagueId: FootballTypes.LeagueId, fixtureId: FootballTypes.FixtureId) : async Result.Result<(), T.Error> {
      
      let fixtureLeagueEntry = Array.find<(FootballTypes.LeagueId, [FootballTypes.FixtureId])>(bettableLeagueFixtureIds, func(entry: (FootballTypes.LeagueId, [FootballTypes.FixtureId])) : Bool {
        entry.0 == leagueId
      });

      switch(fixtureLeagueEntry){
        case (?foundLeagueEntry){
          let fixtureAlreadyExists = Option.isSome(Array.find<FootballTypes.FixtureId>(foundLeagueEntry.1, func(leagueFixtureId: FootballTypes.FixtureId) : Bool {
            leagueFixtureId == fixtureId;
          }));
          if(fixtureAlreadyExists){
            return #err(#AlreadyExists);
          };
          let updatedFixtureIdsBuffer = Buffer.fromArray<FootballTypes.FixtureId>(foundLeagueEntry.1);
          updatedFixtureIdsBuffer.add(fixtureId);
          bettableLeagueFixtureIds := Array.map<(FootballTypes.LeagueId, [FootballTypes.FixtureId]),(FootballTypes.LeagueId, [FootballTypes.FixtureId])>(bettableLeagueFixtureIds, func(leagueFixturesEntry: (FootballTypes.LeagueId, [FootballTypes.FixtureId])) {
            if(leagueFixturesEntry.0 == leagueId) {
              let updatedFixtureIdsBuffer = Buffer.fromArray<FootballTypes.FixtureId>(leagueFixturesEntry.1);
              updatedFixtureIdsBuffer.add(fixtureId);
              return (leagueFixturesEntry.0, Buffer.toArray(updatedFixtureIdsBuffer));
            } else { return leagueFixturesEntry };
          });
          return #ok();
        };
        case (null){
          let bettableLeagueFixtureIdsBuffer = Buffer.fromArray<(FootballTypes.LeagueId, [FootballTypes.FixtureId])>(bettableLeagueFixtureIds);
          bettableLeagueFixtureIdsBuffer.add(leagueId, [fixtureId]);
          bettableLeagueFixtureIds := Buffer.toArray(bettableLeagueFixtureIdsBuffer);
          return #ok();
        }
      };
    };


    public func removeBettableLeagueFixture(leagueId: FootballTypes.LeagueId, fixtureId: FootballTypes.FixtureId) : async Result.Result<(), T.Error> {
      return #err(#NotFound); //TODO
    };

    public func getBettableLeagueFixtures(leagueId: FootballTypes.LeagueId) : Result.Result<[ResponseDTOs.BettableFixtureDTO], T.Error> {
      
      //include high level odds for win lose and draw based on current cached data
      return #err(#NotFound);
    };

    public func getBettableFixture(leagueId: FootballTypes.LeagueId, fixtureId: FootballTypes.FixtureId) : Result.Result<[ResponseDTOs.MatchOddsDTO], T.Error> {
      
      //include complete range of odds
      return #err(#NotFound);
    };

    public func recalculate(leagueId: FootballTypes.LeagueId) : async () {
      
      let currentLeagueFixtureIdsResult = Array.find<(FootballTypes.LeagueId, [FootballTypes.FixtureId])>(bettableLeagueFixtureIds, 
        func(entry: (FootballTypes.LeagueId, [FootballTypes.FixtureId])) : Bool {
          entry.0 == leagueId
      });

      switch(currentLeagueFixtureIdsResult){
        case (?fixtureIdsEntry){
          for(fixtureId in Iter.fromArray(fixtureIdsEntry.1)){

            //loop through every player in a squad to offer odds
            
            let anyAssistPlayerOdds: [BettingTypes.PlayerSelectionOdds] = [];
            let anytimeScorersOdds : [BettingTypes.PlayerSelectionOdds] = [];
            let bothTeamsToScoreOdds : BettingTypes.YesNoSelectionOdds = {
              noOdds = 0; 
              yesOdds = 0;
            };
            let bothTeamsToScoreAndWinnerOdds : [BettingTypes.ClubAndYesNoSelectionOdds] = [];
            let correctResultsOdds : BettingTypes.TeamSelectionOdds = {
              awayOdds = 0; 
              drawOdds = 0; 
              homeOdds = 0;
            };
            let correctScoresOdds : [BettingTypes.ScoreSelectionOdds] = [];
            let firstAssistersOdds : [BettingTypes.PlayerSelectionOdds] = [];
            let firstGoalscorersOdds : [BettingTypes.PlayerSelectionOdds] = [];
            let goalsOverUnderOdds : BettingTypes.OverUnderSelectionOdds = {
              awayOdds = []; 
              homeOdds = [];
            };
            let halfTimeFullTimeResultOdds : [BettingTypes.SplitHalfTeamSelectionOdds] = [];
            let halfTimeScoresOdds : [BettingTypes.ScoreSelectionOdds] = [];
            let lastAssistOdds : [BettingTypes.PlayerSelectionOdds] = [];
            let lastGoalscorersOdds : [BettingTypes.PlayerSelectionOdds] = [];
            let penaltyMissedOdds : BettingTypes.TeamSelectionOdds = {
              awayOdds = 0; 
              drawOdds = 0; 
              homeOdds = 0;
            };
            let penaltyMissersOdds : [BettingTypes.PlayerSelectionOdds] = [];
            let redCardsOdds : [BettingTypes.PlayerSelectionOdds] = [];
            let scoresBraceOdds : [BettingTypes.PlayerSelectionOdds] = [];
            let scoresHatTrickOdds : [BettingTypes.PlayerSelectionOdds] = [];
            let yellowCardsOdds : [BettingTypes.PlayerSelectionOdds] = [];

            let matchOdds: BettingTypes.MatchOdds = {
              fixtureId = fixtureId;
              anytimeAssist = anyAssistPlayerOdds;
              anytimeScorers = anytimeScorersOdds;
              bothTeamsToScore = bothTeamsToScoreOdds;
              bothTeamsToScoreAndWinner = bothTeamsToScoreAndWinnerOdds;
              correctResults = correctResultsOdds;
              correctScores = correctScoresOdds;
              firstAssisters = firstAssistersOdds;
              firstGoalscorers = firstGoalscorersOdds;
              goalsOverUnder = goalsOverUnderOdds;
              halfTimeFullTimeResult = halfTimeFullTimeResultOdds;
              halfTimeScores = halfTimeScoresOdds;
              lastAssist = lastAssistOdds;
              lastGoalscorers = lastGoalscorersOdds;
              penaltyMissed = penaltyMissedOdds;
              penaltyMissers = penaltyMissersOdds;
              redCards = redCardsOdds;
              scoresBrace = scoresBraceOdds;
              scoresHatTrick = scoresHatTrickOdds;
              yellowCards = yellowCardsOdds;
            };

            storeMatchOdds(matchOdds);
          };
        };
        case (null){ }
      };      
    };

    private func storeMatchOdds(matchOdds: BettingTypes.MatchOdds){

      //TODO: Store match odds in cache
      //check if exists

      //if not add match odds

      //if so replace match odds
    };

    //Stable storage
    public func getStableBettableLeagueFixtureIds() : [(FootballTypes.LeagueId, [FootballTypes.FixtureId])] {
      return bettableLeagueFixtureIds;
    };

    public func setStableBettableLeagueFixtureIds(stable_bettable_league_fixture_ids: [(FootballTypes.LeagueId, [FootballTypes.FixtureId])]){
      bettableLeagueFixtureIds := stable_bettable_league_fixture_ids;
    };

    public func getStableMatchOddsCache(): [(FootballTypes.LeagueId, [(FootballTypes.FixtureId, BettingTypes.MatchOdds)])]{
      return matchOddsCache;
    };

    public func setStableMatchOddsCache(stable_match_odds_cache: [(FootballTypes.LeagueId, [(FootballTypes.FixtureId, BettingTypes.MatchOdds)])]){
      matchOddsCache := stable_match_odds_cache;
    };

  };
};
