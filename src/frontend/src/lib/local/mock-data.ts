// Create interfaces for your data types
export interface MockData {
  league_status: {
    [key: string]: any;
  };
  bettableFixtures: {
    [key: string]: any;
  };
  fixtures: {
    [key: string]: any;
  };
  clubs: {
    [key: string]: any;
  };
  leagues: any;
  matchOdds: any;
  players: {
    [key: string]: any;
  };
  seasons: {
    [key: string]: any;
  };
}

// Import all JSON files
import leagueStatus1 from './leagueStatus-1.json';
import leagueStatus2 from './leagueStatus-2.json';
import leagueStatus3 from './leagueStatus-3.json';
import leagueStatus4 from './leagueStatus-4.json';
import leagueStatus5 from './leagueStatus-5.json';
import bettableFixtures1 from './bettableFixtures-1.json';
import bettableFixtures2 from './bettableFixtures-2.json';
import bettableFixtures3 from './bettableFixtures-3.json';
import bettableFixtures4 from './bettableFixtures-4.json';
import bettableFixtures5 from './bettableFixtures-5.json';
import fixtures1 from './fixtures-1.json';
import fixtures2 from './fixtures-2.json';
import fixtures3 from './fixtures-3.json';
import fixtures4 from './fixtures-4.json';
import fixtures5 from './fixtures-5.json';
import leagueClubs1 from './leagueClubs-1.json';
import leagueClubs2 from './leagueClubs-2.json';
import leagueClubs3 from './leagueClubs-3.json';
import leagueClubs4 from './leagueClubs-4.json';
import leagueClubs5 from './leagueClubs-5.json';
import leagues from './leagues.json';
import matchOdds from './matchOdds.json';
import players1 from './players-1.json';
import players2 from './players-2.json';
import players3 from './players-3.json';
import players4 from './players-4.json';
import players5 from './players-5.json';

export const mockData: MockData = {
  league_status: {
    1: leagueStatus1,
    2: leagueStatus2,
    3: leagueStatus3,
    4: leagueStatus4,
    5: leagueStatus5
  },
  bettableFixtures: {
    1: bettableFixtures1,
    2: bettableFixtures2,
    3: bettableFixtures3,
    4: bettableFixtures4,
    5: bettableFixtures5
  },
  fixtures: {
    1: fixtures1,
    2: fixtures2,
    3: fixtures3,
    4: fixtures4,
    5: fixtures5
  },
  clubs: {
    1: leagueClubs1,
    2: leagueClubs2,
    3: leagueClubs3,
    4: leagueClubs4,
    5: leagueClubs5
  },
  leagues: leagues.ok,
  matchOdds: matchOdds,
  players: {
    1: players1,
    2: players2,
    3: players3,
    4: players4,
    5: players5
  },
  seasons: {}
}; 