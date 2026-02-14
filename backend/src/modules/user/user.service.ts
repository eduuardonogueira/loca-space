import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserDetailsDto } from './dto/user-details.dto';
import { Profile } from './entities/profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    
    // Adicionamos o ProfileRepository que estava faltando para o createProfile funcionar
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  async getUserDetails(id: number): Promise<UserDetailsDto> {
    const user = await this.findOne(id);
    
    if (!user) {
      throw new HttpException(
        `User with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    // COMO A PARTE DE APPOINTMENTS ESTÁ QUEBRADA, RETORNAMOS VAZIO POR ENQUANTO
    // PARA O SEU SERVIDOR RODAR SEM ERROS.
    return {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        type: user.type,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      appointments: [], // Lista vazia para não dar erro
    };
  }

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto as Partial<User>);
    user.createdAt = new Date();
    return this.userRepository.save(user);
  }

  async findAll(page: number = 1, size: number = 10) {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * size,
      take: size,
      order: { id: 'ASC' },
    });
    return {
      data: users.map((user) => ({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        type: user.type,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / size),
        size,
      },
    };
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto,
      updatedAt: new Date(),
    });

    if (!user) {
      throw new HttpException(
        `User with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.userRepository.save(user);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async createProfile(
    userId: number,
    createProfileDto: CreateProfileDto,
    file?: Express.Multer.File, 
  ) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const profile = this.profileRepository.create(createProfileDto);
    
    profile.user = user;

    if (file) {
      profile.avatarUrl = file.path; 
    }

    return await this.profileRepository.save(profile);
  }
}