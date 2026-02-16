import { IsNotEmpty } from 'class-validator';

export class CreateAmenityDto {
  @IsNotEmpty()
  name: string;
}
