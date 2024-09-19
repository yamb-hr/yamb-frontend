import { BoxType } from '../enums/BoxType';
import { ColumnType } from '../enums/ColumnType';
import { GameStatus } from '../enums/GameStatus';
import { Link } from './Link';

export interface Game {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    playerId: number;
    sheet: Sheet;
    dices: Dice[];
    rollCount: number;
    announcement: BoxType | null;
    totalSum: number;
    status: GameStatus;
    _links: {
        self: { href: string };
        roll?: { href: string };
        fill?: { href: string };
        announce?: { href: string };
        restart?: { href: string };
        archive?: { href: string };
        complete?: { href: string };
        player?: { href: string };
    };
}

export interface GameCollection {
    _embedded: {
        games: Game[];
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

export interface Dice {
    index: number;
    value: number;
}

export interface Sheet {
    columns: Column[];
}

export interface Column {
    type: ColumnType;
    boxes: Box[];
}

export interface Box {
    type: BoxType;
    value: number | null;
}
