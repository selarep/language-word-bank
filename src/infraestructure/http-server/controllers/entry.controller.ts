import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ENTRY_SERVICE } from 'src/core/core.module';
import { EntryService } from 'src/core/domain/ports/inbound/EntryService';
import { AppResponse } from '../model/app.response';
import { CreateEntryRequest } from '../model/create-entry.request';
import { CreateDefinitionRequest } from '../model/create-definition.request';
import { UpdateDefinitionRequest } from '../model/update-definition.request';
import { Entry } from 'src/core/domain/model/entities/Entry';
import { EntryNotFoundError } from 'src/core/application/errors/entry-not-found.error';

@Controller('/entry')
export class EntryController {
  constructor(
    @Inject(ENTRY_SERVICE)
    private readonly entryService: EntryService,
  ) {}

  @Post()
  async createEntry(@Body() request: CreateEntryRequest): Promise<AppResponse> {
    let existingEntry: Entry | undefined;
    try {
      existingEntry = await this.entryService.findByTerm(request.term);
    } catch (error) {
      if (!(error instanceof EntryNotFoundError)) {
        throw error;
      }
    }

    if (existingEntry) {
      return {
        status: HttpStatus.CONFLICT,
        message: 'Entry already exists',
      };
    }

    const entry = await this.entryService.create(request);

    return {
      status: HttpStatus.CREATED,
      data: { entry },
    };
  }

  @Get('/:id')
  async getEntryById(@Param('id') id: string): Promise<AppResponse> {
    const entry = await this.entryService.findById(id);

    return {
      status: HttpStatus.OK,
      data: { entry },
    };
  }

  @Get()
  async getEntryByTerm(@Query('term') term: string): Promise<AppResponse> {
    if (!term) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'No term provided',
      };
    }

    const entry = await this.entryService.findByTerm(term);

    return {
      status: HttpStatus.OK,
      data: { entry },
    };
  }

  @Post('/:id/definition')
  async addDefinition(
    @Param('id') entryId: string,
    @Body() request: CreateDefinitionRequest,
  ): Promise<AppResponse> {
    const definition = await this.entryService.addDefinition(entryId, request);

    return {
      status: HttpStatus.CREATED,
      data: { definition },
    };
  }

  @Patch('/:id/definition/:definitionId')
  async updateDefinition(
    @Param('id') entryId: string,
    @Param('definitionId') definitionId: string,
    @Body() request: UpdateDefinitionRequest,
  ): Promise<AppResponse> {
    const definition = await this.entryService.updateDefinition(
      entryId,
      definitionId,
      request,
    );

    return {
      status: HttpStatus.OK,
      data: { definition },
    };
  }

  @Delete('/:id/definition/:definitionId')
  async removeDefinition(
    @Param('id') entryId: string,
    @Param('definitionId') definitionId: string,
  ): Promise<AppResponse> {
    await this.entryService.removeDefinition(entryId, definitionId);

    return {
      status: HttpStatus.NO_CONTENT,
    };
  }

  @Delete('/:id')
  async removeEntry(@Param('id') id: string): Promise<AppResponse> {
    await this.entryService.remove(id);

    return {
      status: HttpStatus.NO_CONTENT,
    };
  }
}
