import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiConsumes,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express'; 
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateProfileDto } from './dto/create-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um usuário' })
  @ApiResponse({
    status: 200,
    description: 'Usuário criado com sucesso.',
  })
  create(@Body() userPayload: CreateUserDto) {
    return this.userService.create(userPayload);
  }

  @Post('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cria o perfil do usuário com foto' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary', description: 'Foto de perfil' },
        zipCode: { type: 'string', example: '66014-180' },
        street: { type: 'string', example: 'Av. Perimetral' },
        number: { type: 'string', example: '3004' },
        complement: { type: 'string', example: 'Apto 716' },
        neighborhood: { type: 'string', example: 'Guamá' },
        city: { type: 'string', example: 'Pará' },
        state: { type: 'string', example: 'PA' },
        phone: { type: 'string', example: '91988887777' },
        gender: { type: 'string', example: 'Masculino' },
        birthDate: { type: 'string', example: '1998-05-15' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async createProfile(
    @Req() req,
    @Body() createProfileDto: CreateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.createProfile(req.user.userId, createProfileDto, file);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retorna o perfil do usuário logado com salas, favoritos e agendamentos' })
  @ApiResponse({
    status: 200,
    description: 'Perfil do usuário retornado com sucesso.',
  })
  async getProfile(@Req() req) {
    return this.userService.getProfile(req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os usuários' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso.',
  })
  async findAll(@Query('page') page?: number, @Query('size') size?: number) {
    let pageNumber = page ? Number(page) : 1;
    if (pageNumber < 1) pageNumber = 1;
    const sizeNumber = size ? Number(size) : 10;
    return await this.userService.findAll(pageNumber, sizeNumber);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um usuário pelo ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Usuário encontrado.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um usuário pelo ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Get(':id/details')
  @ApiOperation({ summary: 'Retorna detalhes do usuário e seus agendamentos' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Detalhes do usuário retornados com sucesso.',
  })
  async getUserDetails(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.getUserDetails(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um usuário pelo ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Usuário removido com sucesso.' })
  remove(@Param('id', ParseIntPipe) id: number) {
   return this.userService.remove(id);
  }
}