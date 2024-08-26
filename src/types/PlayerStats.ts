import { Score } from "./Score";

export interface PlayerStats {

    lastActivity: Date;
    averageScore: number;
    highScore: Score;
    scoreCount: number;

}