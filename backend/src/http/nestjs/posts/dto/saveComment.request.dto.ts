import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class SaveCommentInputDto {
  @ApiProperty({ example: "Comentário" })
  @IsString({ message: "O comentário deve ser uma string" })
  @IsNotEmpty({ message: "O comentário não pode ser vazio" })
  comment: string;

  @ApiProperty({ example: "UUID do autor do post" })
  @IsString({ message: "O UUID do autor do post deve ser uma string" })
  @IsNotEmpty({ message: "O UUID do autor do post não pode ser vazio" })
  posterUuid: string;
}
