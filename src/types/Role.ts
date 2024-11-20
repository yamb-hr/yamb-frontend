import { Link } from "./Link";

export interface Role {
    id: string;
    name: string;
    description: string;
}

export interface RoleCollection {
    _embedded: {
        roles: Role[];
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