import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { EncryptionService } from 'src/common/encryption.service';
import { RegisterDto } from './dto/register.dto';
import { ClientProxyMsProject } from 'src/common/proxy/client-proxy';
import { /* AuthMSG, */ UserMSG } from 'src/common/constants';
import { LoginDto } from './dto/login.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly clientProxy: ClientProxyMsProject,
    private readonly encryptionService: EncryptionService,
  ) {}
  /* private _clientProxyAuth = this.clientProxy.clientProxyAuth(); */
  private _clientProxyUsers = this.clientProxy.clientProxyUsers();

  async login(loginDto: LoginDto) {
    try {
      /* const response = await firstValueFrom(
        this._clientProxyAuth.send(AuthMSG.LOGIN, loginDto),
      );

      if (response.isError) {
        throw new HttpException(response.error.message, response.error.status);
      }
      return response.result; */
      const response = await firstValueFrom(
        this._clientProxyUsers.send(
          UserMSG.FIND_ONE_BY_USERNAME,
          loginDto.username,
        ),
      );
      if (response.isError) {
        throw new BadRequestException('Invalid credentials');
      }
      const user = response.result;
      const isCorrectPassword = await this.encryptionService.comparePasswords(
        loginDto.password,
        user.password,
      );
      if (!isCorrectPassword) {
        throw new BadRequestException('Invalid credentials');
      }
      delete user.password;
      return user;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async register(registerDto: RegisterDto) {
    try {
      /* registerDto.password = await this.encryptionService.hashPassword(
        registerDto.password,
      );
      const response = await firstValueFrom(
        this._clientProxyAuth.send(AuthMSG.REGISTER, registerDto),
      );

      if (response.isError) {
        throw new HttpException(response.error.message, response.error.status);
      }
      return response.result; */
      const responseVerification = await firstValueFrom(
        this._clientProxyUsers.send(
          UserMSG.CHECK_USERNAME_EMAIL_DISPONIBILITY,
          {
            username: registerDto.username,
            email: registerDto.email,
          },
        ),
      );

      if (responseVerification.isError) {
        throw new HttpException(
          responseVerification.error.message,
          responseVerification.error.status,
        );
      }
      registerDto.password = await this.encryptionService.hashPassword(
        registerDto.password,
      );

      const isAvaible = responseVerification.result;
      if (isAvaible) {
        const response = await firstValueFrom(
          this._clientProxyUsers.send(UserMSG.CREATE, registerDto),
        );
        return response.result;
      }
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
