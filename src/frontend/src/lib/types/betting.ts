import type { ClubDTO } from "../../../../declarations/backend/backend.did";
import type { MatchOddsDTO } from "../../../../declarations/backend/backend.did";

export type BetType = 
    | 'home' 
    | 'away' 
    | 'draw'
    | 'score'
    | 'player'
    | 'team'
    | 'halftime-fulltime'
    | 'over'
    | 'under';

export interface BetSelection {
    homeClub: ClubDTO;
    awayClub: ClubDTO;
    odds: number;
    type: BetType;
    description: string;
    score?: string;
    category?: keyof MatchOddsDTO;
} 