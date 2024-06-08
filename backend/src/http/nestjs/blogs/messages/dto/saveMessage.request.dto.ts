import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class SaveMessageInputDto {
  @ApiProperty({ example: "Texto da mensagem" })
  @IsString({ message: "O Texto deve ser uma string" })
  @IsNotEmpty({ message: "O Texto não pode ser vazio" })
  text: string;
  @ApiProperty({ example: "uuid do chat da mensagem" })
  @IsString({ message: "O uuid do chat deve ser uma string" })
  @IsNotEmpty({ message: "O uuid do chat não pode ser vazio" })
  chatUuid: string;
}
