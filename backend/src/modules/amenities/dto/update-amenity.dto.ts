import { PartialType } from '@nestjs/mapped-types';
import { CreateAmenityDto } from './create-amenity.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateAmenityDto extends PartialType(CreateAmenityDto) {
  @IsNotEmpty()
  name: string;
}
