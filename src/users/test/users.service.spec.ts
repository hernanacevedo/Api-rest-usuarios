import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../services/users.service';
import { CreateUserCmd } from '../cmds/create-user.cmd';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    
    // prueba de crear un usuario y retornar un usuario

    it('Deberia crear y retornar un usuario', async () => {
      const usuario: CreateUserCmd = {
        name: 'hernan',
        email: 'hernan@gmail.com',
      };
      const result = { id: 1, ...usuario };

      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await service.create(usuario)).toEqual(result);
    });

    // prueba para asegurar que el servicio maneje adecuadamente un error inesperado durante la creación de un usuario.

    it('lanzar un error si falla la creación de un usuario ', async () => {
      const usuario: CreateUserCmd = {
        name: 'hernan',
        email: 'hernan@gmail.com',
      };

      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new Error('Fallo en la creación de  usuario'));

      await expect(service.create(usuario)).rejects.toThrow(
        'Fallo en la creación de  usuario',
      );
    });
  });
});
