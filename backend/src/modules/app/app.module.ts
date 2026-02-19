import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import configuration from '../../config/configuration';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { AddressModule } from '../address/address.module';
import { RoomModule } from '../room/room.module';
import { AmenitiesModule } from '../amenities/amenities.module';
import { FavoriteModule } from '../favorite/favorite.module';
import { SelfConsultModule } from '../../tasks/self-consult/self-consult.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailModule } from '../email/email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const config = configuration();
        return {
          type: 'postgres',
          host: config.dbHost,
          port: config.dbPort,
          username: config.dbUser,
          password: config.dbPass,
          database: config.dbName,
          autoLoadEntities: true,
          synchronize: true,
          ssl: { rejectUnauthorized: false },
        };
      },
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    AddressModule,
    RoomModule,
    AmenitiesModule,
    FavoriteModule,
    SelfConsultModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: configuration().smtpUser,
          pass: configuration().smtpPassword,
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
      defaults: {
        from: `"Equipe Local Space" <${configuration().smtpUser}>`,
      },
    }),
    EmailModule,
  ],
})
export class AppModule {}
