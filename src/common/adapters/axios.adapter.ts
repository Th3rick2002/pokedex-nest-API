import { Injectable } from '@nestjs/common';
import { HttpAdapter } from '../interfaces/hhtp-adapter.interface';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class AxiosAdapter implements HttpAdapter {
  private axios: AxiosInstance = axios;

  async get<T>(url: string): Promise<T> {
    try {
      const { data } = await axios.get<T>(url);
      return data;
    } catch (error) {
      throw new Error(`Error while fetching ${url} - ${error}`);
    }
  }
}
