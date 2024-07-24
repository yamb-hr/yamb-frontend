import axios, { AxiosResponse } from 'axios';
import { Game } from '../types/Game';
import { AuthService } from './authService';

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/games`;
const getAuthHeaders = () => ({
    'Authorization': 'Bearer ' + AuthService.getAccessToken()
});

export class GameService {

    static async getGameById(gameId: string): Promise<Game> {
        const { data }: AxiosResponse<Game> = await axios.get(`${API_BASE_URL}/${gameId}`, {
            headers: getAuthHeaders()
        });
        return data;
    }

    static async getGames(
        size: number = 10, 
        page: number = 0, 
        order: string = 'id', 
        direction: string = 'asc'
    ): Promise<Game[]> {
        const { data }: AxiosResponse<Game[]> = await axios.get(API_BASE_URL, {
            params: { size, page, sort: order, direction },
            headers: getAuthHeaders()
        });
        return data;
    }

    static async play(): Promise<Game> {
        const { data }: AxiosResponse<Game> = await axios.post(API_BASE_URL, null, {
            headers: getAuthHeaders()
        });
        return data;
    }

    static async rollDiceById(gameId: string, diceToRoll: number[]): Promise<Game> {
        const { data }: AxiosResponse<Game> = await axios.put(`${API_BASE_URL}/${gameId}/roll`, { diceToRoll }, {
            headers: getAuthHeaders()
        });
        return data;
    }

    static async fillBoxById(gameId: string, columnType: string, boxType: string): Promise<Game> {
        const { data }: AxiosResponse<Game> = await axios.put(`${API_BASE_URL}/${gameId}/fill`, { columnType, boxType }, {
            headers: getAuthHeaders()
        });
        return data;
    }

    static async makeAnnouncementById(gameId: string, boxType: string): Promise<Game> {
        const { data }: AxiosResponse<Game> = await axios.put(`${API_BASE_URL}/${gameId}/announce`, { boxType }, {
            headers: getAuthHeaders()
        });
        return data;
    }

    static async restartById(gameId: string): Promise<Game> {
        const { data }: AxiosResponse<Game> = await axios.put(`${API_BASE_URL}/${gameId}/restart`, null, {
            headers: getAuthHeaders()
        });
        return data;
    }
}

export default GameService;
