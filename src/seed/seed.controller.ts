import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get('/insert')
  executeSeed() {
    return this.seedService.executeSeed();
  }

  @Get('/delete')
  deleteSeed() {
    return this.seedService.clearDatabase();
  }
}
