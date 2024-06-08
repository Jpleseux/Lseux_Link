import { ApiProperty } from "@nestjs/swagger";

export class UpdateEntityInputDto {
  @ApiProperty({ example: "Nome da entidade" })
  name: string;

  @ApiProperty({ example: "Tipo da entidade" })
  type: string;
}
