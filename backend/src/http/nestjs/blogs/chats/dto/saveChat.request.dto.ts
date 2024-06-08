import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty } from "class-validator";

export class SaveEntityInputDto {
  @ApiProperty({ example: "Nome da entidade" })
  @IsString({ message: "O nome deve ser uma string" })
  @IsNotEmpty({ message: "O nome não pode ser vazio" })
  name: string;

  @ApiProperty({ example: "Tipo da entidade" })
  @IsString({ message: "O tipo deve ser uma string" })
  @IsNotEmpty({ message: "O tipo não pode ser vazio" })
  type: string;

  @ApiProperty({ example: ["UUID do usuário 1", "UUID do usuário 2"] })
  @IsArray({ message: "Os usuários devem ser um array" })
  @ArrayNotEmpty({ message: "Os usuários não podem ser um array vazio" })
  @IsString({ each: true, message: "Cada UUID de usuário deve ser uma string válida" })
  users: string[];
}
