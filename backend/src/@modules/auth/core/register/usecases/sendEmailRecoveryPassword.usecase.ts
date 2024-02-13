import { RegisterEmailQueueInterface } from "../registerEmailQueue.interface";
import { RegisterRepositoryInterface } from "../registerRepository.interface";
import { apiError } from "../../../../../http/nestjs/helpers/api-Error.helper";
import { RegisterGatewayInterface } from "../registerGateway.interface";

export class SendEmailRecoveryPasswordUsecase {
  constructor(
    readonly queue: RegisterEmailQueueInterface,
    readonly repo: RegisterRepositoryInterface,
    readonly gateway: RegisterGatewayInterface,
  ) {}
  public async execute(email: string): Promise<void> {
    const user = await this.repo.findByEmail(email);
    if (!user) {
      throw new apiError("Usuario não encontrado", 404, "NOT_FOUND");
    } else if (user.is_verify() === false) {
      throw new apiError("Usuario não verificado", 404, "NOT_FOUND");
    }
    const token = await this.gateway.tokenGenerate(user);
    const emailContent = {
      from: process.env.EMAILADMIN,
      to: user.email(),
      subject: "Mudança de conta",
      text: "",
      html: `<p>Clique no botão abaixo e será redirecionado para o site, para recuperar sua conta</p><a href='http://localhost:5173/recovery/password/${token}/${user.email}'><button style='font-size: 16px; font-weight: 600; padding: 1vh 1vw; cursor: pointer;border-radius: 1vh; color: #fff; background-color: #303f9f; border: none;'>Clique aqui!</button></a>`,
    };
    await this.queue.sendEmail(emailContent);
  }
}
