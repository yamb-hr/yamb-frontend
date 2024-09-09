import { Player } from './Player';

export interface Score {

    id: number;
    createdAt: Date;
    player: Player;
    value: number;

}