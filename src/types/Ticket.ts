import { Player } from './Player';
import { TicketStatus } from '../enums/TicketStatus';
import { Link } from './Link';

export interface Ticket {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    code: string;
    player: Player;
    status: TicketStatus;
    emailAddresses: string[]
    title: string;
    description: string;
    _links: {
        self: Link;
    };
}

export interface TicketRequest {
    playerId: string;
    emailAddresses: string[]
    title: string;
    description: string;
}

export interface TicketCollection {
    _embedded: {
        tickets: Ticket[];
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