import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserCmd } from '../cmds/create-user.cmd';
import { UpdateUserFilter } from '../filters/update-user.filter';
import { User } from '../results/user.result';

// Todas las rutas van a comenzar con /users. Ejemplo http://localhost:3000/users
// El constructor inyecta una instancia del servicio UsersService en el controlador a través de la dependencia usersService.
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // asociado al metodo create, recibe por parametros propiedades del usuario y devuelve un objeto del tipo user
  @Post()
  async create(@Body() payload: CreateUserCmd): Promise<User> {
    return await this.usersService.create(payload);
  }

  // asociado al metodo buscar todos los usuarios que existen
  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }
  // asociado al metodo buscar un usuario por id, se le agrega a la ruta original /id por query params
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.usersService.findOne(+id);
  }
  // asociado al metodo actualizar un usuario por id, se le agrega a la ruta original /id por query params
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() payload: UpdateUserFilter,
  ): Promise<User> {
    return await this.usersService.update(+id, payload);
  }

  // asociado al metodo eliminar un usuario por id, se le agrega a la ruta original /id por query params

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.usersService.remove(+id);
  }
}
