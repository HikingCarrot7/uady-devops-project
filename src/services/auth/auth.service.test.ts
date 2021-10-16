import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import { User } from '../../entities/user.entity';
import {
  InvalidPasswordException,
  UserAlreadyExistsException,
} from '../user/user.exceptions';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

let mockUserService: MockProxy<UserService>;
let authService: any;

const flushPromises = () => new Promise(setImmediate);

beforeAll(() => {
  mockUserService = mock<UserService>();
  authService = new AuthService(mockUserService);
});

afterEach(() => {
  mockReset(mockUserService);
});

describe('login method', () => {
  test('login a registered user', async () => {
    const providedEmail = 'test@test.com';

    mockUserService.getUserByEmail.mockImplementation((email) => {
      return Promise.resolve({
        id: 1,
        email: 'test@test.com',
        name: 'Nicolás',
      } as User);
    });

    const compare = jest.fn((pasword, hashedPassword) => true);
    const createToken = jest.fn().mockResolvedValue('a valid token');

    (authService.createToken as jest.Mock) = createToken;

    const result = await authService.login(providedEmail, '123456', compare);

    expect(mockUserService.getUserByEmail).toBeCalledWith(providedEmail);
    expect(compare.mock.calls.length).toBe(1);
    expect(createToken.mock.calls.length).toBe(1);
    expect(result).toBeDefined();
  });

  test('login user with invalid password', async () => {
    const providedEmail = 'test@test.com';

    mockUserService.getUserByEmail.mockImplementation((email) => {
      return Promise.resolve({
        id: 1,
        email: 'test@test.com',
        name: 'Nicolás',
      } as User);
    });

    const compare = jest.fn((password, hashedPassword) => false);
    const createToken = jest.fn().mockResolvedValue('asljdfklas');

    (authService.createToken as jest.Mock) = createToken;

    expect(async () => {
      await authService.login(providedEmail, '12345', compare);
    }).rejects.toThrowError(InvalidPasswordException);

    await flushPromises();

    expect(mockUserService.getUserByEmail).toBeCalledWith(providedEmail);
    expect(compare.mock.calls.length).toBe(1);
    expect(createToken.mock.calls.length).toBe(0);
  });
});

describe('register method', () => {
  test('register a new user', async () => {
    const providedUser = {
      name: 'Nicolás',
      email: 'test@test.com',
      password: '123456',
    };

    mockUserService.createUser.mockImplementation((user) => {
      return Promise.resolve({
        id: 1,
        ...providedUser,
      } as User);
    });

    const createToken = jest.fn().mockResolvedValue('asljdfklas');
    (authService.createToken as jest.Mock) = createToken;

    const result = await authService.register(providedUser);

    expect(mockUserService.createUser).toHaveBeenCalledTimes(1);
    expect(mockUserService.createUser).toHaveBeenCalledWith(providedUser);
    expect(createToken.mock.calls.length).toBe(1);
    expect(result).toHaveProperty('token');
  });

  test('register a registered user', async () => {
    const providedUser = {
      name: 'Nicolás',
      email: 'test@test.com',
      password: '123456',
    };

    mockUserService.createUser.mockImplementation((user) => {
      throw new UserAlreadyExistsException();
    });

    expect(async () => {
      await authService.register(providedUser);
    }).rejects.toThrowError(UserAlreadyExistsException);

    await flushPromises();

    expect(mockUserService.createUser).toHaveBeenCalledTimes(1);
    expect(mockUserService.createUser).toHaveBeenCalledWith(providedUser);
  });
});
