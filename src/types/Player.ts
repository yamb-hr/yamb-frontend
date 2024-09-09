import { Role } from "./Role";

export interface Player {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    roles: Role[];
    registered: boolean;
}