import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class AuthLoginRequestDto {
  @ApiProperty({ example: "123456" })
  @IsString({ message: "A senha deve ser uma string" })
  @IsNotEmpty({ message: "A senha não pode ser vazia" })
  password: string;

  @ApiProperty({ example: "user1@gmail.com" })
  @IsString({ message: "O email deve ser uma string" })
  @IsNotEmpty({ message: "O email não pode ser vazio" })
  email: string;
}
