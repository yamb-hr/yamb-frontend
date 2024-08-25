import { Player } from './Player';
import { LogLevel } from '../enums/LogLevel';

export interface Log {
    id: string;
    createdAt: Date;
    data: string;
    message: string;
    player: Player;
    level: LogLevel;
}