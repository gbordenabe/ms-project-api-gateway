import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ProxyModule } from 'src/common/proxy/proxy.module';
import { CommonModule } from 'src/common/common.module';
import { AuthService } from './auth.service';

@Module({
  imports: [ProxyModule, CommonModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
