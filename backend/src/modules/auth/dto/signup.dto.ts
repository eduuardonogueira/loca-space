import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({ example: 'Paulo Moraes' })
  fullName: string;

  @ApiProperty({ example: 'pauloMoraes@email.com' })
  email: string;

  @ApiProperty({ example: 'producaoSoftware2025' })
  password: string;
}
