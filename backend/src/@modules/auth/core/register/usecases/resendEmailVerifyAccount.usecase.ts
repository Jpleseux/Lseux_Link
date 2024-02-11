import { RegisterEmailQueueInterface } from "../registerEmailQueue.interface";
import { RegisterRepositoryInterface } from "../registerRepository.interface";
import { apiError } from "../../../../../http/nestjs/helpers/api-Error.helper";
import { RegisterGatewayInterface } from "../registerGateway.interface";

export class ResendEmailVerifyAccountUsecase {
  constructor(
    readonly repo: RegisterRepositoryInterface,
    readonly queue: RegisterEmailQueueInterface,
    readonly gateway: RegisterGatewayInterface,
  ) {}
  public async execute(email: string): Promise<string> {
    const user = await this.repo.findByEmail(email);
    if (!user) {
      throw new apiError("Usuario não encontrado", 404, "NOT_FOUND");
    } else if (user.is_verify() === true) {
      throw new apiError("Esse usuario já foi verificado", 404, "NOT_FOUND");
    }
    const token = await this.gateway.tokenGenerate(user);
    const emailContent = {
      from: process.env.EMAILADMIN,
      to: user.email(),
      subject: "Verificação de conta",
      text: "Clique no botão abaixo e será redirecionado para o site.",
      html: `<a href='http://localhost:5173/verify/account/${token}/${user.email()}'><button style='font-size: 16px; font-weight: 600; padding: 1vh 1vw; cursor: pointer;border-radius: 1vh; color: #fff; background-color: #303f9f; border: none;'>Clique aqui!</button></a>`,
    };
    await this.queue.sendEmail(emailContent);
    return token;
  }
}
