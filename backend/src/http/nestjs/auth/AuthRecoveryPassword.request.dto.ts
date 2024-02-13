import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class AuthRecoveryPasswordDto {
  @ApiProperty({ example: "12345678" })
  @IsString({ message: "A senha deve ser uma string" })
  @IsNotEmpty({ message: "A senha não pode ser vazia" })
  @MinLength(8, {
    message: "Senha precisa ter no minimo 8 caracteres.",
  })
  password: string;
}
