import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, tap } from "rxjs";
import { VALIDATE_USER } from "../rabbit/events";
import { AUTH_SERVICE } from "../rabbit/names";


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
    
            const user = await firstValueFrom(
                this.authClient.send(VALIDATE_USER, { token, })
            );
            console.log(user);

            req.user = user;
            next();
        }
    

    }
}