import { Actor, HttpAgent } from "@dfinity/agent";
import { IDL } from "@dfinity/candid";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { InterfaceFactory } from "@dfinity/candid/lib/cjs/idl";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const canisterId = "44kin-waaaa-aaaal-qbxra-cai";
const host = "https://ic0.app";

const idlFactory: InterfaceFactory = ({ IDL }) => {
  const MatchResult = IDL.Variant({
    'HomeWin': IDL.Null,
    'Draw': IDL.Null,
    'AwayWin': IDL.Null
  });

  return IDL.Service({
    'getFixtures': IDL.Func(
      [IDL.Nat16],
      [IDL.Variant({
        'ok': IDL.Vec(IDL.Record({
          'id': IDL.Nat32,
          'status': IDL.Variant({
            'Unplayed': IDL.Null,
            'Finalised': IDL.Null,
            'Active': IDL.Null,
            'Complete': IDL.Null
          }),
          'highestScoringPlayerId': IDL.Nat16,
          'seasonId': IDL.Nat16,
          'awayClubId': IDL.Nat16,
          'events': IDL.Vec(IDL.Record({
            'fixtureId': IDL.Nat32,
            'clubId': IDL.Nat16,
            'playerId': IDL.Nat16,
            'eventStartMinute': IDL.Nat8,
            'eventEndMinute': IDL.Nat8,
            'eventType': IDL.Variant({
              'PenaltyMissed': IDL.Null,
              'Goal': IDL.Null,
              'GoalConceded': IDL.Null,
              'Appearance': IDL.Null,
              'PenaltySaved': IDL.Null,
              'RedCard': IDL.Null,
              'KeeperSave': IDL.Null,
              'CleanSheet': IDL.Null,
              'YellowCard': IDL.Null,
              'GoalAssisted': IDL.Null,
              'OwnGoal': IDL.Null,
              'HighestScoringPlayer': IDL.Null
            })
          })),
          'homeClubId': IDL.Nat16,
          'kickOff': IDL.Int,
          'homeGoals': IDL.Nat8,
          'gameweek': IDL.Nat8,
          'awayGoals': IDL.Nat8
        })),
        'err': IDL.Variant({
          'DecodeError': IDL.Null,
          'NotAllowed': IDL.Null,
          'NotFound': IDL.Null,
          'NotAuthorized': IDL.Null,
          'InvalidData': IDL.Null,
          'AlreadyExists': IDL.Null,
          'CanisterCreateError': IDL.Null,
          'CanisterFull': IDL.Null
        })
      })],
      ['query'],
    ),
    'getLeaguePlayers': IDL.Func(
      [IDL.Nat16],
      [IDL.Variant({
        'ok': IDL.Vec(IDL.Record({
          'id': IDL.Nat16,
          'status': IDL.Variant({
            'OnLoan': IDL.Null,
            'Active': IDL.Null,
            'FreeAgent': IDL.Null,
            'Retired': IDL.Null
          }),
          'clubId': IDL.Nat16,
          'parentClubId': IDL.Nat16,
          'valueQuarterMillions': IDL.Nat16,
          'dateOfBirth': IDL.Int,
          'nationality': IDL.Nat16,
          'currentLoanEndDate': IDL.Int,
          'shirtNumber': IDL.Nat8,
          'parentLeagueId': IDL.Nat16,
          'position': IDL.Variant({
            'Goalkeeper': IDL.Null,
            'Midfielder': IDL.Null,
            'Forward': IDL.Null,
            'Defender': IDL.Null
          }),
          'lastName': IDL.Text,
          'leagueId': IDL.Nat16,
          'firstName': IDL.Text
        })),
        'err': IDL.Variant({
          'DecodeError': IDL.Null,
          'NotAllowed': IDL.Null,
          'NotFound': IDL.Null,
          'NotAuthorized': IDL.Null,
          'InvalidData': IDL.Null,
          'AlreadyExists': IDL.Null,
          'CanisterCreateError': IDL.Null,
          'CanisterFull': IDL.Null
        })
      })],
      ['query'],
    ),
    'getLeagueStatus': IDL.Func(
      [IDL.Nat16],
      [IDL.Variant({
        'ok': IDL.Record({
          'transferWindowEndMonth': IDL.Nat8,
          'transferWindowEndDay': IDL.Nat8,
          'transferWindowStartMonth': IDL.Nat8,
          'transferWindowActive': IDL.Bool,
          'totalGameweeks': IDL.Nat8,
          'completedGameweek': IDL.Nat8,
          'transferWindowStartDay': IDL.Nat8,
          'unplayedGameweek': IDL.Nat8,
          'activeMonth': IDL.Nat8,
          'activeSeasonId': IDL.Nat16,
          'activeGameweek': IDL.Nat8,
          'leagueId': IDL.Nat16,
          'seasonActive': IDL.Bool
        }),
        'err': IDL.Variant({
          'DecodeError': IDL.Null,
          'NotAllowed': IDL.Null,
          'NotFound': IDL.Null,
          'NotAuthorized': IDL.Null,
          'InvalidData': IDL.Null,
          'AlreadyExists': IDL.Null,
          'CanisterCreateError': IDL.Null,
          'CanisterFull': IDL.Null
        })
      })],
      ['query'],
    ),
    'getBettableHomepageFixtures': IDL.Func(
      [IDL.Nat16],
      [IDL.Variant({
        'ok': IDL.Vec(IDL.Record({
          'fixtureId': IDL.Nat32,
          'homeOdds': IDL.Float64,
          'drawOdds': IDL.Float64,
          'awayOdds': IDL.Float64,
          'gameweek': IDL.Nat8,
          'leagueId': IDL.Nat16
        })),
        'err': IDL.Variant({
          'DecodeError': IDL.Null,
          'NotAllowed': IDL.Null,
          'NotFound': IDL.Null,
          'NotAuthorized': IDL.Null,
          'InvalidData': IDL.Null,
          'AlreadyExists': IDL.Null,
          'CanisterCreateError': IDL.Null,
          'CanisterFull': IDL.Null
        })
      })],
      ['query'],
    ),
    'getMatchOdds': IDL.Func(
      [IDL.Nat16, IDL.Nat32],
      [IDL.Variant({
        'ok': IDL.Record({
          'fixtureId': IDL.Nat32,
          'lastAssist': IDL.Vec(IDL.Record({ 'playerId': IDL.Nat16, 'odds': IDL.Float64 })),
          'correctScores': IDL.Vec(IDL.Record({ 'odds': IDL.Float64, 'homeGoals': IDL.Nat8, 'awayGoals': IDL.Nat8 })),
          'bothTeamsToScore': IDL.Record({ 'noOdds': IDL.Float64, 'yesOdds': IDL.Float64 }),
          'yellowCards': IDL.Vec(IDL.Record({ 'playerId': IDL.Nat16, 'odds': IDL.Float64 })),
          'lastGoalscorers': IDL.Vec(IDL.Record({ 'playerId': IDL.Nat16, 'odds': IDL.Float64 })),
          'halfTimeScores': IDL.Vec(IDL.Record({ 'odds': IDL.Float64, 'homeGoals': IDL.Nat8, 'awayGoals': IDL.Nat8 })),
          'anytimeAssist': IDL.Vec(IDL.Record({ 'playerId': IDL.Nat16, 'odds': IDL.Float64 })),
          'penaltyMissers': IDL.Vec(IDL.Record({ 'playerId': IDL.Nat16, 'odds': IDL.Float64 })),
          'redCards': IDL.Vec(IDL.Record({ 'playerId': IDL.Nat16, 'odds': IDL.Float64 })),
          'anytimeScorers': IDL.Vec(IDL.Record({ 'playerId': IDL.Nat16, 'odds': IDL.Float64 })),
          'correctResults': IDL.Record({ 'homeOdds': IDL.Float64, 'drawOdds': IDL.Float64, 'awayOdds': IDL.Float64 }),
          'penaltyMissed': IDL.Record({ 'homeTeam': IDL.Float64, 'awayTeam': IDL.Float64 }),
          'scoresHatTrick': IDL.Vec(IDL.Record({ 'playerId': IDL.Nat16, 'odds': IDL.Float64 })),
          'scoresBrace': IDL.Vec(IDL.Record({ 'playerId': IDL.Nat16, 'odds': IDL.Float64 })),
          'goalsOverUnder': IDL.Record({
            'overOdds': IDL.Vec(IDL.Record({ 'odds': IDL.Float64, 'margin': IDL.Float64 })),
            'underOdds': IDL.Vec(IDL.Record({ 'odds': IDL.Float64, 'margin': IDL.Float64 }))
          }),
          'firstAssisters': IDL.Vec(IDL.Record({ 'playerId': IDL.Nat16, 'odds': IDL.Float64 })),
          'leagueId': IDL.Nat16,
          'firstGoalscorers': IDL.Vec(IDL.Record({ 'playerId': IDL.Nat16, 'odds': IDL.Float64 })),
          'halfTimeFullTimeResult': IDL.Vec(IDL.Record({
            'firstHalfResult': MatchResult,
            'odds': IDL.Float64,
            'secondHalfResult': MatchResult
          })),
          'bothTeamsToScoreAndWinner': IDL.Vec(IDL.Record({
            'result': MatchResult,
            'odds': IDL.Float64,
            'isYes': IDL.Bool
          }))
        }),
        'err': IDL.Variant({
          'DecodeError': IDL.Null,
          'NotAllowed': IDL.Null,
          'NotFound': IDL.Null,
          'NotAuthorized': IDL.Null,
          'InvalidData': IDL.Null,
          'AlreadyExists': IDL.Null,
          'CanisterCreateError': IDL.Null,
          'CanisterFull': IDL.Null
        })
      })],
      ['query'],
    )
  });
};

