import { getMockReq, getMockRes } from '@jest-mock/express';
import express from 'express';
import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import { User } from '../../entities/user.entity';
import { AuthService } from '../../services/auth/auth.service';
import {
  EmailAlreadyTakenException,
  InvalidPasswordException,
  UserNotRegisteredException,
} from '../../services/user/user.exceptions';
import { AuthRouter } from './auth.router';

let mockAuthService: MockProxy<AuthService>;
let authRouter: any;

beforeAll(() => {
  mockAuthService = mock<AuthService>();
  authRouter = AuthRouter(express.Router(), mockAuthService);
});

afterEach(() => {
  mockReset(mockAuthService);
});

describe('login endpoint', () => {
  test('should return 200 http status code when successful login', async () => {
    const token = 'a valid token';

    mockAuthService.login.mockImplementation((email, password) =>
      Promise.resolve(token)
    );

    const mockReq = getMockReq();
    const { res: mockRes } = getMockRes();

    await authRouter.login(mockReq, mockRes);

    expect(mockAuthService.login).toBeCalledTimes(1);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ token: token });
  });

  test('should return 404 http status code when user is not registered', async () => {
    mockAuthService.login.mockImplementation((email, password) => {
      throw new UserNotRegisteredException();
    });

    const mockReq = getMockReq();
    const { res: mockRes } = getMockRes();

    await authRouter.login(mockReq, mockRes);

    expect(mockAuthService.login).toBeCalledTimes(1);
    expect(mockRes.status).toHaveBeenCalledWith(404);
  });

  test('should return 400 http status code when invalid password', async () => {
    mockAuthService.login.mockImplementation((email, password) => {
      throw new InvalidPasswordException();
    });

    const mockReq = getMockReq();
    const { res: mockRes } = getMockRes();

    await authRouter.login(mockReq, mockRes);

    expect(mockAuthService.login).toBeCalledTimes(1);
    expect(mockRes.status).toHaveBeenCalledWith(400);
  });
});

describe('register endpoint', () => {
  test('should return 200 http status code when successful register', async () => {
    const newUser = {
      id: 1,
      token: 'a valid token',
    };

    mockAuthService.register.mockImplementation((user) => {
      return Promise.resolve(newUser as User & { token: string });
    });

    const mockReq = getMockReq();
    const { res: mockRes } = getMockRes();

    await authRouter.register(mockReq, mockRes);

    expect(mockAuthService.register).toBeCalledTimes(1);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ ...newUser });
  });

  test('should return 409 http status code if user already exists', async () => {
    mockAuthService.register.mockImplementation((user) => {
      throw new EmailAlreadyTakenException();
    });

    const mockReq = getMockReq();
    const { res: mockRes } = getMockRes();

    await authRouter.register(mockReq, mockRes);

    expect(mockAuthService.register).toBeCalledTimes(1);
    expect(mockRes.status).toHaveBeenCalledWith(409);
  });
});
