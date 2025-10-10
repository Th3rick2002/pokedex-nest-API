import { Injectable } from '@nestjs/common';
import { PokemonListResponse } from './interfaces/pokeResponse.interface';
import axios, { AxiosInstance } from 'axios';
import { PokemonService } from '../pokemon/pokemon.service';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;

  constructor(private readonly pokemonService: PokemonService) {}

  async executeSeed() {
    const { data } = await this.axios.get<PokemonListResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=10',
    );

    data.results.forEach(async ({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2]

      await this.pokemonService.create({ name, no })
    })
    return data.results;
  }
}
