import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TasksModule } from './tasks/tasks.module';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            username: process.env.DB_USER || 'postgres',
            port: +process.env.DB_PORT || 5432,
            password: process.env.DB_PASSWORD || 'admin',
            database: process.env.DB_DATABASE || 'api-docker',
            autoLoadModels: true,
            synchronize: true,
    }),
    UserModule, AuthModule, TasksModule],
})
export class AppModule {}
