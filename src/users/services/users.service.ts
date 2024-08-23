import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { CreateUserCmd } from '../cmds/create-user.cmd';
import { UpdateUserFilter } from '../filters/update-user.filter';
import { validateOrReject } from 'class-validator';
import { validateField } from '../validators/validators';

@Injectable()
export class UsersService {
  private users: User[] = [];
  private nextId = 1;

  // creacion de nuevo usuario, recibe 3 parametros y devuelve un objeto usuario con su id autogenerado

  async create(createUserCmd: CreateUserCmd): Promise<User> {
    try {
      // Validar los datos recibidos
      validateField('name', createUserCmd.name);
      validateField('email', createUserCmd.email);
      if (
        typeof createUserCmd.age !== 'number' ||
        typeof createUserCmd.name !== 'string' ||
        typeof createUserCmd.email !== 'string'
      ) {
        throw new BadRequestException('Datos de entrada inválidos');
      }
      await validateOrReject(createUserCmd);
      // Verificar si el email ya está registrado
      const emailExists = this.users.some(
        (user) => user.email === createUserCmd.email,
      );
      if (emailExists) {
        throw new ConflictException('El email ya está registrado');
      }

      const newUser: User = { id: this.nextId++, ...createUserCmd };
      this.users.push(newUser);

      console.log('Usuarios actuales:', this.users);
      return newUser;
    } catch (error) {
      // Manejar errores de validación o conflictos
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      // Manejar otros errores
      throw new BadRequestException('Datos de entrada inválidos');
    }
  }

  async findAll(): Promise<User[]> {
    try {
      if (this.users.length === 0) {
        return []; // Retorna un array vacío
      }

      return this.users; // Retorna el array de usuarios si existen
    } catch (error) {
      // Manejar errores de validación o conflictos

      throw new BadRequestException('Datos de entrada inválidos');
    }

    // Retorna el array de usuarios si existen
  }

  async findOne(id: number): Promise<User> {
    try {
      // Validar que el id sea un número

      if (typeof id !== 'number' || isNaN(id)) {
        throw new BadRequestException('ID inválido');
      }

      // Buscar el usuario
      const user = this.users.find((user) => user.id === id);
      if (!user) {
        throw new NotFoundException(`El usuario no se encontró registrado`);
      }

      return user;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new BadRequestException('Error al procesar la solicitud');
    }
  }

  async update(id: number, updateUserFilter: UpdateUserFilter): Promise<User> {
    try {
      validateField('name', updateUserFilter.name);
      validateField('email', updateUserFilter.email);

      // Validar que el id sea un número

      if (typeof id !== 'number' || isNaN(id)) {
        throw new BadRequestException('ID inválido');
      }
      const userIndex = await this.users.findIndex((user) => user.id === id);
      if (userIndex === -1) {
        throw new NotFoundException(`User no encontrado`);
      }
      const updatedUser = { ...this.users[userIndex], ...updateUserFilter };
      this.users[userIndex] = updatedUser;
      return updatedUser;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new BadRequestException('Error al procesar la solicitud');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      if (typeof id !== 'number' || isNaN(id)) {
        throw new BadRequestException('ID inválido');
      }
      const userIndex = await this.users.findIndex((user) => user.id === id);
      if (userIndex === -1) {
        throw new NotFoundException(`No se encontro el usuario`);
      }
      this.users.splice(userIndex, 1);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new BadRequestException('Error al procesar la solicitud');
    }
  }
}
