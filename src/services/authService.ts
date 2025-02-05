import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Player } from '../types/Player';
import { PlayerCredentials } from '../types/Auth';
import axiosInstance from './httpClient';

const ENDPOINT_PREFIX = "/auth";
const LOCAL_STORAGE_KEY_TOKEN = "token";
const AUTH_PREFIX_BEARER = "Bearer ";

class AuthService {

    public name: string;
    
    constructor() {
        this.name = 'AuthService';
    }

    async logout(): Promise<void> {
        const { data }: AxiosResponse<void> = await axiosInstance.post(`${ENDPOINT_PREFIX}/logout`);
        console.log("logout", data);
        return data;
    }

    async registerGuest(guestRequest: PlayerCredentials, recaptchaToken: string): Promise<Player> {
        const { data }: AxiosResponse<Player> = await axiosInstance.post(`${ENDPOINT_PREFIX}/register-guest`, guestRequest, {
            headers: { "X-Recaptcha-Token": recaptchaToken },
        });
        console.log("registerGuest", data);
        return data;
    }

    async register(authRequest: PlayerCredentials, recaptchaToken: string): Promise<Player> {
        const { data }: AxiosResponse<Player> = await axiosInstance.post(`${ENDPOINT_PREFIX}/register`, authRequest, {
            headers: { "X-Recaptcha-Token": recaptchaToken },
        });
        console.log("register", data);
        return data;
    }

    async getToken(authRequest: PlayerCredentials): Promise<Player> {
        const { data }: AxiosResponse<Player> = await axiosInstance.post(`${ENDPOINT_PREFIX}/token`, authRequest);
        console.log("getToken", data);
        return data;
    }

    async migrateToken(): Promise<Player> {
        axiosInstance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                const token = localStorage.getItem(LOCAL_STORAGE_KEY_TOKEN);
                if (token) {
                    config.headers["Authorization"] = AUTH_PREFIX_BEARER + token;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );
        const { data }: AxiosResponse<Player> = await axiosInstance.post(`${ENDPOINT_PREFIX}/migrate`);
        console.log("migrateToken", data);
        return data;
    }

    async resetPassword(oldPassword: string, newPassword: string, passwordResetToken: string): Promise<void> {
        const resetPasswordEndpoint = `${ENDPOINT_PREFIX}/password-reset${(passwordResetToken ? ('?token=' + passwordResetToken) : '')}`;
        console.log(resetPasswordEndpoint);
        const { data }: AxiosResponse<Player> = await axiosInstance.put(resetPasswordEndpoint, { oldPassword: oldPassword, newPassword: newPassword });
        console.log("resetPassword", data);
    }

    async sendPasswordResetEmail(email: string): Promise<void> {
        const { data }: AxiosResponse<Player> = await axiosInstance.post(`${ENDPOINT_PREFIX}/password-reset-token`, { email: email });
        console.log("sendPasswordResetToken", data);
    }

    async verifyEmail(emailVerificationToken: string): Promise<void> {
        const { data }: AxiosResponse<Player> = await axiosInstance.put(`${ENDPOINT_PREFIX}/email-verification?token=${emailVerificationToken}`);
        console.log("verifyEmail", data);
    }

    async sendVerificationEmail(email: string): Promise<void> {
        const { data }: AxiosResponse<Player> = await axiosInstance.post(`${ENDPOINT_PREFIX}/email-verification-token˛`, { email: email });
        console.log("sendVerificationEmail", data);
    }

}

const authService = new AuthService();
export default authService;