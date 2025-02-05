import { AxiosResponse } from 'axios';
import { Log, LogCollection } from '../types/Log';
import axiosInstance from './httpClient';

const ENDPOINT_PREFIX = `/logs`;

class LogService {

    public name: string;

    constructor() {
        this.name = 'LogService';
    }

    async getById(logId: string): Promise<Log> {
        const { data }: AxiosResponse<Log> = await axiosInstance.get(`${ENDPOINT_PREFIX}/${logId}`);
        console.log("LogService.getById", data);
        return data;
    }

    async getAll(page = 0, size = 10, sort = 'updatedAt', order: 'ASC' | 'DESC' = 'DESC'): Promise<LogCollection> {
        const { data }: AxiosResponse<LogCollection> = await axiosInstance.get(`${ENDPOINT_PREFIX}/`, {
            params: {
                page,
                size,
                sort,
                order
            }
        });

        console.log("LogService.getAll", data);
        return data;
    }

    async deleteById(log: Log): Promise<void> {
        const deleteLink = log._links?.self?.href;
        if (!deleteLink) {
            throw new Error('Delete link not available for this log');
        }

        const { data }: AxiosResponse<void> = await axiosInstance.delete(deleteLink);
        console.log("LogService.deleteById", data);
        return data;
    }

    async deleteAll(): Promise<void> {
        const { data }: AxiosResponse<void> = await axiosInstance.delete(`${ENDPOINT_PREFIX}/`);
        console.log("LogService.deleteAll", data);
        return data;
    }
}

const logService = new LogService();
export default logService;
