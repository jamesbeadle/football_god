import T "../types/app_types";
import FootballTypes "../types/football_types";
import BettingTypes "../types/betting_types";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Option "mo:base/Option";
import Buffer "mo:base/Buffer";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";
import Time "mo:base/Time";
import Nat16 "mo:base/Nat16";
import Nat "mo:base/Nat";
import ResponseDTOs "../dtos/response_DTOs";
import Environment "../environment";
import RequestDTOs "../dtos/request_DTOs";
import OddsGenerator "odds_generator";

module {

  public class OddsManager() {

    private var matchOddsCache: [(FootballTypes.LeagueId, [(FootballTypes.FixtureId, BettingTypes.MatchOdds)])] = [];
    private let oddsGenerator = OddsGenerator.OddsGenerator();
  
    public func getHomepageLeagueFixtures(leagueId: FootballTypes.LeagueId) : [ResponseDTOs.HomePageFixtureDTO] {
       
      let matchOddsResult = Array.find<(FootballTypes.LeagueId, [(FootballTypes.FixtureId, BettingTypes.MatchOdds)])>(matchOddsCache, func(matchOddsCacheEntry: (FootballTypes.LeagueId, [(FootballTypes.FixtureId, BettingTypes.MatchOdds)])) : Bool {
        matchOddsCacheEntry.0 == leagueId;
      });

      switch(matchOddsResult){
        case (?foundMatchOdds){
          return Array.map<(FootballTypes.FixtureId, BettingTypes.MatchOdds), ResponseDTOs.HomePageFixtureDTO>(foundMatchOdds.1, func (oddsEntry: (FootballTypes.FixtureId, BettingTypes.MatchOdds)) {
            let matchOdds = oddsEntry.1;
            return {
              leagueId = matchOdds.leagueId;
              gameweek = matchOdds.gameweek;
              fixtureId = matchOdds.fixtureId;
              homeOdds = matchOdds.correctResults.homeOdds;
              drawOdds = matchOdds.correctResults.drawOdds;
              awayOdds = matchOdds.correctResults.awayOdds;
            };
          });
        };
        case (null){
          return [];
        }
      };
    };
    
    public func getMatchOdds(leagueId: FootballTypes.LeagueId, fixtureId: FootballTypes.FixtureId) : Result.Result<ResponseDTOs.MatchOddsDTO, T.Error> {
      
      let leagueOddsCache = Array.find<(FootballTypes.LeagueId, [(FootballTypes.FixtureId, BettingTypes.MatchOdds)])>(matchOddsCache, 
          func(entry: (FootballTypes.LeagueId, [(FootballTypes.FixtureId, BettingTypes.MatchOdds)])) : Bool {
            entry.0 == leagueId;
      });

      switch(leagueOddsCache){
        case (?foundLeagueOdds){
          let fixtureOddsResult = Array.find<(FootballTypes.FixtureId, BettingTypes.MatchOdds)>(foundLeagueOdds.1, func(entry: (FootballTypes.FixtureId, BettingTypes.MatchOdds)) : Bool {
            entry.0 == fixtureId;
          });
          switch(fixtureOddsResult){
            case (?foundFixtureOdds){
              return #ok(foundFixtureOdds.1);
            };
            case (null){};
          };
        };
        case (null){};
      };
      return #err(#NotFound);
    };

    public func recalculate(leagueId: FootballTypes.LeagueId) : async () {
      let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
        getFixtures : shared query (leagueId: FootballTypes.LeagueId) -> async Result.Result<[ResponseDTOs.FixtureDTO], T.Error>;
        getPlayers : shared query (leagueId: FootballTypes.LeagueId) -> async Result.Result<[ResponseDTOs.PlayerDTO], T.Error>;
     };
      let fixturesResult = await data_canister.getFixtures(leagueId);
      let playersResult = await data_canister.getPlayers(leagueId);

      Debug.print("Recalculating league " # Nat16.toText(leagueId));
      
      switch(fixturesResult){
        case (#ok fixtures){
          let futureFixtures = Array.filter<ResponseDTOs.FixtureDTO>(fixtures, func(fixtureEntry: ResponseDTOs.FixtureDTO){
            fixtureEntry.status == #Unplayed and fixtureEntry.kickOff > Time.now();
          }); 
          switch(playersResult){
            case (#ok players){


               Debug.print("Recalculating league " # Nat.toText(Array.size(futureFixtures)) # " future fixtures");
              
              for(fixture in Iter.fromArray(futureFixtures)){

                let fixturePlayers = Array.filter<ResponseDTOs.PlayerDTO>(players, func(player: ResponseDTOs.PlayerDTO){
                  player.clubId == fixture.homeClubId or player.clubId == fixture.awayClubId
                });
                
                let firstAssistersOddsBuffer = Buffer.fromArray<BettingTypes.PlayerSelectionOdds>([]);
                let firstGoalscorersOddsBuffer = Buffer.fromArray<BettingTypes.PlayerSelectionOdds>([]);
                let anytimeAssistOddsBuffer = Buffer.fromArray<BettingTypes.PlayerSelectionOdds>([]);
                let anytimeScorerOddsBuffer = Buffer.fromArray<BettingTypes.PlayerSelectionOdds>([]);
                let lastAssistOddsBuffer = Buffer.fromArray<BettingTypes.PlayerSelectionOdds>([]);
                let lastGoalscorerOddsBuffer = Buffer.fromArray<BettingTypes.PlayerSelectionOdds>([]);
                let scoresBraceOddsBuffer = Buffer.fromArray<BettingTypes.PlayerSelectionOdds>([]);
                let scoresHatTrickOddsBuffer = Buffer.fromArray<BettingTypes.PlayerSelectionOdds>([]);
                let penaltyMissersOddsBuffer = Buffer.fromArray<BettingTypes.PlayerSelectionOdds>([]);
                let yellowCardsOddsBuffer = Buffer.fromArray<BettingTypes.PlayerSelectionOdds>([]);
                let redCardsOddsBuffer = Buffer.fromArray<BettingTypes.PlayerSelectionOdds>([]);
                
                for(player in Iter.fromArray(fixturePlayers)){

                  firstAssistersOddsBuffer.add({
                    playerId = player.id;
                    odds = oddsGenerator.getFirstAssistOdds(fixtures, fixture, player);
                  });

                  firstGoalscorersOddsBuffer.add({
                    playerId = player.id;
                    odds = oddsGenerator.getFirstGoalscorerOdds(player, player.clubId == fixture.homeClubId);
                  });

                  anytimeAssistOddsBuffer.add({
                    playerId = player.id;
                    odds = oddsGenerator.getAnytimeAssistOdds(fixtures, fixture, player);
                  });

                  anytimeScorerOddsBuffer.add({
                    playerId = player.id;
                    odds = oddsGenerator.getAnytimeScorerOdds(player, player.clubId == fixture.homeClubId);
                  });

                  lastAssistOddsBuffer.add({
                    playerId = player.id;
                    odds = oddsGenerator.getLastAssistOdds(player, player.clubId == fixture.homeClubId);
                  });

                  lastGoalscorerOddsBuffer.add({
                    playerId = player.id;
                    odds = oddsGenerator.getLastScorerOdds(player, player.clubId == fixture.homeClubId);
                  });

                  scoresBraceOddsBuffer.add({
                    playerId = player.id;
                    odds = oddsGenerator.getScoresBraceOdds(player, player.clubId == fixture.homeClubId);
                  });

                  scoresHatTrickOddsBuffer.add({
                    playerId = player.id;
                    odds = oddsGenerator.getScoreHatrickOdds(player, player.clubId == fixture.homeClubId);
                  });

                  penaltyMissersOddsBuffer.add({
                    playerId = player.id;
                    odds = oddsGenerator.getMissesPenaltyOdds(player, player.clubId == fixture.homeClubId);
                  });

                  yellowCardsOddsBuffer.add({
                    playerId = player.id;
                    odds = oddsGenerator.getYellowCardsOdds(player, player.clubId == fixture.homeClubId);
                  });

                  redCardsOddsBuffer.add({
                    playerId = player.id;
                    odds = oddsGenerator.getRedCardsOdds(player, player.clubId == fixture.homeClubId);
                  });

                };
                
                
                let bothTeamsToScoreOdds = oddsGenerator.getBothTeamsToScoreOdds();
                let bothTeamsToScoreAndWinnerOdds = oddsGenerator.getBothTeamsToScoreAndWinnerOdds();
                let correctResultsOdds = oddsGenerator.getCorrectResultOdds();
                let correctScoresOdds = oddsGenerator.getCorrectScoreOdds();
                let goalsOverUnderOdds = oddsGenerator.getGoalsOverUnderOdds();
                let halfTimeFullTimeResultOdds = oddsGenerator.getHalfTimeFullTimeResultOdds();
                let halfTimeScoresOdds = oddsGenerator.getHalfTimeScoreOdds();
                let penaltyMissedOdds = oddsGenerator.getPenaltyMissedOdds();

                let matchOdds: BettingTypes.MatchOdds = {
                  leagueId = leagueId;
                  gameweek = fixture.gameweek;
                  fixtureId = fixture.id;
                  anytimeAssist = Buffer.toArray(anytimeAssistOddsBuffer);
                  anytimeScorers = Buffer.toArray(anytimeScorerOddsBuffer);
                  bothTeamsToScore = bothTeamsToScoreOdds;
                  bothTeamsToScoreAndWinner = bothTeamsToScoreAndWinnerOdds;
                  correctResults = correctResultsOdds;
                  correctScores = correctScoresOdds;
                  firstAssisters = Buffer.toArray(firstAssistersOddsBuffer);
                  firstGoalscorers = Buffer.toArray(firstGoalscorersOddsBuffer);
                  goalsOverUnder = goalsOverUnderOdds;
                  halfTimeFullTimeResult = halfTimeFullTimeResultOdds;
                  halfTimeScores = halfTimeScoresOdds;
                  lastAssist = Buffer.toArray(lastAssistOddsBuffer);
                  lastGoalscorers = Buffer.toArray(lastGoalscorerOddsBuffer);
                  penaltyMissed = penaltyMissedOdds;
                  penaltyMissers = Buffer.toArray(penaltyMissersOddsBuffer);
                  redCards = Buffer.toArray(redCardsOddsBuffer);
                  scoresBrace = Buffer.toArray(scoresBraceOddsBuffer);
                  scoresHatTrick = Buffer.toArray(scoresHatTrickOddsBuffer);
                  yellowCards = Buffer.toArray(yellowCardsOddsBuffer);
                };
                storeMatchOdds(matchOdds);
              };
            };
            case (#err _){};
          };
        };
        case (#err _){}
      };
           
    };

    private func storeMatchOdds(matchOdds: BettingTypes.MatchOdds){
      
      let existingLeague = Array.find<(FootballTypes.LeagueId, [(FootballTypes.FixtureId, BettingTypes.MatchOdds)])>(matchOddsCache, func(entry: (FootballTypes.LeagueId, [(FootballTypes.FixtureId, BettingTypes.MatchOdds)])) : Bool {
        entry.0 == matchOdds.leagueId
      });

      switch(existingLeague){
        case (?foundLeague){
          let existingFixtureOdds = Array.find<(FootballTypes.FixtureId, BettingTypes.MatchOdds)>(foundLeague.1, func(fixtureEntry: (FootballTypes.FixtureId, BettingTypes.MatchOdds)) : Bool {
            fixtureEntry.0 == matchOdds.fixtureId;
          });

          switch(existingFixtureOdds){
            case (?_){
              replaceMatchOdds(matchOdds);
            };
            case (null){
              addNewMatchOdds(matchOdds);
            }
          };
        };
        case (null){
          addInitialLeagueMatchOdds(matchOdds);
        };
      };
    };

    private func replaceMatchOdds(matchOdds: BettingTypes.MatchOdds){
      matchOddsCache := Array.map<(FootballTypes.LeagueId, [(FootballTypes.FixtureId, BettingTypes.MatchOdds)]), (FootballTypes.LeagueId, [(FootballTypes.FixtureId, BettingTypes.MatchOdds)])>(matchOddsCache, func(entry: (FootballTypes.LeagueId, [(FootballTypes.FixtureId, BettingTypes.MatchOdds)])){
        if(entry.0 == matchOdds.leagueId){
          return (entry.0, Array.map<(FootballTypes.FixtureId, BettingTypes.MatchOdds), (FootballTypes.FixtureId, BettingTypes.MatchOdds)>(entry.1, func(matchOddsEntry: (FootballTypes.FixtureId, BettingTypes.MatchOdds)){
            if(matchOddsEntry.0 == matchOdds.fixtureId){
              return (matchOddsEntry.0, matchOdds);
            } else {
              return matchOddsEntry;
            };
          }));
        } else {
          return entry;
        };
      });
    };

    private func addNewMatchOdds(matchOdds: BettingTypes.MatchOdds){
      matchOddsCache := Array.map<(FootballTypes.LeagueId, [(FootballTypes.FixtureId, BettingTypes.MatchOdds)]), (FootballTypes.LeagueId, [(FootballTypes.FixtureId, BettingTypes.MatchOdds)])>(matchOddsCache, func(entry: (FootballTypes.LeagueId, [(FootballTypes.FixtureId, BettingTypes.MatchOdds)])){
        if(entry.0 == matchOdds.leagueId){
          let leagueOddsBuffer = Buffer.fromArray<(FootballTypes.FixtureId, BettingTypes.MatchOdds)>(entry.1);
          leagueOddsBuffer.add((matchOdds.fixtureId, matchOdds));
          return (entry.0, Buffer.toArray(leagueOddsBuffer));
        } else {
          return entry;
        };
      });
    };

    private func addInitialLeagueMatchOdds(matchOdds: BettingTypes.MatchOdds){
      let matchOddsCacheBuffer = Buffer.fromArray<(FootballTypes.LeagueId, [(FootballTypes.FixtureId, BettingTypes.MatchOdds)])>(matchOddsCache);
      matchOddsCacheBuffer.add(matchOdds.leagueId, [(matchOdds.fixtureId, matchOdds)]);
      matchOddsCache := Buffer.toArray(matchOddsCacheBuffer);
    };

    //Stable storage

    public func getStableMatchOddsCache(): [(FootballTypes.LeagueId, [(FootballTypes.FixtureId, BettingTypes.MatchOdds)])]{
      return matchOddsCache;
    };

    public func setStableMatchOddsCache(stable_match_odds_cache: [(FootballTypes.LeagueId, [(FootballTypes.FixtureId, BettingTypes.MatchOdds)])]){
      matchOddsCache := stable_match_odds_cache;
    };

  };
};
