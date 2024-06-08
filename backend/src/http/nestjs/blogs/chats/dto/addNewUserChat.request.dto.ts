import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class AddNewChatUserInputRequestDto {
  @ApiProperty({ example: "UUID do usuário" })
  @IsUUID("4", { message: "O UUID do usuário deve ser um UUID válido" })
  @IsNotEmpty({ message: "O UUID do usuário não pode ser vazio" })
  userUuid: string;
  @ApiProperty({ example: "UUID do chat" })
  @IsUUID("4", { message: "O UUID do chat deve ser um UUID válido" })
  @IsNotEmpty({ message: "O UUID do chat não pode ser vazio" })
  chatUuid: string;
}
