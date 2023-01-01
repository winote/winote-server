import { ApiProperty } from '@nestjs/swagger';

export interface AuthDTO {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly token: string;
  readonly avatar: string;
}

export class AuthInputDTO {
  @ApiProperty({ required: true })
  readonly email: string;

  @ApiProperty({ required: true })
  readonly password: string;
}
