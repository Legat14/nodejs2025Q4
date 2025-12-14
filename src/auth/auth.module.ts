import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './guards/auth.guard';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule, JwtModule.register({ global: false })],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
})
export class AuthModule {}
