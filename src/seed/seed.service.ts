import { Injectable } from '@nestjs/common';
import { PokemonListResponse } from './interfaces/pokeResponse.interface';
import { PokemonService } from '../pokemon/pokemon.service';
import { AxiosAdapter } from '../common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    private readonly pokemonService: PokemonService,
    private readonly http: AxiosAdapter
  ) {}

  async executeSeed() {
    const data = await this.http.get<PokemonListResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=800',
    );

    const pokemonsToInsert: {name: string, no: number}[] = []

    data.results.forEach(async ({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2]
      pokemonsToInsert.push({ name, no })
    })

    await this.pokemonService.createMany(pokemonsToInsert);
    return 'Seed successfully';
  }

  async clearDatabase() {
    await this.pokemonService.deleteAll()
  }
}
