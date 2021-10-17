import { getMockReq, getMockRes } from '@jest-mock/express';
import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import { User } from '../../entities/user.entity';
import { UserService } from '../../services/user/user.service';
import { invalidIdMsg, isNumericId } from '../../utils/validateId';
import { UserRouter } from './user.router';

let mockUserService: MockProxy<UserService>;
let userRouter: any;

beforeAll(() => {
  mockUserService = mock<UserService>();
  userRouter = UserRouter(mockUserService);
});

afterEach(() => {
  mockReset(mockUserService);
});

describe('getAllUsers endpoint', () => {
  test('get all users should return 200 http status if typeorm can connect to mysql', async () => {
    mockUserService.getAllUsers.mockReturnValueOnce(Promise.resolve([]));

    const mockReq = getMockReq();
    const { res: mockRes } = getMockRes();

    await userRouter.routes.getAllUsers(mockReq, mockRes);

    expect(mockUserService.getAllUsers).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith([]);
  });

  test("get all users should return 500 http status if typeorm can't connect to mysql", async () => {
    mockUserService.getAllUsers.mockReturnValueOnce(Promise.reject({}));

    const mockReq = getMockReq();
    const { res: mockRes } = getMockRes();

    await userRouter.routes.getAllUsers(mockReq, mockRes);

    expect(mockUserService.getAllUsers).toHaveBeenCalledTimes(1);
    expect(mockRes.sendStatus).toHaveBeenCalledWith(500);
    expect(mockRes.json).not.toBeCalled();
  });
});

describe('getUserById endpoint', () => {
  test('should return 200 http status code if the user exists', async () => {
    const userId = '1';

    const user = {
      id: parseInt(userId),
      name: 'User1',
      email: 'user@gmail.com',
      password: 'password',
    };

    mockUserService.getUserById.mockImplementation(async (userId) => {
      if (!isNumericId(userId)) {
        return Promise.reject(invalidIdMsg(userId));
      }

      if (userId == user.id) return Promise.resolve(user as User);

      return Promise.resolve(null as unknown as User);
    });

    const mockReq = getMockReq();
    const { res: mockRes } = getMockRes();

    mockReq.params.id = userId;

    await userRouter.routes.getUserById(mockReq, mockRes);

    expect(mockUserService.getUserById).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(200);
    expect(mockRes.json).toBeCalledWith(user);
  });

  test('should return 500 http status code if the user id is invalid', async () => {
    const userId = 'abc';

    const user = {
      id: parseInt(userId),
      name: 'User1',
      email: 'user@gmail.com',
      password: 'password',
    };

    mockUserService.getUserById.mockImplementation(async (userId) => {
      if (!isNumericId(userId)) {
        return Promise.reject(invalidIdMsg(userId));
      }

      if (userId == user.id) return Promise.resolve(user as User);

      return Promise.resolve(null as unknown as User);
    });

    const mockReq = getMockReq();
    const { res: mockRes } = getMockRes();

    mockReq.params.id = userId;

    await userRouter.routes.getUserById(mockReq, mockRes);

    expect(mockUserService.getUserById).toBeCalledTimes(1);
    expect(mockRes.sendStatus).toBeCalledWith(500);
    expect(mockRes.json).not.toBeCalled();
  });
});

describe('createUser endpoint', () => {
  test('should return 201 http status code when a new user is created', async () => {
    const reqBody = {
      name: 'User1',
      email: 'user@gmail.com',
      password: 'password',
    };

    mockUserService.createUser.mockImplementation(() => {
      return Promise.resolve({
        id: 1,
        ...reqBody,
      } as unknown as User);
    });

    const mockReq = getMockReq();
    const { res: mockRes } = getMockRes();

    mockReq.body = reqBody;

    await userRouter.routes.createUser(mockReq, mockRes);

    expect(mockUserService.createUser).toBeCalledTimes(1);
    expect(mockRes.status).toBeCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({ id: 1, ...reqBody });
  });
});

describe('updateUser endpoint', () => {
  test('should return 200 http status code when a user is updated', async () => {
    const userId = 1;

    const reqBody = {
      email: 'newmail@gmail.com',
    };

    const originalUser = {
      id: userId,
      name: 'User1',
      email: 'user@gmail.com',
      password: 'password',
    };

    const updatedUser = {
      id: userId,
      name: 'User1',
      email: 'newmail@gmail.com',
      password: 'password',
    };

    mockUserService.updateUser.mockImplementation((userId, newUser) => {
      return Promise.resolve({ ...originalUser, ...newUser } as User);
    });

    const mockReq = getMockReq();
    const { res: mockRes } = getMockRes();

    mockReq.params.id = `${userId}`;
    mockReq.body = reqBody;

    await userRouter.routes.updateUser(mockReq, mockRes);

    expect(mockUserService.updateUser).toHaveBeenCalledTimes(1);
    expect(mockUserService.updateUser).toHaveBeenCalledWith(userId, reqBody);
    expect(mockRes.status).toBeCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(updatedUser);
  });
});
