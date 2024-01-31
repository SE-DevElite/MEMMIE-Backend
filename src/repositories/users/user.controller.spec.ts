import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ParamsUserDto } from '@/interfaces/IUserRequest';
import { AuthService } from '../auth/auth.service';
import { IJWT } from '@/interfaces/IAuthRequest';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthenGuard } from '../auth/auth.guard';
import { UserResponse } from '@/common/user_response.common';

describe('UserController', () => {
  let userController: UserController;
  let authService: AuthService;

  beforeEach(async () => {
    const userModule: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, AuthService],
    }).compile();

    userController = userModule.get<UserController>(UserController);
    authService = userModule.get<AuthService>(AuthService);
  })
    .overrideGuard(AuthenGuard)
    .useValue({
      canActivate: (context: ExecutionContext) => {
        // Simulate the behavior of your AuthenGuard
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.replace('Bearer ', '');
        if (!token) {
          throw new UnauthorizedException();
        }
        // You may want to validate the token here
        return true;
      },
    })
    .compile();

  const mockUser = {
    id: '3907af0a-0814-43a2-b7bf-4883474f1aa2',
    email: 'testing@gmail.com',
  };

  describe('get user by id', () => {
    it('should return Users', async () => {
      // const userParam = new ParamsUserDto();
      // userParam.id = mockUser.id;
      // const response = await userController.getUserById(userParam);
      // const result = new UserResponse('User found', false, mockUser);
      // expect(response).toBe(result);
    });
  });
});
