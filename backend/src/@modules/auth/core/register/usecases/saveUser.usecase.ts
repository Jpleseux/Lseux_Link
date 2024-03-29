import { UserEntity } from "../entities/user.entity";
import { RegisterRepositoryInterface } from "../registerRepository.interface";
import { apiError } from "../../../../../http/nestjs/helpers/api-Error.helper";
import { RegisterGatewayInterface } from "../registerGateway.interface";
import { randomUUID } from "crypto";
import { RegisterEmailQueueInterface } from "../registerEmailQueue.interface";

export type userInput = {
  email: string;
  password: string;
  userName: string;
  phone_number?: string;
  isVerify?: boolean;
};
export type signUpOutput = {
  user: UserEntity;
  token: string;
};
export class saveUserUsecase {
  constructor(
    readonly repo: RegisterRepositoryInterface,
    readonly gateway: RegisterGatewayInterface,
    readonly queue: RegisterEmailQueueInterface,
  ) {}
  public async execute(user: userInput): Promise<signUpOutput> {
    const userDb = await this.repo.findByEmail(user.email);
    if (userDb && userDb.is_verify() === false) {
      throw new apiError(
        "Esse email já existe mas não foi verificado ainda, verifique sua caixa de email ou peça reenvio do token",
        400,
        "item_already_exist",
      );
    } else if (userDb && userDb.is_verify() === true) {
      throw new apiError("Este usuario já existe", 400, "item_already_exist");
    } else if ((await this.gateway.validateEmail(user.email)) === false) {
      throw new apiError("Este email é inválido", 400, "invalid_item");
    }
    const input = new UserEntity({
      email: user.email,
      password: await this.gateway.encryptPassword(user.password),
      phone_number: user.phone_number,
      userName: user.userName,
      uuid: randomUUID(),
    });
    const output = await this.repo.saveUser(input);

    const token = await this.gateway.tokenGenerate(output);
    const emailContent = {
      from: process.env.EMAILADMIN,
      to: user.email,
      subject: "Verificação de conta",
      text: "Clique no botão abaixo e será redirecionado para o site.",
      html: `<a href='http://localhost:5173/verify/account/${token}/${user.email}'><button style='font-size: 16px; font-weight: 600; padding: 1vh 1vw; cursor: pointer;border-radius: 1vh; color: #fff; background-color: #303f9f; border: none;'>Clique aqui!</button></a>`,
    };
    await this.queue.sendEmail(emailContent);
    return { user: output, token: token };
  }
}
