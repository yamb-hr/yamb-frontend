import { BaseType } from "./BaseType";
import { Role } from "./Role";

export interface Player extends BaseType {
    name: string;
    roles: Role[];
}