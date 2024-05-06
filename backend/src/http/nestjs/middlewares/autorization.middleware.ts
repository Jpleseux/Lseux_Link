import { middlewareGateway } from "@modules/shared/infra/gateway/middleware.gateway";
import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";

@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
  constructor(private readonly authGateway: middlewareGateway) {}

  async use(req: any, res: any, next: (error?: any) => void) {
    const BearerToken = req.headers["authorization"];
    if (!BearerToken || !(await this.authGateway.tokenDecoding(BearerToken.split(" ")[1]))) {
      throw new HttpException(
        {
          message: "Você deve estar logado para acessar essa página",
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const token = BearerToken.split(" ")[1];
    const payload = await this.authGateway.tokenDecoding(token);
    req["tokenPayload"] = payload;
    next();
  }
}
