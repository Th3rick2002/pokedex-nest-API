import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from '../common/dto/Pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {
  private defaultLimit: number;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = configService.getOrThrow<number>('default_limit');
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('Pokemon already exists');
      }
      throw new InternalServerErrorException(
        `Can't create pokemon - check server logs`,
      );
    }
  }

  async createMany(createPokemonDto: CreatePokemonDto[]) {
    createPokemonDto.map((pokemon) => {
      pokemon.name = pokemon.name.toLowerCase();
    })

    try {
      const pokemon = await this.pokemonModel.insertMany(createPokemonDto);
      return pokemon;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('Pokemon already exists');
      }
      throw new InternalServerErrorException(
        `Can't create pokemon - check server logs`,
      );
    }
  }

  async findAll(paginationDTO: PaginationDto) {
    const { limit = this.defaultLimit, offset = 0 } = paginationDTO;
    return this.pokemonModel.find()
      .limit(limit)
      .skip(offset)
      .sort({ no: 1 })
  }

  async findOne(term: string) {
    let pokemon: Pokemon | null = null;

    if ( !isNaN(Number(term)) ) {
      pokemon = await this.pokemonModel.findOne({ no: term })
      return pokemon
    }

    if ( !pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
      return pokemon;
    }

    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() })
      return pokemon
    }

    if ( !pokemon ) {
      throw new NotFoundException(`Pokemon with ${term} not found`)
    }

    return pokemon
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term)
    if (!pokemon) throw new NotFoundException(`Pokemon with ${term} not found`)

    try {
      if ( updatePokemonDto.name ) updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

      await pokemon.updateOne(updatePokemonDto)

      return pokemon;
    }catch (error) {
      this.handleExcetions(error);
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id })
    if (deletedCount === 0) throw new NotFoundException(`Pokemon with ${id} not found`)

    return
  }

  async deleteAll() {
    await this.pokemonModel.deleteMany({})
  }

  private handleExcetions(error: any){
    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon already exists witch ${ JSON.stringify( error.keyValue) }`);
    }
    throw new InternalServerErrorException(`Can't update pokemon - check server logs`)
  }
}
