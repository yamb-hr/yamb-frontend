import { Link } from './Link';
import { Player } from './Player';

export interface Score {
    id: string;
    createdAt: Date;
    player: Player;
    value: number;
    _links: {
        self: Link;
    };
}

export interface ScoreCollection {
    _embedded: {
        scores: Score[];
    };
    _links: {
        self: Link;
        next?: Link;
        prev?: Link;
    };
    page: {
        size: number;
        totalElements: number;
        totalPages: number;
        number: number;
    };
}

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