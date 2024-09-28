import { Player } from './Player';
import { LogLevel } from '../enums/LogLevel';
import { Link } from './Link';

export interface Log {
    id: number;
    createdAt: Date;
    data: string;
    message: string;
    player: Player;
    level: LogLevel;
    _links: {
        self: Link;
    };
}

export interface LogCollection {
    _embedded: {
        logs: Log[];
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