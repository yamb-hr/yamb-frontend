import { BaseType } from './BaseType';
import { Score } from './Score';

export interface Scoreboard extends BaseType{

    gamesPlayed: number;
    averageScore: number;
    topScore: number;
    topToday: Score[];
    topThisWeek: Score[];
    topThisMonth: Score[];
    topThisYear: Score[];
    topAllTime: Score[];
    
}