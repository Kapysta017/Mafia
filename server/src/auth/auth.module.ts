import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Player } from '../entities/entities'; // або де у тебе сутність

@Module({
  imports: [TypeOrmModule.forFeature([Player])],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
