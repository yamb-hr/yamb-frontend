import axios, { AxiosResponse } from 'axios';
import { Log } from '../types/Log';
import { AuthService } from './authService';

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/games`;

export class LogService {

    static async getById(externalId: string): Promise<Log> {
        try {
            const { data }: AxiosResponse<Log> = await axios.get(`${API_BASE_URL}/${externalId}`, {
                headers: AuthService.getAuthHeaders()
            });
			console.log(data);
            return data;
        } catch (error: any) {
            console.error(error);
            throw new Error(error.response?.data?.message);
        }
    }

    static async getAll(
        page: number = 0,
        size: number = 10,
        sort: string = 'createdAt',
        direction: string = 'desc'
    ): Promise<Log[]> {
        try {
            const { data }: AxiosResponse<Log[]> = await axios.get(API_BASE_URL, {
                params: { page, size, sort, direction },
                headers: AuthService.getAuthHeaders()
            });
			console.log(data);
            return data;
        } catch (error: any) {
            console.error(error);
            throw new Error(error.response?.data?.message);
        }
    }

    static async deleteById(externalId: string): Promise<void> {
        try {
            await axios.delete(`${API_BASE_URL}/${externalId}`, {
                headers: AuthService.getAuthHeaders()
            });
        } catch (error: any) {
            console.error(error);
            throw new Error(error.response?.data?.message);
        }
    }

    static async deleteAll(): Promise<void> {
        try {
            await axios.delete(API_BASE_URL, {
                headers: AuthService.getAuthHeaders()
            });
        } catch (error: any) {
            console.error(error);
            throw new Error(error.response?.data?.message);
        }
    }
}
