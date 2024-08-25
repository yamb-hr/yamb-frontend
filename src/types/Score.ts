import { Player } from './Player';

export interface Score {
    id: string;
    createdAt: Date;
    player: Player;
    value: number;
}