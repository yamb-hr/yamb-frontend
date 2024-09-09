import { Player } from './Player';
import { LogLevel } from '../enums/LogLevel';

export interface Log {
    id: number;
    createdAt: Date;
    data: string;
    message: string;
    player: Player;
    level: LogLevel;
}