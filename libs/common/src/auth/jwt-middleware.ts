import { HttpException, HttpStatus, Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, tap, throwError } from "rxjs";
import { VALIDATE_USER } from "../rabbit/events";
import { AUTH_SERVICE } from "../rabbit/names";
import { AuthDTO, ResponseDTO } from "../dto";


@Injectable()
export class JwtMiddleware implements NestMiddleware {
    constructor(
        @Inject(AUTH_SERVICE) private authClient: ClientProxy,
    ) { }
    
    async use(req, res, next) {
        const auth = req.headers.authorization;
        if (!auth) {
            next();
            return;
        }

        const [bearer, token] = auth.split(' ');
        if (bearer === "Bearer" && token) {
    
            const response: ResponseDTO<AuthDTO> = await firstValueFrom(
                this.authClient.send(VALIDATE_USER, { token, })
            );
            if (response.status === 'error') {
                throw new HttpException(response.error, HttpStatus.FORBIDDEN)
            }
            console.log(response.value);

            req.user = response.value;
            next();
        }
    

    }
}