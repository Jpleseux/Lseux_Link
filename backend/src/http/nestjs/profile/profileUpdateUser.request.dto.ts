import { ApiProperty } from "@nestjs/swagger";

export class ProfileUpdateUserRequest {
  @ApiProperty({ example: "base64Image" })
  avatar: string;

  @ApiProperty({ example: "joao@gmail.com" })
  email: string;

  @ApiProperty({ example: "userNameExample" })
  userName: string;

  @ApiProperty({ example: "99231232123" })
  phone_number?: string;
}
