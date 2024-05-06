import { ApiProperty } from "@nestjs/swagger";

export class UpdatePostInputDto {
  @ApiProperty({ example: "Título do post" })
  title: string;

  @ApiProperty({ example: "Texto do post" })
  text: string;

  @ApiProperty({ example: ["url_da_imagem1", "url_da_imagem2"] })
  images: string[];
}
