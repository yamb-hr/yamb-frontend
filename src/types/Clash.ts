import { Player } from './Player';
import { Link } from './Link';
import { ClashType } from '../enums/ClashType';
import { ClashStatus } from '../enums/ClashStatus';

export interface Clash {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    owner: Player;
    winner: Player;
    turn: Number;
    type: ClashType;
    status: ClashStatus;
    players: Player[];
    _links: {
        self: { href: string };
        accept?: { href: string };
        decline?: { href: string };
        add?: { href: string };
        remove?: { href: string };
    };
}

export interface Invitations {
    

}

export interface ClashCollection {
    _embedded: {
        clashes: Clash[];
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