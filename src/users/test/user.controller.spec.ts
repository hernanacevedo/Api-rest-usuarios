import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../controllers/users.controller';
import { UsersService } from '../services/users.service';
import { CreateUserCmd } from '../cmds/create-user.cmd';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn().mockImplementation((dto: CreateUserCmd) => ({
              id: Date.now(),
              ...dto,
            })),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    // Prueba 1
    it('Deberia crear un usuario y retorna el usuario', async () => {
      const usuarios: CreateUserCmd = {
        name: 'hernan',
        email: 'hernan@gmail.com',
        age: 10,
      };
      const result = { id: 1, ...usuarios };

      jest.spyOn(service, 'create').mockResolvedValue(result);

      const usuarioCreado = await controller.create(usuarios);

      console.log('Usuario enviado:', usuarios);
      console.log('Usuario creado:', usuarioCreado);

      expect(usuarioCreado).toEqual(result);
    });

    //prueba manejo de errores

    it('Deberia tirar un error al fallar el servicio', async () => {
      const usuario: CreateUserCmd = {
        name: 'hernan',
        email: 'hernan@gmail.com',
        age: 10,
      };

      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new Error('Fallo en la creación de  usuario'));

      await expect(controller.create(usuario)).rejects.toThrow(
        'Fallo en la creación de  usuario',
      );
    });

    //
  });
});
