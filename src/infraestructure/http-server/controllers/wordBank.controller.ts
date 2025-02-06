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
} from '@nestjs/common';
import { ENTRY_SERVICE, WORD_BANK_SERVICE } from 'src/core/core.module';
import { WordBankService } from 'src/core/domain/ports/inbound/WordBankService';
import { AppResponse } from '../model/app.response';
import { CreateWordBankRequest } from '../model/create-wordBank.request';
import { EntryService } from 'src/core/domain/ports/inbound/EntryService';
import { UpdateWordBankRequest } from '../model/update-wordBank.request';

@Controller('/word-bank')
export class WordBankController {
  constructor(
    @Inject(WORD_BANK_SERVICE)
    private readonly wordBankService: WordBankService,
    @Inject(ENTRY_SERVICE)
    private readonly entryService: EntryService,
  ) {}

  @Post()
  async createWordBank(
    @Body() request: CreateWordBankRequest,
  ): Promise<AppResponse> {
    const wordBank = await this.wordBankService.create(request);

    return {
      status: HttpStatus.CREATED,
      data: { wordBank },
    };
  }

  @Get('/:id')
  async getWordBankById(@Param('id') id: string): Promise<AppResponse> {
    const wordBank = await this.wordBankService.findById(id);

    return {
      status: HttpStatus.OK,
      data: { wordBank },
    };
  }

  @Get()
  async getAllWordBanks(): Promise<AppResponse> {
    const wordBanks = await this.wordBankService.findAll();

    return {
      status: HttpStatus.OK,
      data: { wordBanks },
    };
  }

  @Get('/:id/entry')
  async getAllEntriesFromWordBank(
    @Param('id') id: string,
  ): Promise<AppResponse> {
    const entries = await this.entryService.findAllFromWordBank(id);

    return {
      status: HttpStatus.OK,
      data: { entries },
    };
  }

  @Post('/:id/entry/:entryId')
  async assignEntryById(
    @Param('id') id: string,
    @Param('entryId') entryId: string,
  ): Promise<AppResponse> {
    const wordBank = await this.wordBankService.assignEntry(id, entryId);

    return {
      status: HttpStatus.OK,
      data: { wordBank },
    };
  }

  @Post('/:id/entry/term/:term')
  async assignEntryByTerm(
    @Param('id') id: string,
    @Param('term') term: string,
  ): Promise<AppResponse> {
    const wordBank = await this.wordBankService.assignEntryByTerm(id, term);

    return {
      status: HttpStatus.CREATED,
      data: { wordBank },
    };
  }

  @Delete('/:id/entry/:entryId')
  async unassignEntryById(
    @Param('id') id: string,
    @Param('entryId') entryId: string,
  ): Promise<AppResponse> {
    const wordBank = await this.wordBankService.unassignEntry(id, entryId);

    return {
      status: HttpStatus.OK,
      data: { wordBank },
    };
  }

  @Patch('/:id')
  async updateWordBank(
    @Param('id') id: string,
    @Body() request: UpdateWordBankRequest,
  ): Promise<AppResponse> {
    const wordBank = await this.wordBankService.updateWordBank(id, request);

    return {
      status: HttpStatus.OK,
      data: { wordBank },
    };
  }

  @Delete('/:id')
  async deleteWordBank(@Param('id') id: string): Promise<AppResponse> {
    await this.wordBankService.remove(id);

    return {
      status: HttpStatus.NO_CONTENT,
    };
  }
}
