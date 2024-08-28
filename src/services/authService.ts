import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Player } from '../types/Player';
import { PlayerCredentials } from '../types/PlayerCredentials';
import { AuthData } from '../types/AuthData';

const API_URL = process.env.REACT_APP_API_URL + "/auth";

class AuthService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: API_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.axiosInstance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                if (config.headers) {
                    const language = localStorage.getItem('language');
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

    getAccessToken(): string | null {
        return localStorage.getItem("token");
    }

    getCurrentPlayer(): Player | null {
        const playerJson = localStorage.getItem("player");
        if (!playerJson) return null;

        try {
            return JSON.parse(playerJson) as Player;
        } catch (error) {
            console.error(error);
            this.logout();
            return null;
        }
    }

    logout(): void {
        localStorage.clear();
    }

    async createTempPlayer(tempPlayerRequest: PlayerCredentials, recaptchaToken: string): Promise<AuthData> {
        const { data }: AxiosResponse<AuthData> = await this.axiosInstance.post('/anonymous', tempPlayerRequest, {
            headers: { "X-Recaptcha-Token": recaptchaToken },
        });
        console.log(data);
        return data;
    }

    async register(authRequest: PlayerCredentials, recaptchaToken: string): Promise<Player> {
        const { data }: AxiosResponse<Player> = await this.axiosInstance.post('/register', authRequest, {
            headers: { "X-Recaptcha-Token": recaptchaToken },
        });
        console.log(data);
        return data;
    }

    async login(authRequest: PlayerCredentials): Promise<AuthData> {
        const { data }: AxiosResponse<AuthData> = await this.axiosInstance.post('/login', authRequest);
        console.log(data);
        return data;
    }

}

const authService = new AuthService();
export default authService;