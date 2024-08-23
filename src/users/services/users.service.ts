import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { User } from '../results/user.result';
import { CreateUserCmd } from '../cmds/create-user.cmd';
import { UpdateUserFilter } from '../filters/update-user.filter';
import { validateOrReject } from 'class-validator';
import { validateField } from '../validators/validators';

@Injectable()
export class UsersService {
  private users: User[] = [];
  private nextId = 1;

  // creacion de nuevo usuario, recibe 3 parametros, se validan los campos y que el mail no este registrado, en caso de exito  devuelve un objeto user con su id autogenerado

  async create(payload: CreateUserCmd): Promise<User> {
    try {
      // Validar los datos recibidos
      validateField('name', payload.name);
      validateField('email', payload.email);
      if (
        typeof payload.age !== 'number' ||
        typeof payload.name !== 'string' ||
        typeof payload.email !== 'string'
      ) {
        throw new BadRequestException('Datos de entrada inválidos');
      }
      await validateOrReject(payload);

      const emailExists = this.users.some(
        (user) => user.email === payload.email,
      );
      if (emailExists) {
        throw new ConflictException('El email ya está registrado');
      }

      const newUser: User = { id: this.nextId++, ...payload };
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

   // busca todos los usuarios registrados, si lo encuentra y devuelve un array de objetos user , de lo contrario un array vacio
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

  // busca por un id pasado por parametro el usuario correspondiente, si lo encuentra y devuelve un objeto user , de lo contrario tira una excepecion
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
// actualiza para un id los campos que se pasaron en el payload por defecto se tienen que mandar todos los campos , si lo encuentra actualiza y devuelve un objeto user, sino tira un excepción
  async update(id: number, payload: UpdateUserFilter): Promise<User> {
    try {
      validateField('name', payload.name);
      validateField('email', payload.email);

      // Validar que el id sea un número

      if (typeof id !== 'number' || isNaN(id)) {
        throw new BadRequestException('ID inválido');
      }
      const userIndex = await this.users.findIndex((user) => user.id === id);
      if (userIndex === -1) {
        throw new NotFoundException(`User no encontrado`);
      }
      const updatedUser = { ...this.users[userIndex], ...payload };
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

  // recibe por parametro un id, realiza las validaciones del campo, en caso de encontrarlo lo elimina de lo contrario tira un mensaje
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
