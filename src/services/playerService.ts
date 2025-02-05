import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Player, PlayerCollection, PlayerPreferences, GlobalPlayerStats, PlayerStats } from '../types/Player';
import { ScoreCollection } from '../types/Score';
import { ClashCollection } from '../types/Clash';
import { LogCollection } from '../types/Log';
import { GameCollection } from '../types/Game';
import { NotificationCollection } from '../types/Notification';
import axiosInstance from './httpClient';

const ENDPOINT_PREFIX = "/players";

class PlayerService {

    public name: string;
    
    constructor() {
        this.name = 'PlayerService';
    }

    async getById(playerId: string): Promise<Player> {
        const { data }: AxiosResponse<Player> = await axiosInstance.get(`${ENDPOINT_PREFIX}/${playerId}`);
        console.log("PlayerService.getById", data);
        return data;
    }

    async getAll(page = 0, size = 10, sort = 'createdAt', order: 'ASC' | 'DESC' = 'DESC'): Promise<PlayerCollection> {
        const { data }: AxiosResponse<PlayerCollection> = await axiosInstance.get(`${ENDPOINT_PREFIX}/`, {
            params: {
                page,
                size,
                sort,
                order
            }
        });
    
        console.log("PlayerService.getAll", data);
        return data;
    }

    async getAllActive(): Promise<PlayerCollection> {
        const { data }: AxiosResponse<PlayerCollection> = await axiosInstance.get(`${ENDPOINT_PREFIX}/active`);
        console.log("PlayerService.getAllActive", data);
        return data;
    }

    async getStatsById(player: Player): Promise<PlayerStats> {
        const statsLink = player._links?.stats?.href;
        if (!statsLink) {
            throw new Error("Stats link not available for this player");
        }

        const { data }: AxiosResponse<PlayerStats> = await axiosInstance.get(statsLink);
        console.log("PlayerService.getStatsById", data);
        return data;
    }

    async getStats(): Promise<GlobalPlayerStats> {
        const { data }: AxiosResponse<GlobalPlayerStats> = await axiosInstance.get(`${ENDPOINT_PREFIX}/stats`);
        console.log("PlayerService.getStats", data);
        return data;
    }

    async getScoresByPlayerId(player: Player): Promise<ScoreCollection> {
        const scoresLink = player._links?.scores?.href;
        if (!scoresLink) {
            throw new Error("Scores link not available for this player");
        }

        const { data }: AxiosResponse<ScoreCollection> = await axiosInstance.get(scoresLink);
        console.log("getScoresByPlayerId", data);
        return data;
    }

    async getGamesByPlayerId(player: Player): Promise<GameCollection> {
        const gamesLink = player._links?.games?.href;
        if (!gamesLink) {
            throw new Error("Games link not available for this player");
        }

        const { data }: AxiosResponse<GameCollection> = await axiosInstance.get(gamesLink);
        console.log("getGamesByPlayerId", data);
        return data;
    }

    async getClashesByPlayerId(player: Player): Promise<ClashCollection> {
        const clashesLink = player._links?.clashes?.href;
        if (!clashesLink) {
            throw new Error("Clashes link not available for this player");
        }

        const { data }: AxiosResponse<ClashCollection> = await axiosInstance.get(clashesLink);
        console.log("getClashesByPlayerId", data);
        return data;
    }

    async getPreferencesByPlayerId(player: Player): Promise<PlayerPreferences> {
        const preferencesLink = player._links?.preferences?.href;
        if (!preferencesLink) {
            throw new Error("Preferences link not available for this player");
        }

        const { data }: AxiosResponse<PlayerPreferences> = await axiosInstance.get(preferencesLink);
        console.log("getPreferencesByPlayerId", data);
        return data;
    }

    async setPreferencesByPlayerId(player: Player, preferences: PlayerPreferences): Promise<PlayerPreferences> {
        const preferencesLink = player._links?.preferences?.href;
        if (!preferencesLink) {
            throw new Error("Preferences link not available for this player");
        }
        
        const { data }: AxiosResponse<PlayerPreferences> = await axiosInstance.put(preferencesLink, preferences);
        console.log("setPreferencesByPlayerId", data);
        return data;
    }

    async getCurrentPlayer(): Promise<Player | null> {
        const { data }: AxiosResponse<Player> = await axiosInstance.get(`${ENDPOINT_PREFIX}/me`);
        console.log("getCurrentPlayer", data);
        return data;
    }

    async updateUsername(player: Player, username: string): Promise<Player> { 
        const usernameLink = player._links?.username?.href;
        if (!usernameLink) {
            throw new Error("Username link not available for this player");
        }
        const { data }: AxiosResponse<Player> = await axiosInstance.put(usernameLink, { username: username });
        console.log("updateUsername", data);
        return data;
    }

    async updateEmail(player: Player, email: string): Promise<Player> { 
        const emailLink = player._links?.email?.href;
        if (!emailLink) {
            throw new Error("Email link not available for this player");
        }
        const { data }: AxiosResponse<Player> = await axiosInstance.put(emailLink, { email: email });
        console.log("updateEmail", data);
        return data;
    }

    async getLogsByPlayerId(player: Player): Promise<LogCollection> {
        const logsLink = player._links?.logs?.href;
        if (!logsLink) {
            throw new Error("Logs link not available for this player");
        }

        const { data }: AxiosResponse<LogCollection> = await axiosInstance.get(logsLink);
        console.log("getLogsByPlayerId", data);
        return data;
    }

    async updateAvatar(player: Player, file: File): Promise<Player> {
        let avatarLink = player._links?.avatar?.href;
        if (!avatarLink) {
            throw new Error("Avatar link not available for this player");
        }
        // remove the query parameter from the link
        avatarLink = avatarLink.split('?')[0];

        const formData = new FormData();
        console.log(file);
        formData.append('file', file);

        console.log(avatarLink, formData);
        const { data }: AxiosResponse<Player> = await axiosInstance.put(avatarLink, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        console.log("uploadAvatar", data);
        return data;
    }

    async getNotificationsByPlayerId(player: Player): Promise<NotificationCollection> {
        const notificationsLink = player._links?.notifications?.href;
        if (!notificationsLink) {
            throw new Error("Notifications link not available for this player");
        }

        const { data }: AxiosResponse<NotificationCollection> = await axiosInstance.get(notificationsLink);
        console.log("getNotificationsByPlayerId", data);
        return data;
    }

    async deleteNotificationsByPlayerId(player: Player): Promise<void> {
        const notificationsLink = player._links?.notifications?.href;
        if (!notificationsLink) {
            throw new Error("Notifications link not available for this player");
        }

        const { data }: AxiosResponse<void> = await axiosInstance.delete(notificationsLink);
        console.log("deleteNotificationsByPlayerId", data);
        return data;
    }
    
}

const playerService = new PlayerService();
export default playerService;
