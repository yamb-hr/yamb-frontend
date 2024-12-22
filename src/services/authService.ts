import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Player } from '../types/Player';
import { PlayerCredentials } from '../types/Auth';
import { AuthData } from '../types/Auth';

const API_URL = process.env.REACT_APP_API_URL + "/auth";
const LOCAL_STORAGE_KEY_TOKEN = "token";

class AuthService {
    
    private axiosInstance: AxiosInstance;
    public name: string;

    constructor() {
        this.name = 'AuthService';
        this.axiosInstance = axios.create({
            baseURL: API_URL,
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

    getAccessToken(): string | null {
        return localStorage.getItem(LOCAL_STORAGE_KEY_TOKEN);
    }

    logout(): void {
        localStorage.removeItem(LOCAL_STORAGE_KEY_TOKEN);
    }

    async registerGuest(tempPlayerRequest: PlayerCredentials, recaptchaToken: string): Promise<AuthData> {
        const { data }: AxiosResponse<AuthData> = await this.axiosInstance.post('/register-guest', tempPlayerRequest, {
            headers: { "X-Recaptcha-Token": recaptchaToken },
        });
        console.log("registerGuest", data);
        return data;
    }

    async register(authRequest: PlayerCredentials, recaptchaToken: string): Promise<Player> {
        const { data }: AxiosResponse<Player> = await this.axiosInstance.post('/register', authRequest, {
            headers: { "X-Recaptcha-Token": recaptchaToken },
        });
        console.log("register", data);
        return data;
    }

    async getToken(authRequest: PlayerCredentials): Promise<AuthData> {
        const { data }: AxiosResponse<AuthData> = await this.axiosInstance.post('/token', authRequest);
        console.log("getToken", data);
        return data;
    }

    async resetPassword(oldPassword: string, newPassword: string, passwordResetToken: string): Promise<void> {
        const resetPasswordEndpoint = '/password-reset' + (passwordResetToken ? ('?token=' + passwordResetToken) : '');
        console.log(resetPasswordEndpoint);
        const { data }: AxiosResponse<Player> = await this.axiosInstance.put(resetPasswordEndpoint, { oldPassword: oldPassword, newPassword: newPassword });
        console.log("resetPassword", data);
    }

    async sendPasswordResetEmail(email: string): Promise<void> {
        const { data }: AxiosResponse<Player> = await this.axiosInstance.post('/password-reset-token', { email: email });
        console.log("sendPasswordResetToken", data);
    }

    async verifyEmail(emailVerificationToken: string): Promise<void> {
        const { data }: AxiosResponse<Player> = await this.axiosInstance.put('/email-verification?token=' + emailVerificationToken);
        console.log("verifyEmail", data);
    }

    async sendVerificationEmail(email: string): Promise<void> {
        const { data }: AxiosResponse<Player> = await this.axiosInstance.post('/email-verification-token', { email: email });
        console.log("sendVerificationEmail", data);
    }

    isAuthenticated(): boolean {
        return this.getAccessToken() != null;
    }

}

const authService = new AuthService();
export default authService;