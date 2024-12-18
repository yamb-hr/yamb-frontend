import { Player } from './Player';
import { NotificationType } from '../enums/NotificationType';
import { Link } from './Link';

export interface Notification {
    id: string;
    createdAt: Date;
    content: string;
    type: NotificationType;
    _links: {
        self: Link;
    };
}

export interface NotificationCollection {
    _embedded: {
        notifications: Notification[];
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