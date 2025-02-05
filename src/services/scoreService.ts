import { AxiosResponse } from 'axios';
import { Score, GlobalScoreStats, ScoreCollection } from '../types/Score';
import axiosInstance from './httpClient';

const ENDPOINT_PREFIX = "/scores";

class ScoreService {

    public name: string;

    constructor() {
        this.name = 'ScoreService';
    }

    async getById(scoreId: string): Promise<Score> {
        const { data }: AxiosResponse<Score> = await axiosInstance.get(`${ENDPOINT_PREFIX}/${scoreId}`);
        console.log("ScoreService.getById", data);
        return data;
    }

    async getAll(page = 0, size = 10, sort = 'createdAt', order: 'ASC' | 'DESC' = 'DESC'): Promise<ScoreCollection> {
        const { data }: AxiosResponse<ScoreCollection> = await axiosInstance.get(`${ENDPOINT_PREFIX}/`, {
            params: {
                page,
                size,
                sort,
                order
            }
        });
    
        console.log("ScoreService.getAll", data);
        return data;
    }

    async getStats(): Promise<GlobalScoreStats> {
        const { data }: AxiosResponse<GlobalScoreStats> = await axiosInstance.get(`${ENDPOINT_PREFIX}/stats`);
        console.log("ScoreService.getStats", data);
        return data;
    }
}

const scoreService = new ScoreService();
export default scoreService;