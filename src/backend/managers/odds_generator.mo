import BettingTypes "../types/betting_types";
import ResponseDTOs "../dtos/response_DTOs";

module {

  public class OddsGenerator() {
    
    public func getFirstAssistOdds(player: ResponseDTOs.PlayerDTO) : Float{
      return 0;
    };
    
    public func getFirstGoalscorerOdds(player: ResponseDTOs.PlayerDTO) : Float{
      return 0;
    };
    
    public func getAnytimeAssistOdds(player: ResponseDTOs.PlayerDTO) : Float{
      return 0;
    };
    
    public func getAnytimeScorerOdds(player: ResponseDTOs.PlayerDTO) : Float{
      return 0;
    };
    
    public func getLastAssistOdds(player: ResponseDTOs.PlayerDTO) : Float{
      return 0;
    };
    
    public func getLastScorerOdds(player: ResponseDTOs.PlayerDTO) : Float{
      return 0;
    };
    
    public func getScoresBraceOdds(player: ResponseDTOs.PlayerDTO) : Float{
      return 0;
    };
    
    public func getScoreHatrickOdds(player: ResponseDTOs.PlayerDTO) : Float{
      return 0;
    };
    
    public func getMissesPenaltyOdds(player: ResponseDTOs.PlayerDTO) : Float{
      return 0;
    };
    
    public func getYellowCardsOdds(player: ResponseDTOs.PlayerDTO) : Float{
      return 0;
    };
    
    public func getRedCardsOdds(player: ResponseDTOs.PlayerDTO) : Float{
      return 0;
    };
    
    public func getBothTeamsToScoreOdds() : BettingTypes.YesNoSelectionOdds = {
      noOdds = 0; 
      yesOdds = 0;
    };
                          
    public func getBothTeamsToScoreAndWinnerOdds() : [BettingTypes.ClubAndYesNoSelectionOdds]{
      return []
    };
    public func getCorrectResultOdds() : BettingTypes.TeamSelectionOdds{
      return {
        awayOdds = 0;
        drawOdds = 0;
        homeOdds = 0;
      }
    };
    public func getCorrectScoreOdds() : [BettingTypes.ScoreSelectionOdds]{
      return []
    };
    public func getGoalsOverUnderOdds() : BettingTypes.OverUnderSelectionOdds{
      return {
        awayOdds = [];
        homeOdds = [];
      }
    };
    public func getHalfTimeFullTimeResultOdds() : [BettingTypes.SplitHalfTeamSelectionOdds]{
      return []
    };
    public func getHalfTimeScoreOdds() : [BettingTypes.ScoreSelectionOdds]{
      return []
    };
    public func getPenaltyMissedOdds() : BettingTypes.TeamSelectionOdds{
      return {
        awayOdds = 0;
        drawOdds = 0;
        homeOdds = 0;
      }
    };

  };
};
