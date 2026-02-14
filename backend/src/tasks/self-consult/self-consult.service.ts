import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaClient } from '@prisma/client'; 
import configuration from 'src/config/configuration';

@Injectable()
export class SelfConsultService extends PrismaClient {
  private readonly logger = new Logger(SelfConsultService.name);

  constructor() {
    super();
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async keepAlivePing() {
    try {
      const config = configuration();
      const url = config.backendUrl;
      const res = await fetch(url);
      this.logger.log(`Keep-alive ping sent to ${url} - status: ${res.status}`);
    } catch (err) {
      this.logger.warn('Keep-alive ping failed: ' + err?.message);
    }
  }

  // --- SUA TASK DA FACULDADE TOTALMENTE CORRIGIDA ---
  async consultarDisponibilidade(salaId: string, dataHora: string) {
    // Usamos 'appointment' conforme definido no seu schema.prisma
    const agendamentoExistente = await this.appointment.findFirst({
      where: {
        roomId: Number(salaId), // Converte para número
        date: new Date(dataHora), // Campo 'date' existe no modelo Appointment
        status: 'CONFIRMED', // Status correto conforme seu Enum
      },
    });

    return {
      disponivel: !agendamentoExistente,
      mensagem: agendamentoExistente 
        ? 'Este local já possui um agendamento confirmado.' 
        : 'Local disponível para reserva!',
    };
  }
}