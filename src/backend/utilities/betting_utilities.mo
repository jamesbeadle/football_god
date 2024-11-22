import Iter "mo:base/Iter";
import Nat64 "mo:base/Nat64";
import BettingTypes "../types/betting_types";
import Utilities "utilities";

module {

    public func createWinningSelection(selection: BettingTypes.Selection) : BettingTypes.Selection {
      return {
        fixtureId = selection.fixtureId;
        odds = selection.odds;
        result = #Won;
        selectionDetail = selection.selectionDetail;
        selectionType = selection.selectionType;
        stake = selection.stake;
        status = #Settled;
        winnings = selection.odds * Utilities.convertNat64ToFloat(selection.stake);
      };
    };

    public func createLosingSelection(selection: BettingTypes.Selection) : BettingTypes.Selection {
      return {
        fixtureId = selection.fixtureId;
        odds = selection.odds;
        result = #Lost;
        selectionDetail = selection.selectionDetail;
        selectionType = selection.selectionType;
        stake = selection.stake;
        status = #Settled;
        winnings = 0;
      };
    };

    public func getCumulativeSelectionWinnings(betslip: BettingTypes.BetSlip) : Nat64 {
      let startingStake = betslip.totalStake;
      var cumulativeWinnings = startingStake;
      for(selection in Iter.fromArray(betslip.selections)){
        cumulativeWinnings += (Utilities.convertFloatToNat64(selection.odds) * cumulativeWinnings);
      };
      return cumulativeWinnings;
    };

    public func getCanadianSelectionWinnings(betslip: BettingTypes.BetSlip) : Nat64 {
      
      //5 selections
        //26 bets
          //10 doubles
          //10 trebles
          //5 four folds
          //1 five fold
      return 0; //TODO
    };

    public func getHeinzSelectionWinnings(betslip: BettingTypes.BetSlip) : Nat64 {
      //6 selections creating 57 bets
      return 0; //TODO
    };

    public func getGoliathSelectionWinnings(betslip: BettingTypes.BetSlip) : Nat64 {
      //8 selections creating 247 bets
      return 0; //TODO
    };

    public func getLucky15SelectionWinnings(betslip: BettingTypes.BetSlip) : Nat64 {
      //4 selections creating 15 bets
      return 0; //TODO
    };

    public func getLucky31SelectionWinnings(betslip: BettingTypes.BetSlip) : Nat64 {
      //5 selections creating 31 bets
      return 0; //TODO
    };

    public func getLucky63SelectionWinnings(betslip: BettingTypes.BetSlip) : Nat64 {
      //6 selections creating 63 bets
      return 0; //TODO
    };

    public func getPatentSelectionWinnings(betslip: BettingTypes.BetSlip) : Nat64 {
      //3 selections creating 7 bets
      return 0; //TODO
    };

    public func getSuperHeinzSelectionWinnings(betslip: BettingTypes.BetSlip) : Nat64 {
      //7 selecitons creating 120 bets
      return 0; //TODO
    };

    public func getTrixieSelectionWinnings(betslip: BettingTypes.BetSlip) : Nat64 {
      //3 selections creating 4 bets
      return 0; //TODO
    };

    public func getYankeeSelectionWinnings(betslip: BettingTypes.BetSlip) : Nat64 {
      //4 selections creating 11 bets
      return 0; //TODO
    };

};
