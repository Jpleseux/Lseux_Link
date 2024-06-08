import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsArray, IsEnum, IsOptional, IsBoolean } from "class-validator";

export class SaveNotificationInputDto {
  @ApiProperty({ example: ["user1@example.com", "user2@example.com"], description: "Lista de destinatários" })
  @IsArray({ message: "O campo 'to' deve ser um array" })
  @IsString({ each: true, message: "Cada destinatário deve ser uma string" })
  @IsNotEmpty({ each: true, message: "Cada destinatário não pode ser vazio" })
  to: string[];

  @ApiProperty({ example: "system", description: "Tipo de notificação", enum: ["system", "personal", "group"] })
  @IsEnum(["system", "personal", "group"], { message: "O campo 'type' deve ser um dos valores: 'system', 'personal', 'group'" })
  @IsNotEmpty({ message: "O campo 'type' não pode ser vazio" })
  type: "system" | "personal" | "group";

  @ApiProperty({ example: "sender@example.com", description: "Remetente da mensagem", required: false })
  @IsString({ message: "O campo 'from' deve ser uma string" })
  @IsOptional()
  from?: string;

  @ApiProperty({ example: "Mensagem de notificação", description: "Texto da mensagem" })
  @IsString({ message: "O campo 'message' deve ser uma string" })
  @IsNotEmpty({ message: "O campo 'message' não pode ser vazio" })
  message: string;

  @ApiProperty({ example: true, description: "Indicador se é um convite", required: false })
  @IsBoolean({ message: "O campo 'invite' deve ser um booleano" })
  @IsOptional()
  invite?: boolean;
}
