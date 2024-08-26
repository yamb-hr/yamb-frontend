import { Score } from './Score';

export interface GlobalScoreStats {

    scoreCount: number;
    averageScore: number;
    highScore: Score;
    topToday: Score[];
    topThisWeek: Score[];
    topThisMonth: Score[];
    topThisYear: Score[];
    topAllTime: Score[];

}