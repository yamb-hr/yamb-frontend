import { Player } from "./Player";

export interface PlayerCredentials {
    email: string;
    username: string;
    password: string;
}

export interface AuthData {
    player: Player;
    token: string;
}