import T "../types/app_types";
import FootballTypes "../types/football_types";
import BettingTypes "../types/betting_types";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Option "mo:base/Option";
import Buffer "mo:base/Buffer";
import Iter "mo:base/Iter";
import ResponseDTOs "../dtos/response_DTOs";
import Environment "../environment";
import RequestDTOs "../dtos/request_DTOs";
import OddsGenerator "odds_generator";

module {

  public class OddsManager() {

    private var bettableLeagueFixtureIds: [(FootballTypes.LeagueId, [FootballTypes.FixtureId])] = [(1, [125])];
    private var matchOddsCache: [(FootballTypes.LeagueId, [(FootballTypes.FixtureId, BettingTypes.MatchOdds)])] = [];
    private let oddsGenerator = OddsGenerator.OddsGenerator();

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
  
    public func getLeagueFixtures(leagueId: FootballTypes.LeagueId) : [ResponseDTOs.HomePageFixtureDTO] {
      let leagueFixturesResult = Array.find<(FootballTypes.LeagueId, [(FootballTypes.FixtureId, BettingTypes.MatchOdds)])>(matchOddsCache, func(entry: (FootballTypes.LeagueId, [(FootballTypes.FixtureId, BettingTypes.MatchOdds)])) : Bool {
        entry.0 == leagueId
      });

      switch(leagueFixturesResult){
        case (?leagueFixtures){
          return Array.map<(FootballTypes.FixtureId, BettingTypes.MatchOdds), ResponseDTOs.HomePageFixtureDTO>(leagueFixtures.1, func(entry: (FootballTypes.FixtureId, BettingTypes.MatchOdds)){
            
            let matchOdds = entry.1;
            
            return {
              awayOdds = matchOdds.correctResults.awayOdds;
              drawOdds = matchOdds.correctResults.drawOdds;
              fixtureId = matchOdds.fixtureId;
              homeOdds = matchOdds.correctResults.homeOdds;
              leagueId = matchOdds.leagueId;
            };
          });
        };
        case (null){}
      };
      return [];
    };


    public func removeBettableLeagueFixture(leagueId: FootballTypes.LeagueId, fixtureId: FootballTypes.FixtureId) : async Result.Result<(), T.Error> {
      return #err(#NotFound); //TODO
    };

    public func getBettableLeagueFixtures(leagueId: FootballTypes.LeagueId) : Result.Result<[ResponseDTOs.BettableFixtureDTO], T.Error> {
      
      let bettableFixtureIdsResult = Array.find<(FootballTypes.LeagueId, [FootballTypes.FixtureId])>(bettableLeagueFixtureIds, func(entry: (FootballTypes.LeagueId, [FootballTypes.FixtureId])) {
        entry.0 == leagueId;
      });

      switch(bettableFixtureIdsResult){
        case (?bettableFixtureIds){
          
          let returnBuffer = Buffer.fromArray<ResponseDTOs.BettableFixtureDTO>([]);

          for(fixtureId in Iter.fromArray(bettableFixtureIds.1)){
            returnBuffer.add({
              correctResults = {
                awayOdds = 0; //TODO: Get from cache odds for fixture
                drawOdds = 0; //TODO: Get from cache odds for fixture
                homeOdds = 0; //TODO: Get from cache odds for fixture
              }; 
              fixtureId = fixtureId;
            })
          };
          
        };
        case (null){
          
        }
      };

      //include high level odds for win lose and draw based on current cached data
      return #err(#NotFound);
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
        getClubs : shared query (leagueId: FootballTypes.LeagueId) -> async Result.Result<[FootballTypes.Club], T.Error>;
        getPlayers : shared query (leagueId: FootballTypes.LeagueId) -> async Result.Result<[ResponseDTOs.PlayerDTO], T.Error>;
     };
      let fixturesResult = await data_canister.getFixtures(leagueId);
      let clubsResult = await data_canister.getClubs(leagueId);
      let playersResult = await data_canister.getPlayers(leagueId);
      
      
      switch(fixturesResult){
        case (#ok fixtures){
          switch(clubsResult){
            case (#ok clubs){
              switch(playersResult){
                case (#ok players){
                  let currentLeagueFixtureIdsResult = Array.find<(FootballTypes.LeagueId, [FootballTypes.FixtureId])>(bettableLeagueFixtureIds, 
                    func(entry: (FootballTypes.LeagueId, [FootballTypes.FixtureId])) : Bool {
                      entry.0 == leagueId
                  });

                  switch(currentLeagueFixtureIdsResult){
                    case (?fixtureIdsEntry){
                      for(fixtureId in Iter.fromArray(fixtureIdsEntry.1)){

                        let foundFixture = Array.find<ResponseDTOs.FixtureDTO>(fixtures, func(entry: ResponseDTOs.FixtureDTO) : Bool {
                          entry.id == fixtureId;
                        });

                        switch(foundFixture){
                          case (?fixture){
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
                                odds = oddsGenerator.getFirstAssistOdds(player, player.clubId == fixture.homeClubId);
                              });

                              firstGoalscorersOddsBuffer.add({
                                playerId = player.id;
                                odds = oddsGenerator.getFirstGoalscorerOdds(player, player.clubId == fixture.homeClubId);
                              });

                              anytimeAssistOddsBuffer.add({
                                playerId = player.id;
                                odds = oddsGenerator.getAnytimeAssistOdds(player, player.clubId == fixture.homeClubId);
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
                              fixtureId = fixtureId;
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
                          case (null){}
                        };
                      };
                    };
                    case (null){ }
                  }; 


                };
                case (#err _){};
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
