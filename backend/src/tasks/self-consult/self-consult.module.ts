import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SelfConsultService } from './self-consult.service';
import { SelfConsultController } from './self-consult.controller'; // Importando a nova "porta de entrada"

@Module({
  imports: [
    // Mantém o módulo de agendamento necessário para o keep-alive ping
    ScheduleModule.forRoot(),
  ],
  controllers: [
    // Adicionamos o Controller aqui para que a rota /self-consult funcione
    SelfConsultController
  ],
  providers: [
    // Mantém o Service que contém tanto o keep-alive quanto a sua nova lógica
    SelfConsultService
  ],
})
export class SelfConsultModule {}