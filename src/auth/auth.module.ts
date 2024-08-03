import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Session } from './session.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
    imports: [UserModule,
        SequelizeModule.forFeature([Session]),
        JwtModule.registerAsync({
            global: true,
            imports: [],
            useFactory: async (configService: ConfigService) => ({
              secret: configService.get<string>('JWT_SECRET'),
              signOptions: {
                expiresIn: +configService.get<number>('JWT_EXPIRATION_TIME'),
              },
            }),
            inject: [ConfigService],
          })
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
