import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EncryptionService } from 'src/common/encryption.service';
import { RegisterDto } from './dto/register.dto';
import { ClientProxyMsProject } from 'src/common/proxy/client-proxy';
import { AuthMSG } from 'src/common/constants';
import { LoginDto } from './dto/login.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly clientProxy: ClientProxyMsProject,
    private readonly encryptionService: EncryptionService,
  ) {}
  private _clientProxyAuth = this.clientProxy.clientProxyAuth();

  async login(loginDto: LoginDto) {
    console.log(loginDto);
    return this._clientProxyAuth.send(AuthMSG.LOGIN, loginDto);
  }

  async register(registerDto: RegisterDto) {
    try {
      registerDto.password = await this.encryptionService.hashPassword(
        registerDto.password,
      );
      const response = await firstValueFrom(
        this._clientProxyAuth.send(AuthMSG.REGISTER, registerDto),
      );

      if (response.isError) {
        throw new HttpException(response.error.message, response.error.status);
      }
      return response.result;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
