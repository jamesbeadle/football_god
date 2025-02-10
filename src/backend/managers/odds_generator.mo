import BettingTypes "../types/betting_types";
import ResponseDTOs "../dtos/response_DTOs";
import BaseOdds "../utilities/BaseOdds";
import Float "mo:base/Float";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";
import FootballTypes "mo:waterway-mops/FootballTypes";

module {

  public class OddsGenerator() {

    public func getCorrectResultOdds(fixtures: [ResponseDTOs.FixtureDTO], bettingFixture: ResponseDTOs.FixtureDTO) : BettingTypes.TeamSelectionOdds{

      let finalisedHomeFixtures = Array.filter<ResponseDTOs.FixtureDTO>(fixtures, func(entry: ResponseDTOs.FixtureDTO){
        entry.status == #Finalised and
        (entry.homeClubId == bettingFixture.homeClubId or entry.awayClubId == bettingFixture.homeClubId)
      });

      let finalisedAwayFixtures = Array.filter<ResponseDTOs.FixtureDTO>(fixtures, func(entry: ResponseDTOs.FixtureDTO){
        entry.status == #Finalised and
        (entry.homeClubId == bettingFixture.awayClubId or entry.awayClubId == bettingFixture.awayClubId)
      });

      let homeWins = Array.filter<ResponseDTOs.FixtureDTO>(finalisedHomeFixtures, func(homeEntry: ResponseDTOs.FixtureDTO){
        (homeEntry.homeGoals > homeEntry.awayGoals and homeEntry.homeClubId == bettingFixture.homeClubId) or
        (homeEntry.homeGoals < homeEntry.awayGoals and homeEntry.awayClubId == bettingFixture.homeClubId);
      });

      let awayWins = Array.filter<ResponseDTOs.FixtureDTO>(finalisedAwayFixtures, func(awayEntry: ResponseDTOs.FixtureDTO){
        (awayEntry.homeGoals > awayEntry.awayGoals and awayEntry.homeClubId == bettingFixture.awayClubId) or
        (awayEntry.homeGoals < awayEntry.awayGoals and awayEntry.awayClubId == bettingFixture.awayClubId);
      });

      let homeDraws = Array.filter<ResponseDTOs.FixtureDTO>(finalisedHomeFixtures, func(homeEntry: ResponseDTOs.FixtureDTO){
        (homeEntry.homeGoals == homeEntry.awayGoals and homeEntry.homeClubId == bettingFixture.homeClubId) or
        (homeEntry.homeGoals == homeEntry.awayGoals and homeEntry.awayClubId == bettingFixture.homeClubId);
      });

      let awayDraws = Array.filter<ResponseDTOs.FixtureDTO>(finalisedAwayFixtures, func(awayEntry: ResponseDTOs.FixtureDTO){
        (awayEntry.homeGoals == awayEntry.awayGoals and awayEntry.homeClubId == bettingFixture.awayClubId) or
        (awayEntry.homeGoals == awayEntry.awayGoals and awayEntry.awayClubId == bettingFixture.awayClubId);
      });

      let totalHomePoints = (Array.size(homeWins) * 3) + Array.size(homeDraws);
      let totalAwayPoints = (Array.size(awayWins) * 3) + Array.size(awayDraws);

      let totalPossibleHomePoints = Array.size(finalisedHomeFixtures) * 3;
      let totalPossibleAwayPoints = Array.size(finalisedAwayFixtures) * 3;

      var home_odds_factor: Float = 0.25;
      var away_odds_factor: Float = 0.25;
      var draw_odds_factor: Float = 0.5;

      let homeDrawPercentage: Float = Float.fromInt(Array.size(homeDraws)) / Float.fromInt(Array.size(finalisedHomeFixtures));
      let awayDrawPercentage: Float = Float.fromInt(Array.size(awayDraws)) / Float.fromInt(Array.size(finalisedAwayFixtures));
      let homeWinPercentage: Float = (Float.fromInt(totalHomePoints) / Float.fromInt(totalPossibleHomePoints));
      let awayWinPercentage: Float = (Float.fromInt(totalAwayPoints) / Float.fromInt(totalPossibleAwayPoints));

      if(totalHomePoints > 0){
        home_odds_factor := home_odds_factor * (1 + (1 - homeWinPercentage)) * (1 + awayWinPercentage);
      };

      if(totalAwayPoints > 0){
        away_odds_factor := away_odds_factor * (1 + (1 - awayWinPercentage))  * (1 + homeWinPercentage);
      };
      
      draw_odds_factor := draw_odds_factor * (1 + (2*homeDrawPercentage)) * (1 + awayDrawPercentage);

      return {
        awayOdds = formatOdds(away_odds_factor, BaseOdds.AWAY_WIN_ODDS);
        drawOdds = formatOdds(draw_odds_factor, BaseOdds.DRAW_ODDS);
        homeOdds = formatOdds(home_odds_factor, BaseOdds.HOME_WIN_ODDS);
      }
    };
    
    public func getFirstAssistOdds(fixtures: [ResponseDTOs.FixtureDTO], bettingFixture: ResponseDTOs.FixtureDTO, player: ResponseDTOs.PlayerDTO) : Float{

      var odds_factor: Float = 1;

      let recentFixtures = Array.filter<ResponseDTOs.FixtureDTO>(fixtures, func(entry: ResponseDTOs.FixtureDTO){
        (entry.homeClubId == player.clubId or entry.awayClubId == player.clubId) and
        entry.gameweek < bettingFixture.gameweek and
        entry.gameweek > bettingFixture.gameweek - 7
      });

      let playerEventsBuffer = Buffer.fromArray<FootballTypes.PlayerEventData>([]);
      for(fixture in Iter.fromArray(recentFixtures)){
        let playerEvents = Array.filter<FootballTypes.PlayerEventData>(fixture.events, func(entry: FootballTypes.PlayerEventData) {
          return entry.playerId == player.id;
        });

        playerEventsBuffer.append(Buffer.fromArray(playerEvents));
      };

      let playeEvents = Buffer.toArray(playerEventsBuffer);

      for(event in Iter.fromArray(playeEvents)){
        if(event.eventType == #GoalAssisted){
          odds_factor := odds_factor * 0.95;
        };
      };

      let totalAppearances = Array.filter<FootballTypes.PlayerEventData>(playeEvents, func(entry: FootballTypes.PlayerEventData){
        entry.eventType == #Appearance;
      });

      if(Array.size(totalAppearances) == Array.size(recentFixtures)){
          odds_factor := odds_factor * 0.90;
      };

      let playerHomeWins = Array.filter<ResponseDTOs.FixtureDTO>(recentFixtures, func(entry: ResponseDTOs.FixtureDTO){
        entry.homeGoals > entry.awayGoals and entry.homeClubId == player.clubId;
      });

      let playerAwayWins = Array.filter<ResponseDTOs.FixtureDTO>(recentFixtures, func(entry: ResponseDTOs.FixtureDTO){
        entry.awayGoals > entry.homeGoals and entry.awayClubId == player.clubId;
      });

      let totalRecentFixtures = Array.size(recentFixtures);

      if(totalRecentFixtures > 0){
        odds_factor := odds_factor / Float.fromInt(totalRecentFixtures) * Float.fromInt(Array.size(playerHomeWins) + Array.size(playerAwayWins));
      };
      
      let onHomeTeam = player.clubId == bettingFixture.homeClubId;

      switch(player.position){
        case (#Goalkeeper){
          if(onHomeTeam){
            return formatOdds(odds_factor, BaseOdds.HOME_GOALKEEPER_FIRST_ASSIST);
          } else {
            return formatOdds(odds_factor, BaseOdds.AWAY_GOALKEEPER_FIRST_ASSIST);
          }
        };
        case (#Defender){
          if(onHomeTeam){
            return formatOdds(odds_factor, BaseOdds.HOME_DEFENDER_FIRST_ASSIST);
          } else {
            return formatOdds(odds_factor, BaseOdds.AWAY_DEFENDER_FIRST_ASSIST);
          }
        };
        case (#Midfielder){
          if(onHomeTeam){
            return formatOdds(odds_factor, BaseOdds.HOME_MIDFIELDER_FIRST_ASSIST);
          } else {
            return formatOdds(odds_factor, BaseOdds.AWAY_MIDFIELDER_FIRST_ASSIST);
          }
        };
        case (#Forward){
          if(onHomeTeam){
            return formatOdds(odds_factor, BaseOdds.HOME_FORWARD_FIRST_ASSIST);
          } else {
            return formatOdds(odds_factor, BaseOdds.AWAY_FORWARD_FIRST_ASSIST);
          }
        }
      };
      return 0;
    };
    
    public func getAnytimeAssistOdds(fixtures: [ResponseDTOs.FixtureDTO], bettingFixture: ResponseDTOs.FixtureDTO, player: ResponseDTOs.PlayerDTO) : Float{
      var odds_factor: Float = 1;

      let recentFixtures = Array.filter<ResponseDTOs.FixtureDTO>(fixtures, func(entry: ResponseDTOs.FixtureDTO){
        (entry.homeClubId == player.clubId or entry.awayClubId == player.clubId) and
        entry.gameweek < bettingFixture.gameweek and
        entry.gameweek > bettingFixture.gameweek - 7
      });

      let playerEventsBuffer = Buffer.fromArray<FootballTypes.PlayerEventData>([]);
      for(fixture in Iter.fromArray(recentFixtures)){
        let playerEvents = Array.filter<FootballTypes.PlayerEventData>(fixture.events, func(entry: FootballTypes.PlayerEventData) {
          return entry.playerId == player.id;
        });

        playerEventsBuffer.append(Buffer.fromArray(playerEvents));
      };

      let playeEvents = Buffer.toArray(playerEventsBuffer);

      for(event in Iter.fromArray(playeEvents)){
        if(event.eventType == #GoalAssisted){
          odds_factor := odds_factor * 0.95;
        };
      };

      let totalAppearances = Array.filter<FootballTypes.PlayerEventData>(playeEvents, func(entry: FootballTypes.PlayerEventData){
        entry.eventType == #Appearance;
      });

      if(Array.size(totalAppearances) == Array.size(recentFixtures)){
          odds_factor := odds_factor * 0.90;
      };

      let playerHomeWins = Array.filter<ResponseDTOs.FixtureDTO>(recentFixtures, func(entry: ResponseDTOs.FixtureDTO){
        entry.homeGoals > entry.awayGoals and entry.homeClubId == player.clubId;
      });

      let playerAwayWins = Array.filter<ResponseDTOs.FixtureDTO>(recentFixtures, func(entry: ResponseDTOs.FixtureDTO){
        entry.awayGoals > entry.homeGoals and entry.awayClubId == player.clubId;
      });

      let totalRecentFixtures = Array.size(recentFixtures);

      if(totalRecentFixtures > 0){
        odds_factor := odds_factor / Float.fromInt(totalRecentFixtures) * Float.fromInt(Array.size(playerHomeWins) + Array.size(playerAwayWins));
      };
      
      let onHomeTeam = player.clubId == bettingFixture.homeClubId;

      switch(player.position){
        case (#Goalkeeper){
          if(onHomeTeam){
            return formatOdds(odds_factor, BaseOdds.HOME_GOALKEEPER_ANYTIME_ASSIST);
          } else {
            return formatOdds(odds_factor, BaseOdds.AWAY_GOALKEEPER_ANYTIME_ASSIST);
          }
        };
        case (#Defender){
          if(onHomeTeam){
            return formatOdds(odds_factor, BaseOdds.HOME_DEFENDER_ANYTIME_ASSIST);
          } else {
            return formatOdds(odds_factor, BaseOdds.AWAY_DEFENDER_ANYTIME_ASSIST);
          }
        };
        case (#Midfielder){
          if(onHomeTeam){
            return formatOdds(odds_factor, BaseOdds.HOME_MIDFIELDER_ANYTIME_ASSIST);
          } else {
            return formatOdds(odds_factor, BaseOdds.AWAY_MIDFIELDER_ANYTIME_ASSIST);
          }
        };
        case (#Forward){
          if(onHomeTeam){
            return formatOdds(odds_factor, BaseOdds.HOME_FORWARD_ANYTIME_ASSIST);
          } else {
            return formatOdds(odds_factor, BaseOdds.AWAY_FORWARD_ANYTIME_ASSIST);
          }
        }
      };
      return 0;
    };
    
    public func getLastAssistOdds(fixtures: [ResponseDTOs.FixtureDTO], bettingFixture: ResponseDTOs.FixtureDTO, player: ResponseDTOs.PlayerDTO) : Float{
      var odds_factor: Float = 1;

      let recentFixtures = Array.filter<ResponseDTOs.FixtureDTO>(fixtures, func(entry: ResponseDTOs.FixtureDTO){
        (entry.homeClubId == player.clubId or entry.awayClubId == player.clubId) and
        entry.gameweek < bettingFixture.gameweek and
        entry.gameweek > bettingFixture.gameweek - 7
      });

      let playerEventsBuffer = Buffer.fromArray<FootballTypes.PlayerEventData>([]);
      for(fixture in Iter.fromArray(recentFixtures)){
        let playerEvents = Array.filter<FootballTypes.PlayerEventData>(fixture.events, func(entry: FootballTypes.PlayerEventData) {
          return entry.playerId == player.id;
        });

        playerEventsBuffer.append(Buffer.fromArray(playerEvents));
      };

      let playeEvents = Buffer.toArray(playerEventsBuffer);

      for(event in Iter.fromArray(playeEvents)){
        if(event.eventType == #GoalAssisted){
          odds_factor := odds_factor * 0.95;
        };
      };

      let totalAppearances = Array.filter<FootballTypes.PlayerEventData>(playeEvents, func(entry: FootballTypes.PlayerEventData){
        entry.eventType == #Appearance;
      });

      if(Array.size(totalAppearances) == Array.size(recentFixtures)){
          odds_factor := odds_factor * 0.90;
      };

      let playerHomeWins = Array.filter<ResponseDTOs.FixtureDTO>(recentFixtures, func(entry: ResponseDTOs.FixtureDTO){
        entry.homeGoals > entry.awayGoals and entry.homeClubId == player.clubId;
      });

      let playerAwayWins = Array.filter<ResponseDTOs.FixtureDTO>(recentFixtures, func(entry: ResponseDTOs.FixtureDTO){
        entry.awayGoals > entry.homeGoals and entry.awayClubId == player.clubId;
      });

      let totalRecentFixtures = Array.size(recentFixtures);

      if(totalRecentFixtures > 0){
        odds_factor := odds_factor / Float.fromInt(totalRecentFixtures) * Float.fromInt(Array.size(playerHomeWins) + Array.size(playerAwayWins));
      };
      
      let onHomeTeam = player.clubId == bettingFixture.homeClubId;

      switch(player.position){
        case (#Goalkeeper){
          if(onHomeTeam){
            return formatOdds(odds_factor, BaseOdds.HOME_GOALKEEPER_LAST_ASSIST);
          } else {
            return formatOdds(odds_factor, BaseOdds.AWAY_GOALKEEPER_LAST_ASSIST);
          }
        };
        case (#Defender){
          if(onHomeTeam){
            return formatOdds(odds_factor, BaseOdds.HOME_DEFENDER_LAST_ASSIST);
          } else {
            return formatOdds(odds_factor, BaseOdds.AWAY_DEFENDER_LAST_ASSIST);
          }
        };
        case (#Midfielder){
          if(onHomeTeam){
            return formatOdds(odds_factor, BaseOdds.HOME_MIDFIELDER_LAST_ASSIST);
          } else {
            return formatOdds(odds_factor, BaseOdds.AWAY_MIDFIELDER_LAST_ASSIST);
          }
        };
        case (#Forward){
          if(onHomeTeam){
            return formatOdds(odds_factor, BaseOdds.HOME_FORWARD_LAST_ASSIST);
          } else {
            return formatOdds(odds_factor, BaseOdds.AWAY_FORWARD_LAST_ASSIST);
          }
        }
      };
      return 0;
    };
    
    public func getAnytimeScorerOdds(fixtures: [ResponseDTOs.FixtureDTO], bettingFixture: ResponseDTOs.FixtureDTO, player: ResponseDTOs.PlayerDTO) : Float{
      var odds_factor: Float = 1;

      let recentFixtures = Array.filter<ResponseDTOs.FixtureDTO>(fixtures, func(entry: ResponseDTOs.FixtureDTO){
        (entry.homeClubId == player.clubId or entry.awayClubId == player.clubId) and
        entry.gameweek < bettingFixture.gameweek and
        entry.gameweek > bettingFixture.gameweek - 7
      });

      let playerEventsBuffer = Buffer.fromArray<FootballTypes.PlayerEventData>([]);
      for(fixture in Iter.fromArray(recentFixtures)){
        let playerEvents = Array.filter<FootballTypes.PlayerEventData>(fixture.events, func(entry: FootballTypes.PlayerEventData) {
          return entry.playerId == player.id;
        });

        playerEventsBuffer.append(Buffer.fromArray(playerEvents));
      };

      let playeEvents = Buffer.toArray(playerEventsBuffer);

      for(event in Iter.fromArray(playeEvents)){
        if(event.eventType == #Goal){
          odds_factor := odds_factor * 0.95; 
        };
      };

      let totalAppearances = Array.filter<FootballTypes.PlayerEventData>(playeEvents, func(entry: FootballTypes.PlayerEventData){
        entry.eventType == #Appearance;
      });

      if(Array.size(totalAppearances) == Array.size(recentFixtures)){
          odds_factor := odds_factor * 0.95;
      };

      let playerHomeWins = Array.filter<ResponseDTOs.FixtureDTO>(recentFixtures, func(entry: ResponseDTOs.FixtureDTO){
        entry.homeGoals > entry.awayGoals and entry.homeClubId == player.clubId;
      });

      let playerAwayWins = Array.filter<ResponseDTOs.FixtureDTO>(recentFixtures, func(entry: ResponseDTOs.FixtureDTO){
        entry.awayGoals > entry.homeGoals and entry.awayClubId == player.clubId;
      });

      let totalRecentFixtures = Array.size(recentFixtures);

      if(totalRecentFixtures > 0){
        odds_factor := odds_factor / Float.fromInt(totalRecentFixtures) * Float.fromInt(Array.size(playerHomeWins) + Array.size(playerAwayWins));
      };
      
      let onHomeTeam = player.clubId == bettingFixture.homeClubId;

      switch(player.position){
        case (#Goalkeeper){
          if(onHomeTeam){
            return formatOdds(odds_factor, BaseOdds.HOME_GOALKEEPER_ANYTIME_GOALSCORER);
          } else {
            return formatOdds(odds_factor, BaseOdds.AWAY_GOALKEEPER_ANYTIME_GOALSCORER);
          }
        };
        case (#Defender){
          if(onHomeTeam){
            return formatOdds(odds_factor, BaseOdds.HOME_DEFENDER_ANYTIME_GOALSCORER);
          } else {
            return formatOdds(odds_factor, BaseOdds.AWAY_DEFENDER_ANYTIME_GOALSCORER);
          }
        };
        case (#Midfielder){
          if(onHomeTeam){
            return formatOdds(odds_factor, BaseOdds.HOME_MIDFIELDER_ANYTIME_GOALSCORER);
          } else {
            return formatOdds(odds_factor, BaseOdds.AWAY_MIDFIELDER_ANYTIME_GOALSCORER);
          }
        };
        case (#Forward){
          if(onHomeTeam){
            return formatOdds(odds_factor, BaseOdds.HOME_FORWARD_ANYTIME_GOALSCORER);
          } else {
            return formatOdds(odds_factor, BaseOdds.AWAY_FORWARD_ANYTIME_GOALSCORER);
          }
        }
      };
      return 0;
    };
    
    public func getFirstGoalscorerOdds(fixtures: [ResponseDTOs.FixtureDTO], bettingFixture: ResponseDTOs.FixtureDTO, player: ResponseDTOs.PlayerDTO) : Float{
      var odds_factor: Float = 1;

      let recentFixtures = Array.filter<ResponseDTOs.FixtureDTO>(fixtures, func(entry: ResponseDTOs.FixtureDTO){
        (entry.homeClubId == player.clubId or entry.awayClubId == player.clubId) and
        entry.gameweek < bettingFixture.gameweek and
        entry.gameweek > bettingFixture.gameweek - 7
      });

      let playerEventsBuffer = Buffer.fromArray<FootballTypes.PlayerEventData>([]);
      for(fixture in Iter.fromArray(recentFixtures)){
        let playerEvents = Array.filter<FootballTypes.PlayerEventData>(fixture.events, func(entry: FootballTypes.PlayerEventData) {
          return entry.playerId == player.id;
        });

        playerEventsBuffer.append(Buffer.fromArray(playerEvents));
      };

      let playeEvents = Buffer.toArray(playerEventsBuffer);

      for(event in Iter.fromArray(playeEvents)){
        if(event.eventType == #Goal){
          odds_factor := odds_factor * 0.95; 
        };
      };

      let totalAppearances = Array.filter<FootballTypes.PlayerEventData>(playeEvents, func(entry: FootballTypes.PlayerEventData){
        entry.eventType == #Appearance;
      });

      if(Array.size(totalAppearances) == Array.size(recentFixtures)){
          odds_factor := odds_factor * 0.95;
      };

      let playerHomeWins = Array.filter<ResponseDTOs.FixtureDTO>(recentFixtures, func(entry: ResponseDTOs.FixtureDTO){
        entry.homeGoals > entry.awayGoals and entry.homeClubId == player.clubId;
      });

      let playerAwayWins = Array.filter<ResponseDTOs.FixtureDTO>(recentFixtures, func(entry: ResponseDTOs.FixtureDTO){
        entry.awayGoals > entry.homeGoals and entry.awayClubId == player.clubId;
      });

      let totalRecentFixtures = Array.size(recentFixtures);

      if(totalRecentFixtures > 0){
        odds_factor := odds_factor / Float.fromInt(totalRecentFixtures) * Float.fromInt(Array.size(playerHomeWins) + Array.size(playerAwayWins));
      };
      
      let onHomeTeam = player.clubId == bettingFixture.homeClubId;

      switch(player.position){
        case (#Goalkeeper){
          if(onHomeTeam){
            return BaseOdds.HOME_GOALKEEPER_FIRST_GOALSCORER;
          } else {
            return BaseOdds.AWAY_GOALKEEPER_FIRST_GOALSCORER;
          }
        };
        case (#Defender){
          if(onHomeTeam){
            return BaseOdds.HOME_DEFENDER_FIRST_GOALSCORER;
          } else {
            return BaseOdds.AWAY_DEFENDER_FIRST_GOALSCORER;
          }
        };
        case (#Midfielder){
          if(onHomeTeam){
            return BaseOdds.HOME_MIDFIELDER_FIRST_GOALSCORER;
          } else {
            return BaseOdds.AWAY_MIDFIELDER_FIRST_GOALSCORER;
          }
        };
        case (#Forward){
          if(onHomeTeam){
            return BaseOdds.HOME_FORWARD_FIRST_GOALSCORER;
          } else {
            return BaseOdds.AWAY_FORWARD_FIRST_GOALSCORER;
          }
        }
      };
      return 0;
    };
    
    public func getLastScorerOdds(fixtures: [ResponseDTOs.FixtureDTO], bettingFixture: ResponseDTOs.FixtureDTO, player: ResponseDTOs.PlayerDTO) : Float{
      var odds_factor: Float = 1;

      let recentFixtures = Array.filter<ResponseDTOs.FixtureDTO>(fixtures, func(entry: ResponseDTOs.FixtureDTO){
        (entry.homeClubId == player.clubId or entry.awayClubId == player.clubId) and
        entry.gameweek < bettingFixture.gameweek and
        entry.gameweek > bettingFixture.gameweek - 7
      });

      let playerEventsBuffer = Buffer.fromArray<FootballTypes.PlayerEventData>([]);
      for(fixture in Iter.fromArray(recentFixtures)){
        let playerEvents = Array.filter<FootballTypes.PlayerEventData>(fixture.events, func(entry: FootballTypes.PlayerEventData) {
          return entry.playerId == player.id;
        });

        playerEventsBuffer.append(Buffer.fromArray(playerEvents));
      };

      let playeEvents = Buffer.toArray(playerEventsBuffer);

      for(event in Iter.fromArray(playeEvents)){
        if(event.eventType == #Goal){
          odds_factor := odds_factor * 0.95; 
        };
      };

      let totalAppearances = Array.filter<FootballTypes.PlayerEventData>(playeEvents, func(entry: FootballTypes.PlayerEventData){
        entry.eventType == #Appearance;
      });

      if(Array.size(totalAppearances) == Array.size(recentFixtures)){
          odds_factor := odds_factor * 0.95;
      };

      let playerHomeWins = Array.filter<ResponseDTOs.FixtureDTO>(recentFixtures, func(entry: ResponseDTOs.FixtureDTO){
        entry.homeGoals > entry.awayGoals and entry.homeClubId == player.clubId;
      });

      let playerAwayWins = Array.filter<ResponseDTOs.FixtureDTO>(recentFixtures, func(entry: ResponseDTOs.FixtureDTO){
        entry.awayGoals > entry.homeGoals and entry.awayClubId == player.clubId;
      });

      let totalRecentFixtures = Array.size(recentFixtures);

      if(totalRecentFixtures > 0){
        odds_factor := odds_factor / Float.fromInt(totalRecentFixtures) * Float.fromInt(Array.size(playerHomeWins) + Array.size(playerAwayWins));
      };
      
      let onHomeTeam = player.clubId == bettingFixture.homeClubId;

      switch(player.position){
        case (#Goalkeeper){
          if(onHomeTeam){
            return BaseOdds.HOME_GOALKEEPER_LAST_GOALSCORER;
          } else {
            return BaseOdds.AWAY_GOALKEEPER_LAST_GOALSCORER;
          }
        };
        case (#Defender){
          if(onHomeTeam){
            return BaseOdds.HOME_DEFENDER_LAST_GOALSCORER;
          } else {
            return BaseOdds.AWAY_DEFENDER_LAST_GOALSCORER;
          }
        };
        case (#Midfielder){
          if(onHomeTeam){
            return BaseOdds.HOME_MIDFIELDER_LAST_GOALSCORER;
          } else {
            return BaseOdds.AWAY_MIDFIELDER_LAST_GOALSCORER;
          }
        };
        case (#Forward){
          if(onHomeTeam){
            return BaseOdds.HOME_FORWARD_LAST_GOALSCORER;
          } else {
            return BaseOdds.AWAY_FORWARD_LAST_GOALSCORER;
          }
        }
      };
      return 0;
    };








    private func formatOdds (odds_factor: Float, baseOdds: Float) : Float  {
      return Float.nearest((baseOdds * odds_factor) * 4) / 4;
    };
    
    public func getScoresBraceOdds(player: ResponseDTOs.PlayerDTO, onHomeTeam: Bool) : Float{
      switch(player.position){
        case (#Goalkeeper){
          if(onHomeTeam){
            return BaseOdds.HOME_GOALKEEPER_SCORE_BRACE;
          } else {
            return BaseOdds.AWAY_GOALKEEPER_SCORE_BRACE;
          }
        };
        case (#Defender){
          if(onHomeTeam){
            return BaseOdds.HOME_DEFENDER_SCORE_BRACE;
          } else {
            return BaseOdds.AWAY_DEFENDER_SCORE_BRACE
          }
        };
        case (#Midfielder){
          if(onHomeTeam){
            return BaseOdds.HOME_MIDFIELDER_SCORE_BRACE;
          } else {
            return BaseOdds.AWAY_MIDFIELDER_SCORE_BRACE;
          }
        };
        case (#Forward){
          if(onHomeTeam){
            return BaseOdds.HOME_FORWARD_SCORE_BRACE;
          } else {
            return BaseOdds.AWAY_FORWARD_SCORE_BRACE;
          }
        }
      };
      return 0;
    };
    
    public func getScoreHatrickOdds(player: ResponseDTOs.PlayerDTO, onHomeTeam: Bool) : Float{
      switch(player.position){
        case (#Goalkeeper){
          if(onHomeTeam){
            return BaseOdds.HOME_GOALKEEPER_SCORE_HAT_TRICK;
          } else {
            return BaseOdds.AWAY_GOALKEEPER_SCORE_HAT_TRICK;
          }
        };
        case (#Defender){
          if(onHomeTeam){
            return BaseOdds.HOME_DEFENDER_SCORE_HAT_TRICK;
          } else {
            return BaseOdds.AWAY_DEFENDER_SCORE_HAT_TRICK
          }
        };
        case (#Midfielder){
          if(onHomeTeam){
            return BaseOdds.HOME_MIDFIELDER_SCORE_HAT_TRICK;
          } else {
            return BaseOdds.AWAY_MIDFIELDER_SCORE_HAT_TRICK;
          }
        };
        case (#Forward){
          if(onHomeTeam){
            return BaseOdds.HOME_FORWARD_SCORE_HAT_TRICK;
          } else {
            return BaseOdds.AWAY_FORWARD_SCORE_HAT_TRICK;
          }
        }
      };
      return 0;
    };
    
    public func getMissesPenaltyOdds(player: ResponseDTOs.PlayerDTO, onHomeTeam: Bool) : Float{
      switch(player.position){
        case (#Goalkeeper){
          if(onHomeTeam){
            return BaseOdds.HOME_GOALKEEPER_PENALTY_MISS;
          } else {
            return BaseOdds.AWAY_GOALKEEPER_PENALTY_MISS;
          }
        };
        case (#Defender){
          if(onHomeTeam){
            return BaseOdds.HOME_DEFENDER_PENALTY_MISS;
          } else {
            return BaseOdds.AWAY_DEFENDER_PENALTY_MISS
          }
        };
        case (#Midfielder){
          if(onHomeTeam){
            return BaseOdds.HOME_MIDFIELDER_PENALTY_MISS;
          } else {
            return BaseOdds.AWAY_MIDFIELDER_PENALTY_MISS;
          }
        };
        case (#Forward){
          if(onHomeTeam){
            return BaseOdds.HOME_FORWARD_PENALTY_MISS;
          } else {
            return BaseOdds.AWAY_FORWARD_PENALTY_MISS;
          }
        }
      };
      return 0;
    };
    
    public func getYellowCardsOdds(player: ResponseDTOs.PlayerDTO, onHomeTeam: Bool) : Float{
      switch(player.position){
        case (#Goalkeeper){
          if(onHomeTeam){
            return BaseOdds.HOME_GOALKEEPER_YELLOW_CARD;
          } else {
            return BaseOdds.AWAY_GOALKEEPER_YELLOW_CARD;
          }
        };
        case (#Defender){
          if(onHomeTeam){
            return BaseOdds.HOME_DEFENDER_YELLOW_CARD;
          } else {
            return BaseOdds.AWAY_DEFENDER_YELLOW_CARD
          }
        };
        case (#Midfielder){
          if(onHomeTeam){
            return BaseOdds.HOME_MIDFIELDER_YELLOW_CARD;
          } else {
            return BaseOdds.AWAY_MIDFIELDER_YELLOW_CARD;
          }
        };
        case (#Forward){
          if(onHomeTeam){
            return BaseOdds.HOME_FORWARD_YELLOW_CARD;
          } else {
            return BaseOdds.AWAY_FORWARD_YELLOW_CARD;
          }
        }
      };
      return 0;
    };
    
    public func getRedCardsOdds(player: ResponseDTOs.PlayerDTO, onHomeTeam: Bool) : Float{
      switch(player.position){
        case (#Goalkeeper){
          if(onHomeTeam){
            return BaseOdds.HOME_GOALKEEPER_RED_CARD;
          } else {
            return BaseOdds.AWAY_GOALKEEPER_RED_CARD;
          }
        };
        case (#Defender){
          if(onHomeTeam){
            return BaseOdds.HOME_DEFENDER_RED_CARD;
          } else {
            return BaseOdds.AWAY_DEFENDER_RED_CARD;
          }
        };
        case (#Midfielder){
          if(onHomeTeam){
            return BaseOdds.HOME_MIDFIELDER_RED_CARD;
          } else {
            return BaseOdds.AWAY_MIDFIELDER_RED_CARD;
          }
        };
        case (#Forward){
          if(onHomeTeam){
            return BaseOdds.HOME_FORWARD_RED_CARD;
          } else {
            return BaseOdds.AWAY_FORWARD_RED_CARD;
          }
        }
      };
      return 0;
    };
    
    public func getBothTeamsToScoreOdds() : BettingTypes.YesNoSelectionOdds = {
      noOdds = BaseOdds.BOTH_TEAMS_NOT_TO_SCORE; 
      yesOdds = BaseOdds.BOTH_TEAMS_TO_SCORE;
    };
                          
    public func getBothTeamsToScoreAndWinnerOdds() : [BettingTypes.ResultAndYesNoSelectionOdds]{
      return [
        { result = #HomeWin; isYes = true; odds = BaseOdds.BOTH_TEAMS_TO_SCORE_AND_HOME_WIN },
        { result = #AwayWin; isYes = true; odds = BaseOdds.BOTH_TEAMS_TO_SCORE_AND_AWAY_WIN },
        { result = #Draw; isYes = true; odds = BaseOdds.BOTH_TEAMS_TO_SCORE_AND_DRAW },
        { result = #HomeWin; isYes = true; odds = BaseOdds.BOTH_TEAMS_NOT_TO_SCORE_AND_HOME_WIN },
        { result = #AwayWin; isYes = true; odds = BaseOdds.BOTH_TEAMS_NOT_TO_SCORE_AND_AWAY_WIN },
        { result = #Draw; isYes = true; odds = BaseOdds.BOTH_TEAMS_NOT_TO_SCORE_AND_DRAW }
      ]
    };

    public func getCorrectScoreOdds() : [BettingTypes.ScoreSelectionOdds]{
      
      return [
        {awayGoals = 0; homeGoals = 0; odds = BaseOdds.FULL_TIME_SCORE_NIL_NIL},
        {awayGoals = 1; homeGoals = 1; odds = BaseOdds.FULL_TIME_SCORE_ONE_ONE},
        {awayGoals = 2; homeGoals = 2; odds = BaseOdds.FULL_TIME_SCORE_TWO_TWO},
        {awayGoals = 3; homeGoals = 3; odds = BaseOdds.FULL_TIME_SCORE_THREE_THREE},
        {awayGoals = 4; homeGoals = 4; odds = BaseOdds.FULL_TIME_SCORE_FOUR_FOUR},
        {awayGoals = 5; homeGoals = 5; odds = BaseOdds.FULL_TIME_SCORE_FIVE_FIVE},        
        {awayGoals = 0; homeGoals = 1; odds = BaseOdds.FULL_TIME_SCORE_NIL_ONE},
        {awayGoals = 0; homeGoals = 2; odds = BaseOdds.FULL_TIME_SCORE_NIL_TWO},
        {awayGoals = 0; homeGoals = 3; odds = BaseOdds.FULL_TIME_SCORE_NIL_THREE},
        {awayGoals = 0; homeGoals = 4; odds = BaseOdds.FULL_TIME_SCORE_NIL_FOUR},
        {awayGoals = 0; homeGoals = 5; odds = BaseOdds.FULL_TIME_SCORE_NIL_FIVE},
        {awayGoals = 1; homeGoals = 0; odds = BaseOdds.FULL_TIME_SCORE_ONE_NIL},
        {awayGoals = 2; homeGoals = 0; odds = BaseOdds.FULL_TIME_SCORE_TWO_NIL},
        {awayGoals = 3; homeGoals = 0; odds = BaseOdds.FULL_TIME_SCORE_THREE_NIL},
        {awayGoals = 4; homeGoals = 0; odds = BaseOdds.FULL_TIME_SCORE_FOUR_NIL},
        {awayGoals = 5; homeGoals = 0; odds = BaseOdds.FULL_TIME_SCORE_FIVE_NIL},        
        {awayGoals = 2; homeGoals = 1; odds = BaseOdds.FULL_TIME_SCORE_TWO_ONE},
        {awayGoals = 3; homeGoals = 1; odds = BaseOdds.FULL_TIME_SCORE_THREE_ONE},
        {awayGoals = 4; homeGoals = 1; odds = BaseOdds.FULL_TIME_SCORE_FOUR_ONE},
        {awayGoals = 5; homeGoals = 1; odds = BaseOdds.FULL_TIME_SCORE_FIVE_ONE},
        {awayGoals = 1; homeGoals = 2; odds = BaseOdds.FULL_TIME_SCORE_ONE_TWO},
        {awayGoals = 1; homeGoals = 3; odds = BaseOdds.FULL_TIME_SCORE_ONE_THREE},
        {awayGoals = 1; homeGoals = 4; odds = BaseOdds.FULL_TIME_SCORE_ONE_FOUR},
        {awayGoals = 1; homeGoals = 5; odds = BaseOdds.FULL_TIME_SCORE_ONE_FIVE},        
        {awayGoals = 3; homeGoals = 2; odds = BaseOdds.FULL_TIME_SCORE_THREE_TWO},
        {awayGoals = 4; homeGoals = 2; odds = BaseOdds.FULL_TIME_SCORE_FOUR_TWO},
        {awayGoals = 5; homeGoals = 2; odds = BaseOdds.FULL_TIME_SCORE_FIVE_TWO},
        {awayGoals = 6; homeGoals = 2; odds = BaseOdds.FULL_TIME_SCORE_SIX_TWO},
        {awayGoals = 2; homeGoals = 3; odds = BaseOdds.FULL_TIME_SCORE_TWO_THREE},
        {awayGoals = 2; homeGoals = 4; odds = BaseOdds.FULL_TIME_SCORE_TWO_FOUR},
        {awayGoals = 2; homeGoals = 5; odds = BaseOdds.FULL_TIME_SCORE_TWO_FIVE},
        {awayGoals = 2; homeGoals = 6; odds = BaseOdds.FULL_TIME_SCORE_TWO_SIX},        
        {awayGoals = 3; homeGoals = 4; odds = BaseOdds.FULL_TIME_SCORE_THREE_FOUR},
        {awayGoals = 3; homeGoals = 5; odds = BaseOdds.FULL_TIME_SCORE_THREE_FIVE},
        {awayGoals = 3; homeGoals = 6; odds = BaseOdds.FULL_TIME_SCORE_THREE_SIX},
        {awayGoals = 4; homeGoals = 3; odds = BaseOdds.FULL_TIME_SCORE_FOUR_THREE},
        {awayGoals = 5; homeGoals = 3; odds = BaseOdds.FULL_TIME_SCORE_FIVE_THREE},
        {awayGoals = 6; homeGoals = 3; odds = BaseOdds.FULL_TIME_SCORE_SIX_THREE},        
        {awayGoals = 4; homeGoals = 5; odds = BaseOdds.FULL_TIME_SCORE_FOUR_FIVE},
        {awayGoals = 4; homeGoals = 6; odds = BaseOdds.FULL_TIME_SCORE_FOUR_SIX},
        {awayGoals = 5; homeGoals = 4; odds = BaseOdds.FULL_TIME_SCORE_FIVE_FOUR},
        {awayGoals = 6; homeGoals = 4; odds = BaseOdds.FULL_TIME_SCORE_SIX_FOUR},
        {awayGoals = 6; homeGoals = 1; odds = BaseOdds.FULL_TIME_SCORE_SIX_ONE},
        {awayGoals = 1; homeGoals = 6; odds = BaseOdds.FULL_TIME_SCORE_ONE_SIX}
      ]
    };

    public func getGoalsOverUnderOdds() : BettingTypes.OverUnderSelectionOdds{
      return {
        overOdds = [
          {
            margin = 0.5;
            odds = BaseOdds.OVER_ODDS_ZERO_POINT_FIVE;
          },
          {
            margin = 1.5;
            odds = BaseOdds.OVER_ODDS_ONE_POINT_FIVE;
          },
          {
            margin = 2.5;
            odds = BaseOdds.OVER_ODDS_TWO_POINT_FIVE;
          },
          {
            margin = 3.5;
            odds = BaseOdds.OVER_ODDS_THREE_POINT_FIVE;
          },
          {
            margin = 4.5;
            odds = BaseOdds.OVER_ODDS_FOUR_POINT_FIVE;
          },
          {
            margin = 5.5;
            odds = BaseOdds.OVER_ODDS_FIVE_POINT_FIVE;
          },
          {
            margin = 6.5;
            odds = BaseOdds.OVER_ODDS_SIX_POINT_FIVE;
          },
          {
            margin = 7.5;
            odds = BaseOdds.OVER_ODDS_SEVEN_POINT_FIVE;
          }
        ];
        underOdds = [
          {
            margin = 0.5;
            odds = BaseOdds.UNDER_ODDS_ZERO_POINT_FIVE;
          },
          {
            margin = 1.5;
            odds = BaseOdds.UNDER_ODDS_ONE_POINT_FIVE;
          },
          {
            margin = 2.5;
            odds = BaseOdds.UNDER_ODDS_TWO_POINT_FIVE;
          },
          {
            margin = 3.5;
            odds = BaseOdds.UNDER_ODDS_THREE_POINT_FIVE;
          },
          {
            margin = 4.5;
            odds = BaseOdds.UNDER_ODDS_FOUR_POINT_FIVE;
          },
          {
            margin = 5.5;
            odds = BaseOdds.UNDER_ODDS_FIVE_POINT_FIVE;
          },
          {
            margin = 6.5;
            odds = BaseOdds.UNDER_ODDS_SIX_POINT_FIVE;
          },
          {
            margin = 7.5;
            odds = BaseOdds.UNDER_ODDS_SEVEN_POINT_FIVE;
          }
        ];
      }
    };

    public func getHalfTimeFullTimeResultOdds() : [BettingTypes.HalfTimeFullTimeOdds]{
      return [
        {
          firstHalfResult = #Draw;
          secondHalfResult = #Draw;
          odds = BaseOdds.HALF_TIME_FULL_TIME_DRAW_DRAW;
        },
        {
          firstHalfResult = #Draw;
          secondHalfResult = #HomeWin;
          odds = BaseOdds.HALF_TIME_FULL_TIME_DRAW_HOME;
        },
        {
          firstHalfResult = #HomeWin;
          secondHalfResult = #Draw;
          odds = BaseOdds.HALF_TIME_FULL_TIME_HOME_DRAW;
        },
        {
          firstHalfResult = #Draw;
          secondHalfResult = #AwayWin;
          odds = BaseOdds.HALF_TIME_FULL_TIME_DRAW_AWAY;
        },
        {
          firstHalfResult = #AwayWin;
          secondHalfResult = #Draw;
          odds = BaseOdds.HALF_TIME_FULL_TIME_AWAY_DRAW;
        },
        {
          firstHalfResult = #HomeWin;
          secondHalfResult = #HomeWin;
          odds = BaseOdds.HALF_TIME_FULL_TIME_HOME_HOME;
        },
        {
          firstHalfResult = #AwayWin;
          secondHalfResult = #AwayWin;
          odds = BaseOdds.HALF_TIME_FULL_TIME_AWAY_AWAY;
        },
        {
          firstHalfResult = #HomeWin;
          secondHalfResult = #AwayWin;
          odds = BaseOdds.HALF_TIME_FULL_TIME_HOME_AWAY;
        },
        {
          firstHalfResult = #AwayWin;
          secondHalfResult = #HomeWin;
          odds = BaseOdds.HALF_TIME_FULL_TIME_AWAY_HOME;
        },
      ]
    };

    public func getHalfTimeScoreOdds() : [BettingTypes.ScoreSelectionOdds]{
      
      return [
        {awayGoals = 0; homeGoals = 0; odds = BaseOdds.HALF_TIME_SCORE_NIL_NIL},
        {awayGoals = 1; homeGoals = 1; odds = BaseOdds.HALF_TIME_SCORE_ONE_ONE},
        {awayGoals = 2; homeGoals = 2; odds = BaseOdds.HALF_TIME_SCORE_TWO_TWO},
        {awayGoals = 3; homeGoals = 3; odds = BaseOdds.HALF_TIME_SCORE_THREE_THREE},
        {awayGoals = 4; homeGoals = 4; odds = BaseOdds.HALF_TIME_SCORE_FOUR_FOUR},
        {awayGoals = 5; homeGoals = 5; odds = BaseOdds.HALF_TIME_SCORE_FIVE_FIVE},        
        {awayGoals = 0; homeGoals = 1; odds = BaseOdds.HALF_TIME_SCORE_NIL_ONE},
        {awayGoals = 0; homeGoals = 2; odds = BaseOdds.HALF_TIME_SCORE_NIL_TWO},
        {awayGoals = 0; homeGoals = 3; odds = BaseOdds.HALF_TIME_SCORE_NIL_THREE},
        {awayGoals = 0; homeGoals = 4; odds = BaseOdds.HALF_TIME_SCORE_NIL_FOUR},
        {awayGoals = 0; homeGoals = 5; odds = BaseOdds.HALF_TIME_SCORE_NIL_FIVE},
        {awayGoals = 1; homeGoals = 0; odds = BaseOdds.HALF_TIME_SCORE_ONE_NIL},
        {awayGoals = 2; homeGoals = 0; odds = BaseOdds.HALF_TIME_SCORE_TWO_NIL},
        {awayGoals = 3; homeGoals = 0; odds = BaseOdds.HALF_TIME_SCORE_THREE_NIL},
        {awayGoals = 4; homeGoals = 0; odds = BaseOdds.HALF_TIME_SCORE_FOUR_NIL},
        {awayGoals = 5; homeGoals = 0; odds = BaseOdds.HALF_TIME_SCORE_FIVE_NIL},        
        {awayGoals = 2; homeGoals = 1; odds = BaseOdds.HALF_TIME_SCORE_TWO_ONE},
        {awayGoals = 3; homeGoals = 1; odds = BaseOdds.HALF_TIME_SCORE_THREE_ONE},
        {awayGoals = 4; homeGoals = 1; odds = BaseOdds.HALF_TIME_SCORE_FOUR_ONE},
        {awayGoals = 5; homeGoals = 1; odds = BaseOdds.HALF_TIME_SCORE_FIVE_ONE},
        {awayGoals = 1; homeGoals = 2; odds = BaseOdds.HALF_TIME_SCORE_ONE_TWO},
        {awayGoals = 1; homeGoals = 3; odds = BaseOdds.HALF_TIME_SCORE_ONE_THREE},
        {awayGoals = 1; homeGoals = 4; odds = BaseOdds.HALF_TIME_SCORE_ONE_FOUR},
        {awayGoals = 1; homeGoals = 5; odds = BaseOdds.HALF_TIME_SCORE_ONE_FIVE},        
        {awayGoals = 3; homeGoals = 2; odds = BaseOdds.HALF_TIME_SCORE_THREE_TWO},
        {awayGoals = 4; homeGoals = 2; odds = BaseOdds.HALF_TIME_SCORE_FOUR_TWO},
        {awayGoals = 5; homeGoals = 2; odds = BaseOdds.HALF_TIME_SCORE_FIVE_TWO},
        {awayGoals = 6; homeGoals = 2; odds = BaseOdds.HALF_TIME_SCORE_SIX_TWO},
        {awayGoals = 2; homeGoals = 3; odds = BaseOdds.HALF_TIME_SCORE_TWO_THREE},
        {awayGoals = 2; homeGoals = 4; odds = BaseOdds.HALF_TIME_SCORE_TWO_FOUR},
        {awayGoals = 2; homeGoals = 5; odds = BaseOdds.HALF_TIME_SCORE_TWO_FIVE},
        {awayGoals = 2; homeGoals = 6; odds = BaseOdds.HALF_TIME_SCORE_TWO_SIX},        
        {awayGoals = 3; homeGoals = 4; odds = BaseOdds.HALF_TIME_SCORE_THREE_FOUR},
        {awayGoals = 3; homeGoals = 5; odds = BaseOdds.HALF_TIME_SCORE_THREE_FIVE},
        {awayGoals = 3; homeGoals = 6; odds = BaseOdds.HALF_TIME_SCORE_THREE_SIX},
        {awayGoals = 4; homeGoals = 3; odds = BaseOdds.HALF_TIME_SCORE_FOUR_THREE},
        {awayGoals = 5; homeGoals = 3; odds = BaseOdds.HALF_TIME_SCORE_FIVE_THREE},
        {awayGoals = 6; homeGoals = 3; odds = BaseOdds.HALF_TIME_SCORE_SIX_THREE},        
        {awayGoals = 4; homeGoals = 5; odds = BaseOdds.HALF_TIME_SCORE_FOUR_FIVE},
        {awayGoals = 4; homeGoals = 6; odds = BaseOdds.HALF_TIME_SCORE_FOUR_SIX},
        {awayGoals = 5; homeGoals = 4; odds = BaseOdds.HALF_TIME_SCORE_FIVE_FOUR},
        {awayGoals = 6; homeGoals = 4; odds = BaseOdds.HALF_TIME_SCORE_SIX_FOUR},
        {awayGoals = 6; homeGoals = 1; odds = BaseOdds.HALF_TIME_SCORE_SIX_ONE},
        {awayGoals = 1; homeGoals = 6; odds = BaseOdds.HALF_TIME_SCORE_ONE_SIX}
      ]
    };
    
    public func getPenaltyMissedOdds() : BettingTypes.MissPenaltyOdds{
      return {
        homeTeam = BaseOdds.HOME_TEAM_PENALTY_MISS;
        awayTeam = BaseOdds.AWAY_TEAM_PENALTY_MISS;
      }
    };

  };
};
