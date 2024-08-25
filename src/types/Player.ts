import { Role } from "./Role";

export interface Player {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    roles: Role[];
}