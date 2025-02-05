import { AxiosResponse } from 'axios';
import { Game, GameCollection } from '../types/Game';
import axiosInstance from './httpClient';

const ENDPOINT_PREFIX = "/games";

class GameService {

    public name: string;

    constructor() {
        this.name = 'GameService';
    }

    async getById(gameId: string): Promise<Game> {
        const { data }: AxiosResponse<Game> = await axiosInstance.get(`${ENDPOINT_PREFIX}/${gameId}`);
        console.log("GameService.getById", data);
        return data;
    }

    async getAll(page = 0, size = 10, sort = 'updatedAt', order: 'ASC' | 'DESC' = 'DESC'): Promise<GameCollection> {
        const { data }: AxiosResponse<GameCollection> = await axiosInstance.get(`${ENDPOINT_PREFIX}/`, {
            params: {
                page,
                size,
                sort,
                order
            }
        });
    
        console.log("GameService.getAll", data);
        return data;
    }
    
    async getOrCreate(playerId: string): Promise<Game> {
        const { data }: AxiosResponse<Game> = await axiosInstance.put(`${ENDPOINT_PREFIX}/`, { playerId: playerId });
        console.log("GameService.getOrCreate", data);
        return data;
    }

    async rollById(game: Game, diceToRoll: number[]): Promise<Game> {
        const rollLink = game._links?.roll?.href;
        if (!rollLink) {
            throw new Error('No roll link found for this game');
        }

        const { data }: AxiosResponse<Game> = await axiosInstance.put(rollLink, { diceToRoll });
        console.log("rollById", data);
        return data;
    }
    
    async announceById(game: Game, boxType: string): Promise<Game> {
        const announceLink = game._links?.announce?.href;
        if (!announceLink) {
            throw new Error('No announce link found for this game');
        }

        const { data }: AxiosResponse<Game> = await axiosInstance.put(announceLink, { boxType });
        console.log("announceById", data);
        return data;
    }

    async fillById(game: Game, columnType: string, boxType: string): Promise<Game> {
        const fillLink = game._links?.fill?.href;
        if (!fillLink) {
            throw new Error('No fill link found for this game');
        }

        const { data }: AxiosResponse<Game> = await axiosInstance.put(fillLink, { columnType, boxType });
        console.log("fillById", data);
        return data;
    }

    async undoFillById(game: Game): Promise<Game> {
        const undoFillLink = game._links?.undo?.href;
        if (!undoFillLink) {
            throw new Error('No undo fill link found for this game');
        }

        const { data }: AxiosResponse<Game> = await axiosInstance.put(undoFillLink);
        console.log("undoFillById", data);
        return data;
    }

    async restartById(game: Game): Promise<Game> {
        const restartLink = game._links?.restart?.href;
        if (!restartLink) {
            throw new Error('No restart link found for this game');
        }

        const { data }: AxiosResponse<Game> = await axiosInstance.put(restartLink);
        console.log("restartById", data);
        return data;
    }

    async archiveById(game: Game): Promise<Game> {
        const archiveLink = game._links?.archive?.href;
        if (!archiveLink) {
            throw new Error('No archive link found for this game');
        }

        const { data }: AxiosResponse<Game> = await axiosInstance.put(archiveLink);
        console.log("archiveById", data);
        return data;
    }

}

const gameService = new GameService();
export default gameService;
