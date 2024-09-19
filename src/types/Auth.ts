import { Player } from "./Player";

export interface PlayerCredentials {
    username: string;
    password: string;
}

export interface AuthData {
    player: Player;
    token: string;
}