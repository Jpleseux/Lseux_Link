import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class ProfileSetNewAvatarDto {
  @ApiProperty({ example: "base64Image" })
  @IsString({ message: "A imagem deve ser uma string" })
  @IsNotEmpty({ message: "A imagem não pode ser vazia" })
  avatar: string;
}
