import { Player } from "./Player";
import { Score } from "./Score";

export interface GlobalPlayerStats {

    playerCount: number;
    mostScoresByAnyPlayer: number;
    playerWithMostScores: Player;
    highestAverageScoreByAnyPlayer: number;
    playerWithHighestAverageScore: Player;
    highScore: Score;
    newestPlayer: Player;
    oldestPlayer: Player;
    
}