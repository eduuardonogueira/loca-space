import { HttpException, Injectable } from '@nestjs/common';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { UpdateAmenityDto } from './dto/update-amenity.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Amenity } from './entities/amenity.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AmenitiesService {
  constructor(
    @InjectRepository(Amenity)
    private amenitiesRepository: Repository<Amenity>,
  ) {}

  async create(createAmenityDto: CreateAmenityDto) {
    const amenity = this.amenitiesRepository.create({ ...createAmenityDto });
    return await this.amenitiesRepository.save(amenity);
  }

  async remove(id: number) {
    const foundAmenity = await this.findOne(id);
    return this.amenitiesRepository.delete(foundAmenity.id);
  }

  async findAll() {
    const findedAmenities = await this.amenitiesRepository.find();
    if (!findedAmenities) {
      throw new HttpException(`Amenities Not Found`, 404);
    }
    return findedAmenities;
  }

  async findOne(id: number) {
    const amenity = await this.amenitiesRepository.findOne({ where: { id } });
    if (!amenity) {
      throw new HttpException(`Amenity with ID ${id} not found`, 404);
    }
    return amenity;
  }

  async update(id: number, updateAmenityDto: UpdateAmenityDto) {
    const amenity = await this.amenitiesRepository.preload({
      id,
      ...updateAmenityDto,
    });
    if (!amenity) {
      throw new HttpException(`Amenity with ID ${id} not found`, 404);
    }
    return this.amenitiesRepository.save(amenity);
  }
}
