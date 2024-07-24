import { BaseType } from './BaseType';
import { Player } from './Player';

export interface Score extends BaseType{
    player: Player;
    value: number;
}