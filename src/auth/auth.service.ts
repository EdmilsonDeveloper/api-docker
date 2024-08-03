import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compareSync as bcryptCompareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { InjectModel } from '@nestjs/sequelize';
import { AuthResponseDto } from './auth.dto';
import { Session } from 'src/auth/session.model';

@Injectable()
export class AuthService {
    private jwtExpirationTimeInSeconds: number;

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,

        @InjectModel(Session)
        private readonly sessionModel: typeof Session,
    ){
        this.jwtExpirationTimeInSeconds = +this.configService.get<number>(
            'JWT_EXPIRATION_TIME',
          );
    }

    async signIn(username: string, password: string): Promise<AuthResponseDto> {
        const foundUser = await this.userService.findByUsername(username);
        console.log(foundUser);
        
        if (!foundUser || !bcryptCompareSync(password, foundUser.password)) {
            throw new UnauthorizedException();
        }

        const payload = { sub: foundUser.id, username: foundUser.username };
        const tokenJwt = this.jwtService.sign(payload);

        const createdSession = {
            token: tokenJwt,
            userId: foundUser.id
        }

        const { token, userId } = await this.sessionModel.create(createdSession)
        return { token, expiresIn: this.jwtExpirationTimeInSeconds }
    }
}
