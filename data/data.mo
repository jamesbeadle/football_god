/*
    
    
    
    //Leicester v Nottingham Forest
    let dto: GovernanceDTOs.SubmitFixtureDataDTO = {
      seasonId = 1;
      leagueId = 1;
      fixtureId = 88;
      playerEventData = [
        {
          clubId = 21;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 88;
          playerId = 637;
        },
        {
          clubId = 21;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 88;
          playerId = 637;
        },
        {
          clubId = 21;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 88;
          playerId = 637;
        },
        {
          clubId = 21;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 88;
          playerId = 638;
        },
        {
          clubId = 21;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 88;
          playerId = 646;
        },
        {
          clubId = 21;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 88;
          playerId = 639;
        },
        {
          clubId = 21;
          eventStartMinute = 0;
          eventEndMinute = 68;
          eventType = #Appearance;
          fixtureId = 88;
          playerId = 642;
        },
        {
          clubId = 21;
          eventStartMinute = 35;
          eventEndMinute = 35;
          eventType = #YellowCard;
          fixtureId = 88;
          playerId = 642;
        },
        {
          clubId = 21;
          eventStartMinute = 68;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 88;
          playerId = 765;
        },
        {
          clubId = 21;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 88;
          playerId = 647;
        },
        {
          clubId = 21;
          eventStartMinute = 58;
          eventEndMinute = 58;
          eventType = #YellowCard;
          fixtureId = 88;
          playerId = 647;
        },
        {
          clubId = 21;
          eventStartMinute = 0;
          eventEndMinute = 74;
          eventType = #Appearance;
          fixtureId = 88;
          playerId = 696;
        },
        {
          clubId = 21;
          eventStartMinute = 74;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 88;
          playerId = 724;
        },
        {
          clubId = 21;
          eventStartMinute = 90;
          eventEndMinute = 90;
          eventType = #YellowCard;
          fixtureId = 88;
          playerId = 724;
        },
        {
          clubId = 21;
          eventStartMinute = 0;
          eventEndMinute = 68;
          eventType = #Appearance;
          fixtureId = 88;
          playerId = 652;
        },
        {
          clubId = 21;
          eventStartMinute = 46;
          eventEndMinute = 46;
          eventType = #YellowCard;
          fixtureId = 88;
          playerId = 652;
        },
        {
          clubId = 21;
          eventStartMinute = 68;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 88;
          playerId = 235;
        },
        {
          clubId = 21;
          eventStartMinute = 88;
          eventEndMinute = 88;
          eventType = #YellowCard;
          fixtureId = 88;
          playerId = 235;
        },
        {
          clubId = 21;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 88;
          playerId = 140;
        },
        {
          clubId = 21;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 88;
          playerId = 650;
        },
        {
          clubId = 21;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 88;
          playerId = 651;
        },
        {
          clubId = 21;
          eventStartMinute = 23;
          eventEndMinute = 23;
          eventType = #Goal;
          fixtureId = 88;
          playerId = 651;
        },
        {
          clubId = 21;
          eventStartMinute = 23;
          eventEndMinute = 23;
          eventType = #GoalAssisted;
          fixtureId = 88;
          playerId = 647;
        },

        {
          clubId = 16;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 88;
          playerId = 432;
        },
        {
          clubId = 16;
          eventStartMinute = 60;
          eventEndMinute = 60;
          eventType = #GoalAssisted;
          fixtureId = 88;
          playerId = 432;
        },
        {
          clubId = 16;
          eventStartMinute = 0;
          eventEndMinute = 72;
          eventType = #Appearance;
          fixtureId = 88;
          playerId = 42;
        },
        {
          clubId = 16;
          eventStartMinute = 41;
          eventEndMinute = 41;
          eventType = #YellowCard;
          fixtureId = 88;
          playerId = 42;
        },
        {
          clubId = 16;
          eventStartMinute = 72;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 88;
          playerId = 766;
        },
        {
          clubId = 16;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 88;
          playerId = 442;
        },
        {
          clubId = 16;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 88;
          playerId = 705;
        },
        {
          clubId = 16;
          eventStartMinute = 90;
          eventEndMinute = 90;
          eventType = #YellowCard;
          fixtureId = 88;
          playerId = 705;
        },
        {
          clubId = 16;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 88;
          playerId = 443;
        },
        {
          clubId = 16;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 88;
          playerId = 447;
        },
        {
          clubId = 16;
          eventStartMinute = 78;
          eventEndMinute = 78;
          eventType = #YellowCard;
          fixtureId = 88;
          playerId = 447;
        },
        {
          clubId = 16;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 88;
          playerId = 449;
        },
        {
          clubId = 16;
          eventStartMinute = 16;
          eventEndMinute = 16;
          eventType = #Goal;
          fixtureId = 88;
          playerId = 449;
        },
        {
          clubId = 16;
          eventStartMinute = 0;
          eventEndMinute = 76;
          eventType = #Appearance;
          fixtureId = 88;
          playerId = 453;
        },
        {
          clubId = 16;
          eventStartMinute = 76;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 88;
          playerId = 758;
        },
        {
          clubId = 16;
          eventStartMinute = 0;
          eventEndMinute = 72;
          eventType = #Appearance;
          fixtureId = 88;
          playerId = 418;
        },
        {
          clubId = 16;
          eventStartMinute = 47;
          eventEndMinute = 47;
          eventType = #GoalAssisted;
          fixtureId = 88;
          playerId = 418;
        },
        {
          clubId = 16;
          eventStartMinute = 72;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 88;
          playerId = 435;
        },
        {
          clubId = 16;
          eventStartMinute = 0;
          eventEndMinute = 76;
          eventType = #Appearance;
          fixtureId = 88;
          playerId = 454;
        },
        {
          clubId = 16;
          eventStartMinute = 76;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 88;
          playerId = 708;
        },
        {
          clubId = 16;
          eventStartMinute = 0;
          eventEndMinute = 81;
          eventType = #Appearance;
          fixtureId = 88;
          playerId = 452;
        },
        {
          clubId = 16;
          eventStartMinute = 47;
          eventEndMinute = 47;
          eventType = #Goal;
          fixtureId = 88;
          playerId = 452;
        },
        {
          clubId = 16;
          eventStartMinute = 60;
          eventEndMinute = 60;
          eventType = #Goal;
          fixtureId = 88;
          playerId = 452;
        },
        {
          clubId = 16;
          eventStartMinute = 81;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 88;
          playerId = 451;
        },
      ];
    };

    //Villa v Bournemouth 82 - 2 v 3
    let dto1: GovernanceDTOs.SubmitFixtureDataDTO = {
      seasonId = 1;
      leagueId = 1;
      fixtureId = 82;
      playerEventData = [
        {
          clubId = 2;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 82;
          playerId = 31;
        },
        {
          clubId = 2;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 82;
          playerId = 31;
        },
        {
          clubId = 2;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 82;
          playerId = 31;
        },
        {
          clubId = 2;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 82;
          playerId = 36;
        },
        {
          clubId = 2;
          eventStartMinute = 90;
          eventEndMinute = 90;
          eventType = #YellowCard;
          fixtureId = 82;
          playerId = 36;
        },
        {
          clubId = 2;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 82;
          playerId = 38;
        },
        {
          clubId = 2;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 82;
          playerId = 41;
        },
        {
          clubId = 2;
          eventStartMinute = 0;
          eventEndMinute = 71;
          eventType = #Appearance;
          fixtureId = 82;
          playerId = 40;
        },
        {
          clubId = 2;
          eventStartMinute = 58;
          eventEndMinute = 58;
          eventType = #YellowCard;
          fixtureId = 82;
          playerId = 40;
        },
        {
          clubId = 2;
          eventStartMinute = 71;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 82;
          playerId = 561;
        },
        {
          clubId = 2;
          eventStartMinute = 0;
          eventEndMinute = 71;
          eventType = #Appearance;
          fixtureId = 82;
          playerId = 48;
        },
        {
          clubId = 2;
          eventStartMinute = 55;
          eventEndMinute = 55;
          eventType = #YellowCard;
          fixtureId = 82;
          playerId = 48;
        },
        {
          clubId = 2;
          eventStartMinute = 71;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 82;
          playerId = 54;
        },
        {
          clubId = 2;
          eventStartMinute = 76;
          eventEndMinute = 76;
          eventType = #GoalAssisted;
          fixtureId = 82;
          playerId = 54;
        },
        {
          clubId = 2;
          eventStartMinute = 0;
          eventEndMinute = 46;
          eventType = #Appearance;
          fixtureId = 82;
          playerId = 253;
        },
        {
          clubId = 2;
          eventStartMinute = 4;
          eventEndMinute = 4;
          eventType = #YellowCard;
          fixtureId = 82;
          playerId = 253;
        },
        {
          clubId = 2;
          eventStartMinute = 46;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 82;
          playerId = 332;
        },
        {
          clubId = 2;
          eventStartMinute = 76;
          eventEndMinute = 76;
          eventType = #Goal;
          fixtureId = 82;
          playerId = 332;
        },
        {
          clubId = 2;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 82;
          playerId = 49;
        },
        {
          clubId = 2;
          eventStartMinute = 18;
          eventEndMinute = 18;
          eventType = #YellowCard;
          fixtureId = 82;
          playerId = 49;
        },
        {
          clubId = 2;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 82;
          playerId = 55;
        },
        {
          clubId = 2;
          eventStartMinute = 41;
          eventEndMinute = 41;
          eventType = #YellowCard;
          fixtureId = 82;
          playerId = 55;
        },
        {
          clubId = 2;
          eventStartMinute = 0;
          eventEndMinute = 57;
          eventType = #Appearance;
          fixtureId = 82;
          playerId = 53;
        },
        {
          clubId = 2;
          eventStartMinute = 57;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 82;
          playerId = 60;
        },
        {
          clubId = 2;
          eventStartMinute = 0;
          eventEndMinute = 82;
          eventType = #Appearance;
          fixtureId = 82;
          playerId = 59;
        },
        {
          clubId = 2;
          eventStartMinute = 82;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 82;
          playerId = 56;
        },
        {
          clubId = 3;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 82;
          playerId = 64;
        },
        {
          clubId = 3;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 82;
          playerId = 64;
        },
        {
          clubId = 3;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 82;
          playerId = 64;
        },
        {
          clubId = 3;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 82;
          playerId = 64;
        },
        {
          clubId = 3;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 82;
          playerId = 64;
        },
        {
          clubId = 3;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 82;
          playerId = 64;
        },
        {
          clubId = 3;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 82;
          playerId = 64;
        },
        {
          clubId = 3;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 82;
          playerId = 64;
        },
        {
          clubId = 3;
          eventStartMinute = 0;
          eventEndMinute = 81;
          eventType = #Appearance;
          fixtureId = 82;
          playerId = 66;
        },
        {
          clubId = 3;
          eventStartMinute = 81;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 82;
          playerId = 684;
        },
        {
          clubId = 3;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 82;
          playerId = 71;
        },
        {
          clubId = 3;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 82;
          playerId = 72;
        },
        {
          clubId = 3;
          eventStartMinute = 0;
          eventEndMinute = 30;
          eventType = #Appearance;
          fixtureId = 82;
          playerId = 718;
        },
        {
          clubId = 3;
          eventStartMinute = 21;
          eventEndMinute = 21;
          eventType = #YellowCard;
          fixtureId = 82;
          playerId = 718;
        },
        {
          clubId = 3;
          eventStartMinute = 30;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 82;
          playerId = 69;
        },
        {
          clubId = 3;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 82;
          playerId = 74;
        },
        {
          clubId = 3;
          eventStartMinute = 0;
          eventEndMinute = 81;
          eventType = #Appearance;
          fixtureId = 82;
          playerId = 76;
        },
        {
          clubId = 3;
          eventStartMinute = 81;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 82;
          playerId = 79;
        },
        {
          clubId = 3;
          eventStartMinute = 81;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 82;
          playerId = 79;
        },
        {
          clubId = 3;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 82;
          playerId = 87;
        },
        {
          clubId = 3;
          eventStartMinute = 80;
          eventEndMinute = 80;
          eventType = #YellowCard;
          fixtureId = 82;
          playerId = 87;
        },
        {
          clubId = 3;
          eventStartMinute = 0;
          eventEndMinute = 64;
          eventType = #Appearance;
          fixtureId = 82;
          playerId = 85;
        },
        {
          clubId = 3;
          eventStartMinute = 10;
          eventEndMinute = 10;
          eventType = #YellowCard;
          fixtureId = 82;
          playerId = 85;
        },
        {
          clubId = 3;
          eventStartMinute = 64;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 82;
          playerId = 78;
        },
        {
          clubId = 3;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #GoalAssisted;
          fixtureId = 82;
          playerId = 78;
        },
        {
          clubId = 3;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 82;
          playerId = 83;
        },
        {
          clubId = 3;
          eventStartMinute = 0;
          eventEndMinute = 64;
          eventType = #Appearance;
          fixtureId = 82;
          playerId = 569;
        },
        {
          clubId = 3;
          eventStartMinute = 45;
          eventEndMinute = 45;
          eventType = #YellowCard;
          fixtureId = 82;
          playerId = 569;
        },
        {
          clubId = 3;
          eventStartMinute = 64;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 82;
          playerId = 739;
        },
        {
          clubId = 3;
          eventStartMinute = 90;
          eventEndMinute = 90;
          eventType = #Goal;
          fixtureId = 82;
          playerId = 739;
        }
      ];
    };

    //Brentford v Ipswich 83 - 4 v 22
    let dto2: GovernanceDTOs.SubmitFixtureDataDTO = {
      seasonId = 1;
      leagueId = 1;
      fixtureId = 83;
      playerEventData = [
        {
          clubId = 4;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 83;
          playerId = 88;
        },
        {
          clubId = 4;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 83;
          playerId = 88;
        },
        {
          clubId = 4;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 83;
          playerId = 88;
        },
        {
          clubId = 4;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 83;
          playerId = 741;
        },
        {
          clubId = 4;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 83;
          playerId = 95;
        },
        {
          clubId = 4;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 83;
          playerId = 100;
        },
        {
          clubId = 4;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 83;
          playerId = 101;
        },
        {
          clubId = 4;
          eventStartMinute = 90;
          eventEndMinute = 90;
          eventType = #GoalAssisted;
          fixtureId = 83;
          playerId = 101;
        },
        {
          clubId = 4;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 83;
          playerId = 111;
        },
        {
          clubId = 4;
          eventStartMinute = 44;
          eventEndMinute = 44;
          eventType = #GoalAssisted;
          fixtureId = 83;
          playerId = 111;
        },
        {
          clubId = 4;
          eventStartMinute = 0;
          eventEndMinute = 78;
          eventType = #Appearance;
          fixtureId = 83;
          playerId = 103;
        },
        {
          clubId = 4;
          eventStartMinute = 78;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 83;
          playerId = 104;
        },
        {
          clubId = 4;
          eventStartMinute = 0;
          eventEndMinute = 81;
          eventType = #Appearance;
          fixtureId = 83;
          playerId = 120;
        },
        {
          clubId = 4;
          eventStartMinute = 51;
          eventEndMinute = 51;
          eventType = #GoalAssisted;
          fixtureId = 83;
          playerId = 120;
        },
        {
          clubId = 4;
          eventStartMinute = 81;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 83;
          playerId = 599;
        },
        {
          clubId = 4;
          eventStartMinute = 0;
          eventEndMinute = 77;
          eventType = #Appearance;
          fixtureId = 83;
          playerId = 108;
        },
        {
          clubId = 4;
          eventStartMinute = 77;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 83;
          playerId = 116;
        },
        {
          clubId = 4;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 83;
          playerId = 119;
        },
        {
          clubId = 4;
          eventStartMinute = 51;
          eventEndMinute = 51;
          eventType = #Goal;
          fixtureId = 83;
          playerId = 119;
        },
        {
          clubId = 4;
          eventStartMinute = 90;
          eventEndMinute = 90;
          eventType = #Goal;
          fixtureId = 83;
          playerId = 119;
        },
        {
          clubId = 4;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 83;
          playerId = 106;
        },
        {
          clubId = 4;
          eventStartMinute = 44;
          eventEndMinute = 44;
          eventType = #Goal;
          fixtureId = 83;
          playerId = 106;
        },
        {
          clubId = 4;
          eventStartMinute = 45;
          eventEndMinute = 45;
          eventType = #GoalAssisted;
          fixtureId = 83;
          playerId = 106;
        },
        {
          clubId = 22;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 83;
          playerId = 617;
        },
        {
          clubId = 22;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 83;
          playerId = 617;
        },
        {
          clubId = 22;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 83;
          playerId = 617;
        },
        {
          clubId = 22;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 83;
          playerId = 617;
        },
        {
          clubId = 22;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 83;
          playerId = 617;
        },
        {
          clubId = 22;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 83;
          playerId = 617;
        },
        {
          clubId = 22;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 83;
          playerId = 617;
        },
        {
          clubId = 22;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 83;
          playerId = 617;
        },
        {
          clubId = 22;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 83;
          playerId = 619;
        },
        {
          clubId = 22;
          eventStartMinute = 42;
          eventEndMinute = 42;
          eventType = #YellowCard;
          fixtureId = 83;
          playerId = 619;
        },
        {
          clubId = 22;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 83;
          playerId = 622;
        },
        {
          clubId = 22;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 83;
          playerId = 748;
        },
        {
          clubId = 22;
          eventStartMinute = 0;
          eventEndMinute = 69;
          eventType = #Appearance;
          fixtureId = 83;
          playerId = 618;
        },
        {
          clubId = 22;
          eventStartMinute = 45;
          eventEndMinute = 45;
          eventType = #OwnGoal;
          fixtureId = 83;
          playerId = 618;
        },
        {
          clubId = 22;
          eventStartMinute = 69;
          eventEndMinute = 69;
          eventType = #RedCard;
          fixtureId = 83;
          playerId = 618;
        },
        {
          clubId = 22;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 83;
          playerId = 749;
        },
        {
          clubId = 22;
          eventStartMinute = 90;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 83;
          playerId = 747;
        },
        {
          clubId = 22;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 83;
          playerId = 526;
        },
        {
          clubId = 22;
          eventStartMinute = 0;
          eventEndMinute = 73;
          eventType = #Appearance;
          fixtureId = 83;
          playerId = 710;
        },
        {
          clubId = 22;
          eventStartMinute = 28;
          eventEndMinute = 28;
          eventType = #Goal;
          fixtureId = 83;
          playerId = 710;
        },
        {
          clubId = 22;
          eventStartMinute = 73;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 83;
          playerId = 750;
        },
        {
          clubId = 22;
          eventStartMinute = 0;
          eventEndMinute = 73;
          eventType = #Appearance;
          fixtureId = 83;
          playerId = 630;
        },
        {
          clubId = 22;
          eventStartMinute = 73;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 83;
          playerId = 621;
        },
        {
          clubId = 22;
          eventStartMinute = 0;
          eventEndMinute = 35;
          eventType = #Appearance;
          fixtureId = 83;
          playerId = 734;
        },
        {
          clubId = 22;
          eventStartMinute = 35;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 83;
          playerId = 626;
        },
        {
          clubId = 22;
          eventStartMinute = 0;
          eventEndMinute = 73;
          eventType = #Appearance;
          fixtureId = 83;
          playerId = 634;
        },
        {
          clubId = 22;
          eventStartMinute = 31;
          eventEndMinute = 31;
          eventType = #Goal;
          fixtureId = 83;
          playerId = 634;
        },
        {
          clubId = 22;
          eventStartMinute = 73;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 83;
          playerId = 635;
        },
        {
          clubId = 22;
          eventStartMinute = 86;
          eventEndMinute = 86;
          eventType = #Goal;
          fixtureId = 83;
          playerId = 635;
        },
      ];
    };
    
    //Brighton v Wolves 84 - 5 v 20
    let dto3: GovernanceDTOs.SubmitFixtureDataDTO = {
      seasonId = 1;
      leagueId = 1;
      fixtureId = 84;
      playerEventData = [
        {
          clubId = 5;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 84;
          playerId = 121;
        },
        {
          clubId = 5;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 84;
          playerId = 121;
        },
        {
          clubId = 5;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 84;
          playerId = 121;
        },
        {
          clubId = 5;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 84;
          playerId = 121;
        },
        {
          clubId = 5;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 84;
          playerId = 121;
        },
        {
          clubId = 5;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 84;
          playerId = 121;
        },
        {
          clubId = 5;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 84;
          playerId = 129;
        },
        {
          clubId = 5;
          eventStartMinute = 74;
          eventEndMinute = 74;
          eventType = #YellowCard;
          fixtureId = 84;
          playerId = 129;
        },
        {
          clubId = 5;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 84;
          playerId = 125;
        },
        {
          clubId = 5;
          eventStartMinute = 70;
          eventEndMinute = 70;
          eventType = #YellowCard;
          fixtureId = 84;
          playerId = 125;
        },
        {
          clubId = 5;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 84;
          playerId = 128;
        },
        {
          clubId = 5;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 84;
          playerId = 130;
        },
        {
          clubId = 5;
          eventStartMinute = 0;
          eventEndMinute = 89;
          eventType = #Appearance;
          fixtureId = 84;
          playerId = 139;
        },
        {
          clubId = 5;
          eventStartMinute = 89;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 84;
          playerId = 143;
        },
        {
          clubId = 5;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 84;
          playerId = 680;
        },
        {
          clubId = 5;
          eventStartMinute = 0;
          eventEndMinute = 80;
          eventType = #Appearance;
          fixtureId = 84;
          playerId = 138;
        },
        {
          clubId = 5;
          eventStartMinute = 80;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 84;
          playerId = 578;
        },
        {
          clubId = 5;
          eventStartMinute = 0;
          eventEndMinute = 72;
          eventType = #Appearance;
          fixtureId = 84;
          playerId = 727;
        },
        {
          clubId = 5;
          eventStartMinute = 72;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 84;
          playerId = 728;
        },
        {
          clubId = 5;
          eventStartMinute = 0;
          eventEndMinute = 73;
          eventType = #Appearance;
          fixtureId = 84;
          playerId = 144;
        },
        {
          clubId = 5;
          eventStartMinute = 45;
          eventEndMinute = 45;
          eventType = #Goal;
          fixtureId = 84;
          playerId = 144;
        },
        {
          clubId = 5;
          eventStartMinute = 73;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 84;
          playerId = 146;
        },
        {
          clubId = 5;
          eventStartMinute = 85;
          eventEndMinute = 85;
          eventType = #Goal;
          fixtureId = 84;
          playerId = 146;
        },
        {
          clubId = 5;
          eventStartMinute = 0;
          eventEndMinute = 80;
          eventType = #Appearance;
          fixtureId = 84;
          playerId = 730;
        },
        {
          clubId = 5;
          eventStartMinute = 56;
          eventEndMinute = 56;
          eventType = #YellowCard;
          fixtureId = 84;
          playerId = 730;
        },
        {
          clubId = 5;
          eventStartMinute = 45;
          eventEndMinute = 45;
          eventType = #GoalAssisted;
          fixtureId = 84;
          playerId = 730;
        },
        {
          clubId = 5;
          eventStartMinute = 80;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 84;
          playerId = 124;
        },
        {
          clubId = 5;
          eventStartMinute = 85;
          eventEndMinute = 85;
          eventType = #GoalAssisted;
          fixtureId = 84;
          playerId = 124;
        },
        {
          clubId = 20;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 84;
          playerId = 536;
        },
        {
          clubId = 20;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 84;
          playerId = 536;
        },
        {
          clubId = 20;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 84;
          playerId = 536;
        },
        {
          clubId = 20;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 84;
          playerId = 536;
        },
        {
          clubId = 20;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 84;
          playerId = 536;
        },
        {
          clubId = 20;
          eventStartMinute = 0;
          eventEndMinute = 46;
          eventType = #Appearance;
          fixtureId = 84;
          playerId = 614;
        },
        {
          clubId = 20;
          eventStartMinute = 41;
          eventEndMinute = 41;
          eventType = #YellowCard;
          fixtureId = 84;
          playerId = 614;
        },
        {
          clubId = 20;
          eventStartMinute = 46;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 84;
          playerId = 767;
        },
        {
          clubId = 20;
          eventStartMinute = 90;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 84;
          playerId = 614;
        },
        {
          clubId = 20;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 84;
          playerId = 542;
        },
        {
          clubId = 20;
          eventStartMinute = 88;
          eventEndMinute = 88;
          eventType = #GoalAssisted;
          fixtureId = 84;
          playerId = 542;
        },
        {
          clubId = 20;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 84;
          playerId = 543;
        },
        {
          clubId = 20;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 84;
          playerId = 540;
        },
        {
          clubId = 20;
          eventStartMinute = 50;
          eventEndMinute = 50;
          eventType = #YellowCard;
          fixtureId = 84;
          playerId = 540;
        },
        {
          clubId = 20;
          eventStartMinute = 88;
          eventEndMinute = 88;
          eventType = #Goal;
          fixtureId = 84;
          playerId = 540;
        },
        {
          clubId = 20;
          eventStartMinute = 0;
          eventEndMinute = 46;
          eventType = #Appearance;
          fixtureId = 84;
          playerId = 547;
        },
        {
          clubId = 20;
          eventStartMinute = 46;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 84;
          playerId = 557;
        },
        {
          clubId = 20;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 84;
          playerId = 550;
        },
        {
          clubId = 20;
          eventStartMinute = 90;
          eventEndMinute = 90;
          eventType = #GoalAssisted;
          fixtureId = 84;
          playerId = 550;
        },
        {
          clubId = 20;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 84;
          playerId = 544;
        },
        {
          clubId = 20;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 84;
          playerId = 555;
        },
        {
          clubId = 20;
          eventStartMinute = 90;
          eventEndMinute = 90;
          eventType = #Goal;
          fixtureId = 84;
          playerId = 555;
        },
        {
          clubId = 20;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 84;
          playerId = 549;
        },
        {
          clubId = 20;
          eventStartMinute = 90;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 84;
          playerId = 768;
        },
        {
          clubId = 20;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 84;
          playerId = 613;
        },
        {
          clubId = 20;
          eventStartMinute = 45;
          eventEndMinute = 45;
          eventType = #YellowCard;
          fixtureId = 84;
          playerId = 613;
        },
        {
          clubId = 20;
          eventStartMinute = 90;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 84;
          playerId = 769;
        },
      ];
    };

    //Man City v Southampton 89 - 13 v 23
    let dto4: GovernanceDTOs.SubmitFixtureDataDTO = {
      seasonId = 1;
      leagueId = 1;
      fixtureId = 89;
      playerEventData = [
        {
          clubId = 13;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 89;
          playerId = 351;
        },
        {
          clubId = 13;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 89;
          playerId = 351;
        },
        {
          clubId = 13;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 89;
          playerId = 351;
        },
        {
          clubId = 13;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 89;
          playerId = 358;
        },
        {
          clubId = 13;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 89;
          playerId = 356;
        },
        {
          clubId = 13;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 89;
          playerId = 353;
        },
        {
          clubId = 13;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 89;
          playerId = 359;
        },
        {
          clubId = 13;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 89;
          playerId = 360;
        },
        {
          clubId = 13;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 89;
          playerId = 367;
        },
        {
          clubId = 13;
          eventStartMinute = 88;
          eventEndMinute = 88;
          eventType = #YellowCard;
          fixtureId = 89;
          playerId = 367;
        },
        {
          clubId = 13;
          eventStartMinute = 0;
          eventEndMinute = 86;
          eventType = #Appearance;
          fixtureId = 89;
          playerId = 368;
        },
        {
          clubId = 13;
          eventStartMinute = 5;
          eventEndMinute = 5;
          eventType = #GoalAssisted;
          fixtureId = 89;
          playerId = 368;
        },
        {
          clubId = 13;
          eventStartMinute = 86;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 89;
          playerId = 756;
        },
        {
          clubId = 13;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 89;
          playerId = 371;
        },
        {
          clubId = 13;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 89;
          playerId = 365;
        },
        {
          clubId = 13;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 89;
          playerId = 601;
        },
        {
          clubId = 13;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 89;
          playerId = 373;
        },
        {
          clubId = 13;
          eventStartMinute = 5;
          eventEndMinute = 5;
          eventType = #Goal;
          fixtureId = 89;
          playerId = 373;
        },
        {
          clubId = 23;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 89;
          playerId = 1;
        },
        {
          clubId = 23;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 89;
          playerId = 1;
        },
        {
          clubId = 23;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 89;
          playerId = 1;
        },
        {
          clubId = 23;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 89;
          playerId = 1;
        },
        {
          clubId = 23;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 89;
          playerId = 1;
        },
        {
          clubId = 23;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 89;
          playerId = 1;
        },
        {
          clubId = 23;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 89;
          playerId = 1;
        },
        {
          clubId = 23;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 89;
          playerId = 662;
        },
        {
          clubId = 23;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 89;
          playerId = 656;
        },
        {
          clubId = 23;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 89;
          playerId = 659;
        },
        {
          clubId = 23;
          eventStartMinute = 0;
          eventEndMinute = 77;
          eventType = #Appearance;
          fixtureId = 89;
          playerId = 661;
        },
        {
          clubId = 23;
          eventStartMinute = 77;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 89;
          playerId = 657;
        },
        {
          clubId = 23;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 89;
          playerId = 714;
        },
        {
          clubId = 23;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 89;
          playerId = 760;
        },
        {
          clubId = 23;
          eventStartMinute = 0;
          eventEndMinute = 60;
          eventType = #Appearance;
          fixtureId = 89;
          playerId = 136;
        },
        {
          clubId = 23;
          eventStartMinute = 56;
          eventEndMinute = 56;
          eventType = #YellowCard;
          fixtureId = 89;
          playerId = 136;
        },
        {
          clubId = 23;
          eventStartMinute = 60;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 89;
          playerId = 667;
        },
        {
          clubId = 23;
          eventStartMinute = 0;
          eventEndMinute = 87;
          eventType = #Appearance;
          fixtureId = 89;
          playerId = 669;
        },
        {
          clubId = 23;
          eventStartMinute = 42;
          eventEndMinute = 42;
          eventType = #YellowCard;
          fixtureId = 89;
          playerId = 669;
        },
        {
          clubId = 23;
          eventStartMinute = 87;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 89;
          playerId = 761;
        },
        {
          clubId = 23;
          eventStartMinute = 0;
          eventEndMinute = 46;
          eventType = #Appearance;
          fixtureId = 89;
          playerId = 716;
        },
        {
          clubId = 23;
          eventStartMinute = 46;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 89;
          playerId = 672;
        },
        {
          clubId = 23;
          eventStartMinute = 0;
          eventEndMinute = 87;
          eventType = #Appearance;
          fixtureId = 89;
          playerId = 482;
        },
        {
          clubId = 23;
          eventStartMinute = 87;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 89;
          playerId = 770;
        },
      ];
    };

    //Everton v Fulham 87 - 9 v 10
    let dto5: GovernanceDTOs.SubmitFixtureDataDTO = {
      seasonId = 1;
      leagueId = 1;
      fixtureId = 87;
      playerEventData = [
        {
          clubId = 9;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 87;
          playerId = 241;
        },
        {
          clubId = 9;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 87;
          playerId = 241;
        },
        {
          clubId = 9;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 87;
          playerId = 241;
        },
        {
          clubId = 9;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 87;
          playerId = 249;
        },
        {
          clubId = 9;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 87;
          playerId = 246;
        },
        {
          clubId = 9;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 87;
          playerId = 247;
        },
        {
          clubId = 9;
          eventStartMinute = 76;
          eventEndMinute = 76;
          eventType = #YellowCard;
          fixtureId = 87;
          playerId = 247;
        },
        {
          clubId = 9;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 87;
          playerId = 248;
        },
        {
          clubId = 9;
          eventStartMinute = 90;
          eventEndMinute = 90;
          eventType = #GoalAssisted;
          fixtureId = 87;
          playerId = 248;
        },
        {
          clubId = 9;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 87;
          playerId = 257;
        },
        {
          clubId = 9;
          eventStartMinute = 0;
          eventEndMinute = 80;
          eventType = #Appearance;
          fixtureId = 87;
          playerId = 254;
        },
        {
          clubId = 9;
          eventStartMinute = 80;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 87;
          playerId = 745;
        },
        {
          clubId = 9;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 87;
          playerId = 596;
        },
        {
          clubId = 9;
          eventStartMinute = 0;
          eventEndMinute = 86;
          eventType = #Appearance;
          fixtureId = 87;
          playerId = 260;
        },
        {
          clubId = 9;
          eventStartMinute = 86;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 87;
          playerId = 252;
        },
        {
          clubId = 9;
          eventStartMinute = 0;
          eventEndMinute = 68;
          eventType = #Appearance;
          fixtureId = 87;
          playerId = 693;
        },
        {
          clubId = 9;
          eventStartMinute = 68;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 87;
          playerId = 694;
        },
        {
          clubId = 9;
          eventStartMinute = 0;
          eventEndMinute = 81;
          eventType = #Appearance;
          fixtureId = 87;
          playerId = 261;
        },
        {
          clubId = 9;
          eventStartMinute = 81;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 87;
          playerId = 264;
        },
        {
          clubId = 9;
          eventStartMinute = 90;
          eventEndMinute = 90;
          eventType = #Goal;
          fixtureId = 87;
          playerId = 264;
        },
        {
          clubId = 10;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 87;
          playerId = 268;
        },
        {
          clubId = 10;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 87;
          playerId = 268;
        },
        {
          clubId = 10;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 87;
          playerId = 268;
        },
        {
          clubId = 10;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 87;
          playerId = 268;
        },
        {
          clubId = 10;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 87;
          playerId = 268;
        },
        {
          clubId = 10;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 87;
          playerId = 277;
        },
        {
          clubId = 10;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 87;
          playerId = 271;
        },
        {
          clubId = 10;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 87;
          playerId = 276;
        },
        {
          clubId = 10;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 87;
          playerId = 270;
        },
        {
          clubId = 10;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 87;
          playerId = 746;
        },
        {
          clubId = 10;
          eventStartMinute = 0;
          eventEndMinute = 79;
          eventType = #Appearance;
          fixtureId = 87;
          playerId = 280;
        },
        {
          clubId = 10;
          eventStartMinute = 79;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 87;
          playerId = 284;
        },
        {
          clubId = 10;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 87;
          playerId = 289;
        },
        {
          clubId = 10;
          eventStartMinute = 61;
          eventEndMinute = 61;
          eventType = #Goal;
          fixtureId = 87;
          playerId = 289;
        },
        {
          clubId = 10;
          eventStartMinute = 90;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 87;
          playerId = 695;
        },
        {
          clubId = 10;
          eventStartMinute = 0;
          eventEndMinute = 79;
          eventType = #Appearance;
          fixtureId = 87;
          playerId = 15;
        },
        {
          clubId = 10;
          eventStartMinute = 61;
          eventEndMinute = 61;
          eventType = #GoalAssisted;
          fixtureId = 87;
          playerId = 15;
        },
        {
          clubId = 10;
          eventStartMinute = 79;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 87;
          playerId = 278;
        },
        {
          clubId = 10;
          eventStartMinute = 0;
          eventEndMinute = 68;
          eventType = #Appearance;
          fixtureId = 87;
          playerId = 285;
        },
        {
          clubId = 10;
          eventStartMinute = 68;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 87;
          playerId = 28;
        },
        {
          clubId = 10;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 87;
          playerId = 283;
        },
        {
          clubId = 10;
          eventStartMinute = 90;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 87;
          playerId = 287;
        },
      ];
    };

    //Chelsea v Newcastle 85 - 7 v 15
    let dto6: GovernanceDTOs.SubmitFixtureDataDTO = {
      seasonId = 1;
      leagueId = 1;
      fixtureId = 85;
      playerEventData = [
        {
          clubId = 7;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 85;
          playerId = 175;
        },
        {
          clubId = 7;
          eventStartMinute = 84;
          eventEndMinute = 84;
          eventType = #YellowCard;
          fixtureId = 85;
          playerId = 175;
        },
        {
          clubId = 7;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 85;
          playerId = 175;
        },
        {
          clubId = 7;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 85;
          playerId = 185;
        },
        {
          clubId = 7;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 85;
          playerId = 186;
        },
        {
          clubId = 7;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 85;
          playerId = 188;
        },
        {
          clubId = 7;
          eventStartMinute = 11;
          eventEndMinute = 11;
          eventType = #YellowCard;
          fixtureId = 85;
          playerId = 188;
        },
        {
          clubId = 7;
          eventStartMinute = 0;
          eventEndMinute = 78;
          eventType = #Appearance;
          fixtureId = 85;
          playerId = 187;
        },
        {
          clubId = 7;
          eventStartMinute = 78;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 85;
          playerId = 180;
        },
        {
          clubId = 7;
          eventStartMinute = 0;
          eventEndMinute = 72;
          eventType = #Appearance;
          fixtureId = 85;
          playerId = 197;
        },
        {
          clubId = 7;
          eventStartMinute = 54;
          eventEndMinute = 54;
          eventType = #YellowCard;
          fixtureId = 85;
          playerId = 197;
        },
        {
          clubId = 7;
          eventStartMinute = 47;
          eventEndMinute = 47;
          eventType = #GoalAssisted;
          fixtureId = 85;
          playerId = 197;
        },
        {
          clubId = 7;
          eventStartMinute = 72;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 85;
          playerId = 191;
        },
        {
          clubId = 7;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 85;
          playerId = 195;
        },
        {
          clubId = 7;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 85;
          playerId = 553;
        },
        {
          clubId = 7;
          eventStartMinute = 88;
          eventEndMinute = 88;
          eventType = #YellowCard;
          fixtureId = 85;
          playerId = 553;
        },
        {
          clubId = 7;
          eventStartMinute = 18;
          eventEndMinute = 18;
          eventType = #GoalAssisted;
          fixtureId = 85;
          playerId = 553;
        },
        {
          clubId = 7;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 85;
          playerId = 202;
        },
        {
          clubId = 7;
          eventStartMinute = 47;
          eventEndMinute = 47;
          eventType = #Goal;
          fixtureId = 85;
          playerId = 202;
        },
        {
          clubId = 7;
          eventStartMinute = 0;
          eventEndMinute = 67;
          eventType = #Appearance;
          fixtureId = 85;
          playerId = 201;
        },
        {
          clubId = 7;
          eventStartMinute = 65;
          eventEndMinute = 65;
          eventType = #YellowCard;
          fixtureId = 85;
          playerId = 201;
        },
        {
          clubId = 7;
          eventStartMinute = 67;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 85;
          playerId = 200;
        },
        {
          clubId = 7;
          eventStartMinute = 0;
          eventEndMinute = 78;
          eventType = #Appearance;
          fixtureId = 85;
          playerId = 205;
        },
        {
          clubId = 7;
          eventStartMinute = 18;
          eventEndMinute = 18;
          eventType = #Goal;
          fixtureId = 85;
          playerId = 205;
        },
        {
          clubId = 7;
          eventStartMinute = 78;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 85;
          playerId = 204;
        },
        {
          clubId = 15;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 85;
          playerId = 404;
        },
        {
          clubId = 15;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 85;
          playerId = 404;
        },
        {
          clubId = 15;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 85;
          playerId = 404;
        },
        {
          clubId = 15;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 85;
          playerId = 404;
        },
        {
          clubId = 15;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 85;
          playerId = 404;
        },
        {
          clubId = 15;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 85;
          playerId = 404;
        },
        {
          clubId = 15;
          eventStartMinute = 0;
          eventEndMinute = 89;
          eventType = #Appearance;
          fixtureId = 85;
          playerId = 408;
        },
        {
          clubId = 15;
          eventStartMinute = 32;
          eventEndMinute = 32;
          eventType = #GoalAssisted;
          fixtureId = 85;
          playerId = 408;
        },
        {
          clubId = 15;
          eventStartMinute = 89;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 85;
          playerId = 67;
        },
        {
          clubId = 15;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 85;
          playerId = 406;
        },
        {
          clubId = 15;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 85;
          playerId = 413;
        },
        {
          clubId = 15;
          eventStartMinute = 22;
          eventEndMinute = 22;
          eventType = #YellowCard;
          fixtureId = 85;
          playerId = 413;
        },
        {
          clubId = 15;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 85;
          playerId = 411;
        },
        {
          clubId = 15;
          eventStartMinute = 0;
          eventEndMinute = 89;
          eventType = #Appearance;
          fixtureId = 85;
          playerId = 416;
        },
        {
          clubId = 15;
          eventStartMinute = 89;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 85;
          playerId = 483;
        },
        {
          clubId = 15;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 85;
          playerId = 419;
        },
        {
          clubId = 15;
          eventStartMinute = 0;
          eventEndMinute = 68;
          eventType = #Appearance;
          fixtureId = 85;
          playerId = 424;
        },
        {
          clubId = 15;
          eventStartMinute = 64;
          eventEndMinute = 64;
          eventType = #YellowCard;
          fixtureId = 85;
          playerId = 424;
        },
        {
          clubId = 15;
          eventStartMinute = 68;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 85;
          playerId = 420;
        },
        {
          clubId = 15;
          eventStartMinute = 0;
          eventEndMinute = 68;
          eventType = #Appearance;
          fixtureId = 85;
          playerId = 425;
        },
        {
          clubId = 15;
          eventStartMinute = 68;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 85;
          playerId = 605;
        },
        {
          clubId = 15;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 85;
          playerId = 427;
        },
        {
          clubId = 15;
          eventStartMinute = 32;
          eventEndMinute = 32;
          eventType = #Goal;
          fixtureId = 85;
          playerId = 427;
        },
        {
          clubId = 15;
          eventStartMinute = 0;
          eventEndMinute = 68;
          eventType = #Appearance;
          fixtureId = 85;
          playerId = 417;
        },
        {
          clubId = 15;
          eventStartMinute = 68;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 85;
          playerId = 422;
        },
      ];
    };

    //Palace v Tottenham 86 - 8 v 18
    let dto7: GovernanceDTOs.SubmitFixtureDataDTO = {
      seasonId = 1;
      leagueId = 1;
      fixtureId = 86;
      playerEventData = [

        {
          clubId = 8;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 86;
          playerId = 209;
        },
        {
          clubId = 8;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 86;
          playerId = 209;
        },
        {
          clubId = 8;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 86;
          playerId = 209;
        },
        {
          clubId = 8;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 86;
          playerId = 209;
        },
        {
          clubId = 8;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 86;
          playerId = 216;
        },
        {
          clubId = 8;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 86;
          playerId = 743;
        },
        {
          clubId = 8;
          eventStartMinute = 61;
          eventEndMinute = 61;
          eventType = #YellowCard;
          fixtureId = 86;
          playerId = 743;
        },
        {
          clubId = 8;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 86;
          playerId = 183;
        },
        {
          clubId = 8;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 86;
          playerId = 213;
        },
        {
          clubId = 8;
          eventStartMinute = 0;
          eventEndMinute = 22;
          eventType = #Appearance;
          fixtureId = 86;
          playerId = 223;
        },
        {
          clubId = 8;
          eventStartMinute = 22;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 86;
          playerId = 226;
        },
        {
          clubId = 8;
          eventStartMinute = 0;
          eventEndMinute = 88;
          eventType = #Appearance;
          fixtureId = 86;
          playerId = 227;
        },
        {
          clubId = 8;
          eventStartMinute = 88;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 86;
          playerId = 590;
        },
        {
          clubId = 8;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 86;
          playerId = 217;
        },
        {
          clubId = 8;
          eventStartMinute = 41;
          eventEndMinute = 41;
          eventType = #YellowCard;
          fixtureId = 86;
          playerId = 217;
        },
        {
          clubId = 8;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 86;
          playerId = 224;
        },
        {
          clubId = 8;
          eventStartMinute = 31;
          eventEndMinute = 31;
          eventType = #GoalAssisted;
          fixtureId = 86;
          playerId = 224;
        },
        {
          clubId = 8;
          eventStartMinute = 0;
          eventEndMinute = 67;
          eventType = #Appearance;
          fixtureId = 86;
          playerId = 691;
        },
        {
          clubId = 8;
          eventStartMinute = 67;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 86;
          playerId = 26;
        },
        {
          clubId = 8;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 86;
          playerId = 237;
        },
        {
          clubId = 8;
          eventStartMinute = 32;
          eventEndMinute = 32;
          eventType = #YellowCard;
          fixtureId = 86;
          playerId = 237;
        },
        {
          clubId = 8;
          eventStartMinute = 31;
          eventEndMinute = 31;
          eventType = #Goal;
          fixtureId = 86;
          playerId = 237;
        },
        {
          clubId = 18;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 86;
          playerId = 485;
        },
        {
          clubId = 18;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 86;
          playerId = 485;
        },
        {
          clubId = 18;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 86;
          playerId = 485;
        },
        {
          clubId = 18;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 86;
          playerId = 485;
        },
        {
          clubId = 18;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 86;
          playerId = 485;
        },
        {
          clubId = 18;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 86;
          playerId = 485;
        },
        {
          clubId = 18;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 86;
          playerId = 494;
        },
        {
          clubId = 18;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 86;
          playerId = 493;
        },
        {
          clubId = 18;
          eventStartMinute = 65;
          eventEndMinute = 65;
          eventType = #YellowCard;
          fixtureId = 86;
          playerId = 493;
        },
        {
          clubId = 18;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 86;
          playerId = 490;
        },
        {
          clubId = 18;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 86;
          playerId = 491;
        },
        {
          clubId = 18;
          eventStartMinute = 0;
          eventEndMinute = 62;
          eventType = #Appearance;
          fixtureId = 86;
          playerId = 501;
        },
        {
          clubId = 18;
          eventStartMinute = 62;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 86;
          playerId = 509;
        },
        {
          clubId = 18;
          eventStartMinute = 0;
          eventEndMinute = 87;
          eventType = #Appearance;
          fixtureId = 86;
          playerId = 499;
        },
        {
          clubId = 18;
          eventStartMinute = 87;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 86;
          playerId = 508;
        },
        {
          clubId = 18;
          eventStartMinute = 0;
          eventEndMinute = 62;
          eventType = #Appearance;
          fixtureId = 86;
          playerId = 504;
        },
        {
          clubId = 18;
          eventStartMinute = 37;
          eventEndMinute = 37;
          eventType = #YellowCard;
          fixtureId = 86;
          playerId = 504;
        },
        {
          clubId = 18;
          eventStartMinute = 62;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 86;
          playerId = 507;
        },
        {
          clubId = 18;
          eventStartMinute = 0;
          eventEndMinute = 62;
          eventType = #Appearance;
          fixtureId = 86;
          playerId = 771;
        },
        {
          clubId = 18;
          eventStartMinute = 62;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 86;
          playerId = 510;
        },
        {
          clubId = 18;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 86;
          playerId = 82;
        },
        {
          clubId = 18;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 86;
          playerId = 505;
        },
        {
          clubId = 18;
          eventStartMinute = 52;
          eventEndMinute = 52;
          eventType = #YellowCard;
          fixtureId = 86;
          playerId = 505;
        },
      ];
    };

    //West Ham v Man United 90 - 19 v 14
    let dto8: GovernanceDTOs.SubmitFixtureDataDTO = {
      seasonId = 1;
      leagueId = 1;
      fixtureId = 90;
      playerEventData = [
        {
          clubId = 19;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 90;
          playerId = 512;
        },
        {
          clubId = 19;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 90;
          playerId = 512;
        },
        {
          clubId = 19;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 90;
          playerId = 512;
        },
        {
          clubId = 19;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 90;
          playerId = 512;
        },
        {
          clubId = 19;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 90;
          playerId = 512;
        },
        {
          clubId = 19;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 90;
          playerId = 523;
        },
        {
          clubId = 19;
          eventStartMinute = 90;
          eventEndMinute = 90;
          eventType = #YellowCard;
          fixtureId = 90;
          playerId = 523;
        },
        {
          clubId = 19;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 90;
          playerId = 611;
        },
        {
          clubId = 19;
          eventStartMinute = 0;
          eventEndMinute = 46;
          eventType = #Appearance;
          fixtureId = 90;
          playerId = 519;
        },
        {
          clubId = 19;
          eventStartMinute = 30;
          eventEndMinute = 30;
          eventType = #YellowCard;
          fixtureId = 90;
          playerId = 519;
        },
        {
          clubId = 19;
          eventStartMinute = 46;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 90;
          playerId = 719;
        },
        {
          clubId = 19;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 90;
          playerId = 384;
        },
        {
          clubId = 19;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 90;
          playerId = 720;
        },
        {
          clubId = 19;
          eventStartMinute = 90;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 90;
          playerId = 516;
        },
        {
          clubId = 19;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 90;
          playerId = 529;
        },
        {
          clubId = 19;
          eventStartMinute = 0;
          eventEndMinute = 46;
          eventType = #Appearance;
          fixtureId = 90;
          playerId = 763;
        },
        {
          clubId = 19;
          eventStartMinute = 46;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 90;
          playerId = 721;
        },
        {
          clubId = 19;
          eventStartMinute = 74;
          eventEndMinute = 74;
          eventType = #Goal;
          fixtureId = 90;
          playerId = 721;
        },
        {
          clubId = 19;
          eventStartMinute = 0;
          eventEndMinute = 46;
          eventType = #Appearance;
          fixtureId = 90;
          playerId = 525;
        },
        {
          clubId = 19;
          eventStartMinute = 25;
          eventEndMinute = 25;
          eventType = #YellowCard;
          fixtureId = 90;
          playerId = 525;
        },
        {
          clubId = 19;
          eventStartMinute = 46;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 90;
          playerId = 530;
        },
        {
          clubId = 19;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 90;
          playerId = 533;
        },
        {
          clubId = 19;
          eventStartMinute = 90;
          eventEndMinute = 90;
          eventType = #Goal;
          fixtureId = 90;
          playerId = 533;
        },
        {
          clubId = 19;
          eventStartMinute = 0;
          eventEndMinute = 71;
          eventType = #Appearance;
          fixtureId = 90;
          playerId = 531;
        },
        {
          clubId = 19;
          eventStartMinute = 71;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 90;
          playerId = 532;
        },
        {
          clubId = 19;
          eventStartMinute = 74;
          eventEndMinute = 74;
          eventType = #GoalAssisted;
          fixtureId = 90;
          playerId = 532;
        },
        {
          clubId = 19;
          eventStartMinute = 90;
          eventEndMinute = 90;
          eventType = #GoalAssisted;
          fixtureId = 90;
          playerId = 532;
        },
        {
          clubId = 14;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 90;
          playerId = 376;
        },
        {
          clubId = 14;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 90;
          playerId = 376;
        },
        {
          clubId = 14;
          eventStartMinute = 0;
          eventEndMinute = 84;
          eventType = #Appearance;
          fixtureId = 90;
          playerId = 697;
        },
        {
          clubId = 14;
          eventStartMinute = 84;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 90;
          playerId = 377;
        },
        {
          clubId = 14;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 90;
          playerId = 379;
        },
        {
          clubId = 14;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 90;
          playerId = 698;
        },
        {
          clubId = 14;
          eventStartMinute = 59;
          eventEndMinute = 59;
          eventType = #YellowCard;
          fixtureId = 90;
          playerId = 698;
        },
        {
          clubId = 14;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 90;
          playerId = 382;
        },
        {
          clubId = 14;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 90;
          playerId = 393;
        },
        {
          clubId = 14;
          eventStartMinute = 81;
          eventEndMinute = 81;
          eventType = #Goal;
          fixtureId = 90;
          playerId = 393;
        },
        {
          clubId = 14;
          eventStartMinute = 0;
          eventEndMinute = 79;
          eventType = #Appearance;
          fixtureId = 90;
          playerId = 391;
        },
        {
          clubId = 14;
          eventStartMinute = 79;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 90;
          playerId = 603;
        },
        {
          clubId = 14;
          eventStartMinute = 81;
          eventEndMinute = 81;
          eventType = #GoalAssisted;
          fixtureId = 90;
          playerId = 603;
        },
        {
          clubId = 14;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 90;
          playerId = 399;
        },
        {
          clubId = 14;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 90;
          playerId = 390;
        },
        {
          clubId = 14;
          eventStartMinute = 0;
          eventEndMinute = 59;
          eventType = #Appearance;
          fixtureId = 90;
          playerId = 397;
        },
        {
          clubId = 14;
          eventStartMinute = 59;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 90;
          playerId = 392;
        },
        {
          clubId = 14;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 90;
          playerId = 398;
        },


      ];
    };

    //Arsenal v Liverpool 81 - 1 v 11
    let dto9: GovernanceDTOs.SubmitFixtureDataDTO = {
      seasonId = 1;
      leagueId = 1;
      fixtureId = 81;
      playerEventData = [
        {
          clubId = 1;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 81;
          playerId = 2;
        },
        {
          clubId = 1;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 81;
          playerId = 2;
        },
        {
          clubId = 1;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 81;
          playerId = 2;
        },
        {
          clubId = 1;
          eventStartMinute = 66;
          eventEndMinute = 66;
          eventType = #YellowCard;
          fixtureId = 81;
          playerId = 2;
        },
        {
          clubId = 1;
          eventStartMinute = 0;
          eventEndMinute = 76;
          eventType = #Appearance;
          fixtureId = 81;
          playerId = 7;
        },
        {
          clubId = 1;
          eventStartMinute = 76;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 81;
          playerId = 21;
        },
        {
          clubId = 1;
          eventStartMinute = 0;
          eventEndMinute = 54;
          eventType = #Appearance;
          fixtureId = 81;
          playerId = 6;
        },
        {
          clubId = 1;
          eventStartMinute = 54;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 81;
          playerId = 8;
        },
        {
          clubId = 1;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 81;
          playerId = 5;
        },
        {
          clubId = 1;
          eventStartMinute = 9;
          eventEndMinute = 9;
          eventType = #GoalAssisted;
          fixtureId = 81;
          playerId = 5;
        },
        {
          clubId = 1;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 81;
          playerId = 13;
        },
        {
          clubId = 1;
          eventStartMinute = 0;
          eventEndMinute = 85;
          eventType = #Appearance;
          fixtureId = 81;
          playerId = 25;
        },
        {
          clubId = 1;
          eventStartMinute = 85;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 81;
          playerId = 22;
        },
        {
          clubId = 1;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 81;
          playerId = 725;
        },
        {
          clubId = 1;
          eventStartMinute = 43;
          eventEndMinute = 43;
          eventType = #Goal;
          fixtureId = 81;
          playerId = 725;
        },
        {
          clubId = 1;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 81;
          playerId = 20;
        },
        {
          clubId = 1;
          eventStartMinute = 43;
          eventEndMinute = 43;
          eventType = #GoalAssisted;
          fixtureId = 81;
          playerId = 20;
        },
        {
          clubId = 1;
          eventStartMinute = 0;
          eventEndMinute = 85;
          eventType = #Appearance;
          fixtureId = 81;
          playerId = 23;
        },
        {
          clubId = 1;
          eventStartMinute = 9;
          eventEndMinute = 9;
          eventType = #Goal;
          fixtureId = 81;
          playerId = 23;
        },
        {
          clubId = 1;
          eventStartMinute = 85;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 81;
          playerId = 24;
        },
        {
          clubId = 1;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 81;
          playerId = 27;
        },
        {
          clubId = 1;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 81;
          playerId = 19;
        },
        {
          clubId = 11;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 81;
          playerId = 294;
        },
        {
          clubId = 11;
          eventStartMinute = 0;
          eventEndMinute = 0;
          eventType = #KeeperSave;
          fixtureId = 81;
          playerId = 294;
        },
        {
          clubId = 11;
          eventStartMinute = 0;
          eventEndMinute = 63;
          eventType = #Appearance;
          fixtureId = 81;
          playerId = 299;
        },
        {
          clubId = 11;
          eventStartMinute = 63;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 81;
          playerId = 298;
        },
        {
          clubId = 11;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 81;
          playerId = 296;
        },
        {
          clubId = 11;
          eventStartMinute = 18;
          eventEndMinute = 18;
          eventType = #Goal;
          fixtureId = 81;
          playerId = 296;
        },
        {
          clubId = 11;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 81;
          playerId = 297;
        },
        {
          clubId = 11;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 81;
          playerId = 302;
        },
        {
          clubId = 11;
          eventStartMinute = 0;
          eventEndMinute = 63;
          eventType = #Appearance;
          fixtureId = 81;
          playerId = 308;
        },
        {
          clubId = 11;
          eventStartMinute = 33;
          eventEndMinute = 33;
          eventType = #YellowCard;
          fixtureId = 81;
          playerId = 308;
        },
        {
          clubId = 11;
          eventStartMinute = 63;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 81;
          playerId = 307;
        },
        {
          clubId = 11;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 81;
          playerId = 311;
        },
        {
          clubId = 11;
          eventStartMinute = 0;
          eventEndMinute = 63;
          eventType = #Appearance;
          fixtureId = 81;
          playerId = 314;
        },
        {
          clubId = 11;
          eventStartMinute = 18;
          eventEndMinute = 18;
          eventType = #GoalAssisted;
          fixtureId = 81;
          playerId = 314;
        },
        {
          clubId = 11;
          eventStartMinute = 63;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 81;
          playerId = 317;
        },
        {
          clubId = 11;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 81;
          playerId = 309;
        },
        {
          clubId = 11;
          eventStartMinute = 90;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 81;
          playerId = 305;
        },
        {
          clubId = 11;
          eventStartMinute = 90;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 81;
          playerId = 316;
        },
        {
          clubId = 11;
          eventStartMinute = 81;
          eventEndMinute = 81;
          eventType = #Goal;
          fixtureId = 81;
          playerId = 316;
        },
        {
          clubId = 11;
          eventStartMinute = 0;
          eventEndMinute = 90;
          eventType = #Appearance;
          fixtureId = 81;
          playerId = 315;
        },
        {
          clubId = 11;
          eventStartMinute = 90;
          eventEndMinute = 90;
          eventType = #YellowCard;
          fixtureId = 81;
          playerId = 315;
        },
        {
          clubId = 11;
          eventStartMinute = 81;
          eventEndMinute = 81;
          eventType = #GoalAssisted;
          fixtureId = 81;
          playerId = 315;
        },
      ];
    };

    let data_canister = actor (Environment.DATA_CANISTER_ID) : actor {
      submitFixtureData : (dto : GovernanceDTOs.SubmitFixtureDataDTO) -> async Result.Result<(), T.Error>;
    };
    let _ = await data_canister.submitFixtureData(dto);
    let _ = await data_canister.submitFixtureData(dto1);
    let _ = await data_canister.submitFixtureData(dto2);
    let _ = await data_canister.submitFixtureData(dto3);
    let _ = await data_canister.submitFixtureData(dto4);
    let _ = await data_canister.submitFixtureData(dto5);
    let _ = await data_canister.submitFixtureData(dto6);
    let _ = await data_canister.submitFixtureData(dto7);
    let _ = await data_canister.submitFixtureData(dto8);
    let _ = await data_canister.submitFixtureData(dto9);

    */