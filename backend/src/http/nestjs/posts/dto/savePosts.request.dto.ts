import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsArray, IsOptional } from "class-validator";

export class SavePostInputDto {
  @ApiProperty({ example: "Título do post" })
  @IsString({ message: "O título deve ser uma string" })
  @IsNotEmpty({ message: "O título não pode ser vazio" })
  title: string;

  @ApiProperty({ example: "Texto do post" })
  @IsString({ message: "O texto deve ser uma string" })
  @IsNotEmpty({ message: "O texto não pode ser vazio" })
  text: string;

  @ApiProperty({ example: ["url_da_imagem1", "url_da_imagem2"] })
  @IsOptional()
  @IsArray({ message: "As imagens devem ser fornecidas como um array de strings" })
  images: string[];
}