async function queryLeagueClubs(leagueId: number) {
  try {
    const agent = new HttpAgent({ host });
    await agent.fetchRootKey();

    const actor = Actor.createActor(idlFactory, {
      agent,
      canisterId,
    });

    const result = await actor.getBettableHomepageFixtures(leagueId);
    
    // Save to local folder
    const outputPath = path.join('src/frontend/src/lib/local', `bettableFixtures-${leagueId}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(result, (_, value) => 
      typeof value === 'bigint' ? value.toString() : value
    , 2));
    
    console.log(`Results for league ${leagueId} saved to ${outputPath}`);
    return result;

  } catch (error) {
    console.error(`Error querying league ${leagueId}:`, error);
    throw error;
  }
}

// async function queryAllLeagues() {
//   for (let leagueId = 1; leagueId <= 5; leagueId++) {
//     console.log(`Querying league ${leagueId}...`);
//     await queryLeagueClubs(leagueId);
//     // Add small delay between requests
//     await new Promise(resolve => setTimeout(resolve, 1000));
//   }
// }

async function queryMatchOdds(fixtureId: number) {
  try {
    const agent = new HttpAgent({ host });
    await agent.fetchRootKey();
  
    const actor = Actor.createActor(idlFactory, {
      agent,
      canisterId,
    });
  
    const result = await actor.getMatchOdds(1, fixtureId);
    console.log(`Got results for fixture ${fixtureId}`);
    return result;
  
  } catch (error) {
    console.error(`Error querying fixture ${fixtureId}:`, error);
    throw error;
  }
}

async function queryAllFixtures() {
  const allOdds = [];
  for (let fixtureId = 1; fixtureId <= 380; fixtureId++) {
    console.log(`Querying fixture ${fixtureId}...`);
    const result = await queryMatchOdds(fixtureId);
    allOdds.push(result);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  const outputPath = path.join('src/frontend/src/lib/local', 'matchOdds.json');
  fs.writeFileSync(outputPath, JSON.stringify(allOdds, (_, value) => 
    typeof value === 'bigint' ? value.toString() : value
  , 2));
  console.log(`All match odds saved to ${outputPath}`);
}

queryAllFixtures().catch(console.error); 