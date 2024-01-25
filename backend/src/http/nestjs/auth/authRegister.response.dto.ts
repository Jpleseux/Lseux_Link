import { userProps } from "@modules/auth/core/register/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class AuthRegisterUserResponse {
  @ApiProperty({ example: "usuario salvo com sucesso, um email foi enviado para sua caixa de emails para verificação da cont" })
  @IsString()
  message: string;

  @ApiProperty({
    example: {
      name: "userTeste",
      phone_number: "24514981028",
      email: "usuario91@email.com",
      password: "$2b$12$Vm5DXtQUPcu7OF7Z.FEqd.DbGT4LMhzeTcFLZ1seTsqsa4DcMFGja",
      uuid: "32408357-f306-442f-8682-018516c8984c",
    },
  })
  @IsString()
  user: userProps;
}
