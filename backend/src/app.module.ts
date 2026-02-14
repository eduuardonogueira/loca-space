import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { UserModule } from './modules/user/user.module';  <-- COMENTE AQUI
// import { AuthModule } from './modules/auth/auth.module';  <-- COMENTE AQUI
import { SelfConsultModule } from './tasks/self-consult/self-consult.module'; // Sua pasta tasks
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    // UserModule,  <-- COMENTE AQUI (Adicione // na frente)
    // AuthModule,  <-- COMENTE AQUI
    SelfConsultModule, // Deixe apenas o seu funcionando!
  ],
})
export class AppModule {}