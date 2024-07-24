import axios, { AxiosResponse } from 'axios';
import { Player } from '../types/Player';
import { PlayerCredentials } from '../types/PlayerCredentials';
import { AuthData } from '../types/authData';

const API_URL = process.env.REACT_APP_API_URL + "/auth";

export class AuthService {
  static getCurrentPlayer(): Player | null {
    try {
      return JSON.parse(localStorage.getItem("player") || 'null');
    } catch (error) {
      console.error(error);
      this.logout();
      return null;
    }
  }

  static getAccessToken(): string | null {
    try {
      return localStorage.getItem("token") || 'null';
    } catch (error) {
      console.error(error);
      this.logout();
      return null;
    }
  }

  static logout(): void {
    localStorage.clear();
  }

  static async login(authRequest: PlayerCredentials): Promise<AuthData> {
    try {
      const response: AxiosResponse<{ data: AuthData }> = await axios.post(API_URL + '/login', authRequest, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data.data;
    } catch (error: any) {
      console.error(error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  static async register(authRequest: PlayerCredentials): Promise<Player> {
    const token = AuthService.getAccessToken();
    try {
      const response: AxiosResponse<{ data: Player }> = await axios.post(API_URL + '/register', authRequest, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      return response.data.data;
    } catch (error: any) {
      console.error(error);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  static async createTempPlayer(tempPlayerRequest: PlayerCredentials): Promise<AuthData> {
    try {
      const response: AxiosResponse<{ data: AuthData }> = await axios.post(API_URL + '/temp-player', tempPlayerRequest, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data.data;
    } catch (error: any) {
      console.error(error);
      throw new Error(error.response?.data?.message || 'Creation of temporary player failed');
    }
  }
}
