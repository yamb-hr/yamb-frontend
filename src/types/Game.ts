import { BoxType } from '../enums/BoxType';
import { ColumnType } from '../enums/ColumnType';
import { GameStatus } from '../enums/GameStatus';

export interface Game {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    playerId: string;
    playerName: string;
    sheet: Sheet;
    dices: Dice[];
    rollCount: number;
    announcement: BoxType | null;
    status: GameStatus;
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