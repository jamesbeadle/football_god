module BaseOdds {
    public let HOME_WIN: Float = 2;
    public let DRAW : Float = 1;
    public let AWAY_WIN : Float = 3;

    //ASSISTS

    public let HOME_FORWARD_ANYTIME_ASSIST : Float = 3;
    public let HOME_MIDFIELDER_ANYTIME_ASSIST : Float = 4;
    public let HOME_DEFENDER_ANYTIME_ASSIST : Float = 5;
    public let HOME_GOALKEEPER_ANYTIME_ASSIST : Float = 10;

    public let HOME_FORWARD_FIRST_ASSIST : Float = 5;
    public let HOME_MIDFIELDER_FIRST_ASSIST : Float = 7;
    public let HOME_DEFENDER_FIRST_ASSIST : Float = 9;
    public let HOME_GOALKEEPER_FIRST_ASSIST : Float = 20;

    public let HOME_FORWARD_LAST_ASSIST : Float = 6;
    public let HOME_MIDFIELDER_LAST_ASSIST : Float = 8;
    public let HOME_DEFENDER_LAST_ASSIST : Float = 10;
    public let HOME_GOALKEEPER_LAST_ASSIST : Float = 25;
    
    public let AWAY_FORWARD_ANYTIME_ASSIST : Float = 4;
    public let AWAY_MIDFIELDER_ANYTIME_ASSIST : Float = 5;
    public let AWAY_DEFENDER_ANYTIME_ASSIST : Float = 6;
    public let AWAY_GOALKEEPER_ANYTIME_ASSIST : Float = 15;

    public let AWAY_FORWARD_FIRST_ASSIST : Float = 6;
    public let AWAY_MIDFIELDER_FIRST_ASSIST : Float = 8;
    public let AWAY_DEFENDER_FIRST_ASSIST : Float = 10;
    public let AWAY_GOALKEEPER_FIRST_ASSIST : Float = 25;

    public let AWAY_FORWARD_LAST_ASSIST : Float = 7;
    public let AWAY_MIDFIELDER_LAST_ASSIST : Float = 9;
    public let AWAY_DEFENDER_LAST_ASSIST : Float = 11;
    public let AWAY_GOALKEEPER_LAST_ASSIST : Float = 30;

    //GOALSCORERS

    public let HOME_FORWARD_ANYTIME_GOALSCORER : Float = 3;
    public let HOME_MIDFIELDER_ANYTIME_GOALSCORER : Float = 5;
    public let HOME_DEFENDER_ANYTIME_GOALSCORER : Float = 8;
    public let HOME_GOALKEEPER_ANYTIME_GOALSCORER : Float = 50;

    public let AWAY_FORWARD_ANYTIME_GOALSCORER : Float = 4;
    public let AWAY_MIDFIELDER_ANYTIME_GOALSCORER : Float = 6;
    public let AWAY_DEFENDER_ANYTIME_GOALSCORER : Float = 9;
    public let AWAY_GOALKEEPER_ANYTIME_GOALSCORER : Float = 60;

    public let HOME_FORWARD_FIRST_GOALSCORER : Float = 6;
    public let HOME_MIDFIELDER_FIRST_GOALSCORER : Float = 9;
    public let HOME_DEFENDER_FIRST_GOALSCORER : Float = 12;
    public let HOME_GOALKEEPER_FIRST_GOALSCORER : Float = 75;

    public let AWAY_FORWARD_FIRST_GOALSCORER : Float = 7;
    public let AWAY_MIDFIELDER_FIRST_GOALSCORER : Float = 10;
    public let AWAY_DEFENDER_FIRST_GOALSCORER : Float = 13;
    public let AWAY_GOALKEEPER_FIRST_GOALSCORER : Float = 80;

    public let HOME_FORWARD_LAST_GOALSCORER : Float = 7;
    public let HOME_MIDFIELDER_LAST_GOALSCORER : Float = 10;
    public let HOME_DEFENDER_LAST_GOALSCORER : Float = 13;
    public let HOME_GOALKEEPER_LAST_GOALSCORER : Float = 80;

    public let AWAY_FORWARD_LAST_GOALSCORER : Float = 8;
    public let AWAY_MIDFIELDER_LAST_GOALSCORER : Float = 12;
    public let AWAY_DEFENDER_LAST_GOALSCORER : Float = 15;
    public let AWAY_GOALKEEPER_LAST_GOALSCORER : Float = 100;



    public let HOME_FORWARD_YELLOW_CARD : Float = 11;
    public let HOME_MIDFIELDER_YELLOW_CARD : Float = 9;
    public let HOME_DEFENDER_YELLOW_CARD : Float = 6;
    public let HOME_GOALKEEPER_YELLOW_CARD : Float = 6;

    public let AWAY_FORWARD_YELLOW_CARD : Float = 10;
    public let AWAY_MIDFIELDER_YELLOW_CARD : Float = 8;
    public let AWAY_DEFENDER_YELLOW_CARD : Float = 5;
    public let AWAY_GOALKEEPER_YELLOW_CARD : Float = 5;

    public let HOME_FORWARD_RED_CARD : Float = 100;
    public let HOME_MIDFIELDER_RED_CARD : Float = 75;
    public let HOME_DEFENDER_RED_CARD : Float = 50;
    public let HOME_GOALKEEPER_RED_CARD : Float = 100;

    public let AWAY_FORWARD_RED_CARD : Float = 80;
    public let AWAY_MIDFIELDER_RED_CARD : Float = 60;
    public let AWAY_DEFENDER_RED_CARD : Float = 40;
    public let AWAY_GOALKEEPER_RED_CARD : Float = 80;

    public let HOME_TEAM_PENALTY_MISS : Float = 10;
    public let AWAY_TEAM_PENALTY_MISS : Float = 8;

    public let HOME_FORWARD_PENALTY_MISS : Float = 15;
    public let HOME_MIDFIELDER_PENALTY_MISS : Float = 20;
    public let HOME_DEFENDER_PENALTY_MISS : Float = 25;
    public let HOME_GOALKEEPER_PENALTY_MISS : Float = 100;

    public let AWAY_FORWARD_PENALTY_MISS : Float = 12;
    public let AWAY_MIDFIELDER_PENALTY_MISS : Float = 18;
    public let AWAY_DEFENDER_PENALTY_MISS : Float = 24;
    public let AWAY_GOALKEEPER_PENALTY_MISS : Float = 100;








    public let HOME_FORWARD_SCORE_BRACE : Float = 12;
    public let HOME_MIDFIELDER_SCORE_BRACE : Float = 15;
    public let HOME_DEFENDER_SCORE_BRACE : Float = 20;
    public let HOME_GOALKEEPER_SCORE_BRACE : Float = 100;

    public let AWAY_FORWARD_SCORE_BRACE : Float = 15;
    public let AWAY_MIDFIELDER_SCORE_BRACE : Float = 20;
    public let AWAY_DEFENDER_SCORE_BRACE : Float = 25;
    public let AWAY_GOALKEEPER_SCORE_BRACE : Float = 100;

    public let HOME_FORWARD_SCORE_HAT_TRICK : Float = 75;
    public let HOME_MIDFIELDER_SCORE_HAT_TRICK : Float = 100;
    public let HOME_DEFENDER_SCORE_HAT_TRICK : Float = 125;
    public let HOME_GOALKEEPER_SCORE_HAT_TRICK : Float = 250;

    public let AWAY_FORWARD_SCORE_HAT_TRICK : Float = 100;
    public let AWAY_MIDFIELDER_SCORE_HAT_TRICK : Float = 125;
    public let AWAY_DEFENDER_SCORE_HAT_TRICK : Float = 150;
    public let AWAY_GOALKEEPER_SCORE_HAT_TRICK : Float = 500;

    public let HALF_TIME_SCORE_NIL_NIL : Float = 2;
    public let HALF_TIME_SCORE_ONE_ONE : Float = 7;
    public let HALF_TIME_SCORE_TWO_TWO : Float = 15;
    public let HALF_TIME_SCORE_THREE_THREE : Float = 50;
    public let HALF_TIME_SCORE_FOUR_FOUR : Float = 250;
    public let HALF_TIME_SCORE_FIVE_FIVE : Float = 1000;

    public let HALF_TIME_SCORE_ONE_NIL : Float = 5;
    public let HALF_TIME_SCORE_TWO_NIL : Float = 10;
    public let HALF_TIME_SCORE_THREE_NIL : Float = 25;
    public let HALF_TIME_SCORE_FOUR_NIL : Float = 50;
    public let HALF_TIME_SCORE_FIVE_NIL : Float = 75;

    public let HALF_TIME_SCORE_NIL_ONE : Float = 7;
    public let HALF_TIME_SCORE_NIL_TWO : Float = 12;
    public let HALF_TIME_SCORE_NIL_THREE : Float = 35;
    public let HALF_TIME_SCORE_NIL_FOUR : Float = 75;
    public let HALF_TIME_SCORE_NIL_FIVE : Float = 100;
    public let HALF_TIME_SCORE_OVER_NIL_SIX : Float = 150;

    public let HALF_TIME_SCORE_TWO_ONE : Float = 8;
    public let HALF_TIME_SCORE_ONE_TWO : Float = 10;
    public let HALF_TIME_SCORE_THREE_TWO : Float = 14;
    public let HALF_TIME_SCORE_TWO_THREE : Float = 18;
    public let HALF_TIME_SCORE_FOUR_THREE : Float = 24;
    public let HALF_TIME_SCORE_THREE_FOUR : Float = 35;
    public let HALF_TIME_SCORE_FIVE_FOUR : Float = 30;
    public let HALF_TIME_SCORE_FOUR_FIVE : Float = 40;

    public let HALF_TIME_SCORE_THREE_ONE : Float = 20;
    public let HALF_TIME_SCORE_ONE_THREE : Float = 24;    
    public let HALF_TIME_SCORE_FOUR_TWO : Float = 25;
    public let HALF_TIME_SCORE_TWO_FOUR : Float = 30;
    public let HALF_TIME_SCORE_FIVE_THREE : Float = 28;
    public let HALF_TIME_SCORE_THREE_FIVE : Float = 32;
    public let HALF_TIME_SCORE_SIX_FOUR : Float = 35;
    public let HALF_TIME_SCORE_FOUR_SIX : Float = 40;
    
    public let HALF_TIME_SCORE_FOUR_ONE : Float = 22;
    public let HALF_TIME_SCORE_ONE_FOUR : Float = 24;
    public let HALF_TIME_SCORE_FIVE_TWO : Float = 24;
    public let HALF_TIME_SCORE_TWO_FIVE : Float = 26;
    public let HALF_TIME_SCORE_SIX_THREE : Float = 28;
    public let HALF_TIME_SCORE_THREE_SIX : Float = 32;
    public let HALF_TIME_SCORE_FIVE_ONE : Float = 25;
    public let HALF_TIME_SCORE_ONE_FIVE : Float = 30;

    public let HALF_TIME_SCORE_SIX_TWO : Float = 30;
    public let HALF_TIME_SCORE_TWO_SIX : Float = 40;

    public let HALF_TIME_SCORE_SIX_ONE : Float = 40;
    public let HALF_TIME_SCORE_ONE_SIX : Float = 50;

    public let FULL_TIME_SCORE_NIL_NIL : Float = 15;
    public let FULL_TIME_SCORE_ONE_ONE : Float = 5;
    public let FULL_TIME_SCORE_TWO_TWO : Float = 15;
    public let FULL_TIME_SCORE_THREE_THREE : Float = 25;
    public let FULL_TIME_SCORE_FOUR_FOUR : Float = 100;
    public let FULL_TIME_SCORE_FIVE_FIVE : Float = 500;

    public let FULL_TIME_SCORE_ONE_NIL : Float = 5;
    public let FULL_TIME_SCORE_TWO_NIL : Float = 10;
    public let FULL_TIME_SCORE_THREE_NIL : Float = 25;
    public let FULL_TIME_SCORE_FOUR_NIL : Float = 50;
    public let FULL_TIME_SCORE_FIVE_NIL : Float = 75;

    public let FULL_TIME_SCORE_NIL_ONE : Float = 7;
    public let FULL_TIME_SCORE_NIL_TWO : Float = 12;
    public let FULL_TIME_SCORE_NIL_THREE : Float = 35;
    public let FULL_TIME_SCORE_NIL_FOUR : Float = 75;
    public let FULL_TIME_SCORE_NIL_FIVE : Float = 100;
    public let FULL_TIME_SCORE_OVER_NIL_SIX : Float = 150;

    public let FULL_TIME_SCORE_TWO_ONE : Float = 8;
    public let FULL_TIME_SCORE_ONE_TWO : Float = 10;
    public let FULL_TIME_SCORE_THREE_TWO : Float = 14;
    public let FULL_TIME_SCORE_TWO_THREE : Float = 18;
    public let FULL_TIME_SCORE_FOUR_THREE : Float = 24;
    public let FULL_TIME_SCORE_THREE_FOUR : Float = 35;
    public let FULL_TIME_SCORE_FIVE_FOUR : Float = 30;
    public let FULL_TIME_SCORE_FOUR_FIVE : Float = 40;

    public let FULL_TIME_SCORE_THREE_ONE : Float = 20;
    public let FULL_TIME_SCORE_ONE_THREE : Float = 24;    
    public let FULL_TIME_SCORE_FOUR_TWO : Float = 25;
    public let FULL_TIME_SCORE_TWO_FOUR : Float = 30;
    public let FULL_TIME_SCORE_FIVE_THREE : Float = 28;
    public let FULL_TIME_SCORE_THREE_FIVE : Float = 32;
    public let FULL_TIME_SCORE_SIX_FOUR : Float = 35;
    public let FULL_TIME_SCORE_FOUR_SIX : Float = 40;
    
    public let FULL_TIME_SCORE_FOUR_ONE : Float = 22;
    public let FULL_TIME_SCORE_ONE_FOUR : Float = 24;
    public let FULL_TIME_SCORE_FIVE_TWO : Float = 24;
    public let FULL_TIME_SCORE_TWO_FIVE : Float = 26;
    public let FULL_TIME_SCORE_SIX_THREE : Float = 28;
    public let FULL_TIME_SCORE_THREE_SIX : Float = 32;
    public let FULL_TIME_SCORE_FIVE_ONE : Float = 25;
    public let FULL_TIME_SCORE_ONE_FIVE : Float = 30;

    public let FULL_TIME_SCORE_SIX_TWO : Float = 30;
    public let FULL_TIME_SCORE_TWO_SIX : Float = 40;

    public let FULL_TIME_SCORE_SIX_ONE : Float = 40;
    public let FULL_TIME_SCORE_ONE_SIX : Float = 50;

    public let BOTH_TEAMS_NOT_TO_SCORE : Float = 3;
    public let BOTH_TEAMS_TO_SCORE : Float = 3;

    public let BOTH_TEAMS_TO_SCORE_AND_HOME_WIN : Float = 5;
    public let BOTH_TEAMS_TO_SCORE_AND_AWAY_WIN : Float = 7;
    public let BOTH_TEAMS_TO_SCORE_AND_DRAW : Float = 6;

    public let BOTH_TEAMS_NOT_TO_SCORE_AND_HOME_WIN : Float = 5;
    public let BOTH_TEAMS_NOT_TO_SCORE_AND_AWAY_WIN : Float = 7;
    public let BOTH_TEAMS_NOT_TO_SCORE_AND_DRAW : Float = 6;
    
    public let HOME_WIN_ODDS : Float = 3;
    public let DRAW_ODDS : Float = 2;
    public let AWAY_WIN_ODDS : Float = 4;
    
    public let OVER_ODDS_ZERO_POINT_FIVE : Float = 2;
    public let OVER_ODDS_ONE_POINT_FIVE : Float = 3;
    public let OVER_ODDS_TWO_POINT_FIVE : Float = 4;
    public let OVER_ODDS_THREE_POINT_FIVE : Float = 5;
    public let OVER_ODDS_FOUR_POINT_FIVE : Float = 6;
    public let OVER_ODDS_FIVE_POINT_FIVE : Float = 7;
    public let OVER_ODDS_SIX_POINT_FIVE : Float = 8;
    public let OVER_ODDS_SEVEN_POINT_FIVE : Float = 9;

    public let UNDER_ODDS_ZERO_POINT_FIVE : Float = 2;
    public let UNDER_ODDS_ONE_POINT_FIVE : Float = 3;
    public let UNDER_ODDS_TWO_POINT_FIVE : Float = 4;
    public let UNDER_ODDS_THREE_POINT_FIVE : Float = 5;
    public let UNDER_ODDS_FOUR_POINT_FIVE : Float = 6;
    public let UNDER_ODDS_FIVE_POINT_FIVE : Float = 7;
    public let UNDER_ODDS_SIX_POINT_FIVE : Float = 8;
    public let UNDER_ODDS_SEVEN_POINT_FIVE : Float = 9;

    public let HALF_TIME_FULL_TIME_DRAW_DRAW : Float = 2;
    public let HALF_TIME_FULL_TIME_DRAW_HOME : Float = 4;
    public let HALF_TIME_FULL_TIME_HOME_DRAW : Float = 6;
    public let HALF_TIME_FULL_TIME_DRAW_AWAY : Float = 8;
    public let HALF_TIME_FULL_TIME_AWAY_DRAW : Float = 8;
    public let HALF_TIME_FULL_TIME_HOME_HOME : Float = 7;
    public let HALF_TIME_FULL_TIME_AWAY_AWAY : Float = 8;
    public let HALF_TIME_FULL_TIME_HOME_AWAY : Float = 10;
    public let HALF_TIME_FULL_TIME_AWAY_HOME : Float = 10;

    public let HOME_TEAM_MISSES_PENALTY: Float = 5;
    public let AWAY_TEAM_MISSES_PENALTY: Float = 8;
};