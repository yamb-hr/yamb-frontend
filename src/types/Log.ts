import { BaseType } from './BaseType';
import { Player } from './Player';
import { LogLevel } from '../enums/LogLevel';

export interface Log extends BaseType {
    data: string;
    message: string;
    player: Player;
    level: LogLevel;
}