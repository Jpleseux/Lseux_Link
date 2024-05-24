import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class SaveNewReactioRequestDto {
  @ApiProperty({ example: "tipo da reação do post" })
  @IsString({ message: "O tipo da reação deve ser uma string" })
  @IsNotEmpty({ message: "O tipo da reação não pode ser vazio" })
  type: string;
}
