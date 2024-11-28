import BettingTypes "../types/betting_types";
import ResponseDTOs "../dtos/response_DTOs";
import BaseOdds "../utilities/BaseOdds";

module {

  public class OddsGenerator() {
    
    public func getFirstAssistOdds(player: ResponseDTOs.PlayerDTO, onHomeTeam: Bool) : Float{

      /* //TODO 


        //Phase 1
        In each function identify the weighted values to adjust the base odds
          
        For first assists, look at
          - Teams league position
          - Opponents league position
          - Number of recent assists this player has got
          - Total assists by seasons
          - The number of season they've played
          - Whether they have peaked
          - The opponent they are facing
            - The opponents goal conceded record
        
        //Phase 2
        Next level would be using an AI to spot advanced patterns as in when this player 
          -  plays with another player of a certain position, in a certain predicted line up, typically certain things happen

      */


      switch(player.position){
        case (#Goalkeeper){
          if(onHomeTeam){
            return BaseOdds.HOME_GOALKEEPER_FIRST_ASSIST;
          } else {
            return BaseOdds.AWAY_GOALKEEPER_FIRST_ASSIST;
          }
        };
        case (#Defender){
          if(onHomeTeam){
            return BaseOdds.HOME_DEFENDER_FIRST_ASSIST;
          } else {
            return BaseOdds.AWAY_DEFENDER_FIRST_ASSIST;
          }
        };
        case (#Midfielder){
          if(onHomeTeam){
            return BaseOdds.HOME_MIDFIELDER_FIRST_ASSIST;
          } else {
            return BaseOdds.AWAY_MIDFIELDER_FIRST_ASSIST;
          }
        };
        case (#Forward){
          if(onHomeTeam){
            return BaseOdds.HOME_FORWARD_FIRST_ASSIST;
          } else {
            return BaseOdds.AWAY_FORWARD_FIRST_ASSIST;
          }
        }
      };
      return 0;
    };
    
    public func getFirstGoalscorerOdds(player: ResponseDTOs.PlayerDTO, onHomeTeam: Bool) : Float{
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
    
    public func getAnytimeAssistOdds(player: ResponseDTOs.PlayerDTO, onHomeTeam: Bool) : Float{
      switch(player.position){
        case (#Goalkeeper){
          if(onHomeTeam){
            return BaseOdds.HOME_GOALKEEPER_ANYTIME_ASSIST;
          } else {
            return BaseOdds.AWAY_GOALKEEPER_ANYTIME_ASSIST;
          }
        };
        case (#Defender){
          if(onHomeTeam){
            return BaseOdds.HOME_DEFENDER_ANYTIME_ASSIST;
          } else {
            return BaseOdds.AWAY_DEFENDER_ANYTIME_ASSIST;
          }
        };
        case (#Midfielder){
          if(onHomeTeam){
            return BaseOdds.HOME_MIDFIELDER_ANYTIME_ASSIST;
          } else {
            return BaseOdds.AWAY_MIDFIELDER_ANYTIME_ASSIST;
          }
        };
        case (#Forward){
          if(onHomeTeam){
            return BaseOdds.HOME_FORWARD_ANYTIME_ASSIST;
          } else {
            return BaseOdds.AWAY_FORWARD_ANYTIME_ASSIST;
          }
        }
      };
      return 0;
    };
    
    public func getAnytimeScorerOdds(player: ResponseDTOs.PlayerDTO, onHomeTeam: Bool) : Float{
      switch(player.position){
        case (#Goalkeeper){
          if(onHomeTeam){
            return BaseOdds.HOME_GOALKEEPER_ANYTIME_GOALSCORER;
          } else {
            return BaseOdds.AWAY_GOALKEEPER_ANYTIME_GOALSCORER;
          }
        };
        case (#Defender){
          if(onHomeTeam){
            return BaseOdds.HOME_DEFENDER_ANYTIME_GOALSCORER;
          } else {
            return BaseOdds.AWAY_DEFENDER_ANYTIME_GOALSCORER;
          }
        };
        case (#Midfielder){
          if(onHomeTeam){
            return BaseOdds.HOME_MIDFIELDER_ANYTIME_GOALSCORER;
          } else {
            return BaseOdds.AWAY_MIDFIELDER_ANYTIME_GOALSCORER;
          }
        };
        case (#Forward){
          if(onHomeTeam){
            return BaseOdds.HOME_FORWARD_ANYTIME_GOALSCORER;
          } else {
            return BaseOdds.AWAY_FORWARD_ANYTIME_GOALSCORER;
          }
        }
      };
      return 0;
    };
    
    public func getLastAssistOdds(player: ResponseDTOs.PlayerDTO, onHomeTeam: Bool) : Float{
      switch(player.position){
        case (#Goalkeeper){
          if(onHomeTeam){
            return BaseOdds.HOME_GOALKEEPER_LAST_ASSIST;
          } else {
            return BaseOdds.AWAY_GOALKEEPER_LAST_ASSIST;
          }
        };
        case (#Defender){
          if(onHomeTeam){
            return BaseOdds.HOME_DEFENDER_LAST_ASSIST;
          } else {
            return BaseOdds.AWAY_DEFENDER_LAST_ASSIST;
          }
        };
        case (#Midfielder){
          if(onHomeTeam){
            return BaseOdds.HOME_MIDFIELDER_LAST_ASSIST;
          } else {
            return BaseOdds.AWAY_MIDFIELDER_LAST_ASSIST;
          }
        };
        case (#Forward){
          if(onHomeTeam){
            return BaseOdds.HOME_FORWARD_LAST_ASSIST;
          } else {
            return BaseOdds.AWAY_FORWARD_LAST_ASSIST;
          }
        }
      };
      return 0;
    };
    
    public func getLastScorerOdds(player: ResponseDTOs.PlayerDTO, onHomeTeam: Bool) : Float{
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

    public func getCorrectResultOdds() : BettingTypes.TeamSelectionOdds{
      return {
        awayOdds = BaseOdds.HOME_WIN_ODDS;
        drawOdds = BaseOdds.DRAW_ODDS;
        homeOdds = BaseOdds.AWAY_WIN_ODDS;
      }
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
