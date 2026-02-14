import { Controller, Get, Query } from '@nestjs/common';
import { SelfConsultService } from './self-consult.service';

@Controller('self-consult')
export class SelfConsultController {
  constructor(private readonly selfConsultService: SelfConsultService) {}

  @Get('disponibilidade')
  async checkAvailability(
    @Query('salaId') salaId: string,
    @Query('dataHora') dataHora: string,
  ) {
    // Esta função chama a lógica que você já corrigiu no Service
    return await this.selfConsultService.consultarDisponibilidade(salaId, dataHora);
  }
}