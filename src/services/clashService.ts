import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import authService from './authService';
import { Clash, ClashCollection } from '../types/Clash';

const API_BASE_URL = `${process.env.REACT_APP_API_URL}/clashes`;

class ClashService {

    private axiosInstance: AxiosInstance;
    public name: string;

    constructor() {
        this.name = 'ClashService';
        this.axiosInstance = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.axiosInstance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                if (config.headers) {
                    const language = localStorage.getItem('i18nextLng');
                    if (language) {
                        config.headers['Accept-Language'] = language;
                    }
                    const token = authService.getAccessToken();
                    if (token) {
                        config.headers['Authorization'] = `Bearer ${token}`;
                    }
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }

    async getById(clashId: string): Promise<Clash> {
        const { data }: AxiosResponse<Clash> = await this.axiosInstance.get(`/${clashId}`);
        console.log("ClashService.getById", data);
        return data;
    }

    async getAll(page = 0, size = 10, sort = 'updatedAt', order: 'ASC' | 'DESC' = 'DESC'): Promise<ClashCollection> {
        const { data }: AxiosResponse<ClashCollection> = await this.axiosInstance.get('/', {
            params: {
                page,
                size,
                sort,
                order
            }
        });

        console.log("ClashService.getAll", data);
        return data;
    }

    async deleteById(clash: Clash): Promise<void> {
        const deleteLink = clash._links?.self?.href;
        if (!deleteLink) {
            throw new Error('Delete link not available for this clash');
        }

        const { data }: AxiosResponse<void> = await this.axiosInstance.delete(deleteLink);
        console.log("ClashService.deleteById", data);
        return data;
    }

    async deleteAll(): Promise<void> {
        const { data }: AxiosResponse<void> = await this.axiosInstance.delete('/');
        console.log("ClashService.deleteAll", data);
        return data;
    }

    async create(ownerId: string, playerIds: string[], type: string, name: string): Promise<Clash> {
        const { data }: AxiosResponse<Clash> = await this.axiosInstance.post('/', { ownerId: ownerId, playerIds: playerIds, type: type, name: name});
        console.log("ClashService.create", data);
        return data;
    }

    async acceptById(clash: Clash, playerId: string): Promise<Clash> {
        const acceptLink = clash._links?.accept?.href;
        if (!acceptLink) {
            throw new Error("Accept link not available for this clash");
        }
        const { data }: AxiosResponse<Clash> = await this.axiosInstance.put(acceptLink, { playerId: playerId });
        console.log("ClashService.acceptById", data);
        return data;
    }

    async declineById(clash: Clash, playerId: string): Promise<Clash> {
        const declineLink = clash._links?.accept?.href;
        if (!declineLink) {
            throw new Error("Decline link not available for this clash");
        }
        const { data }: AxiosResponse<Clash> = await this.axiosInstance.put(declineLink, { playerId: playerId });
        console.log("ClashService.declineById", data);
        return data;
    }

    async addPlayersById(clash: Clash, playerIds: string[]): Promise<Clash> {
        const addPlayersLink = clash._links?.add?.href;
        if (!addPlayersLink) {
            throw new Error("Add players link not available for this clash");
        }
        const { data }: AxiosResponse<Clash> = await this.axiosInstance.put(addPlayersLink, { playerIds: playerIds });
        console.log("ClashService.addPlayersById", data);
        return data;
    }

    async removePlayersById(clash: Clash, playerIds: string[]): Promise<Clash> {
        const removePlayersLink = clash._links?.remove?.href;
        if (!removePlayersLink) {
            throw new Error("Remove players link not available for this clash");
        }
        const { data }: AxiosResponse<Clash> = await this.axiosInstance.put(removePlayersLink, { playerIds: playerIds });
        console.log("ClashService.removePlayersById", data);
        return data;
    }

}

const clashService = new ClashService();
export default clashService;
