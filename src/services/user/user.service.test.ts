import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { invalidIdMsg } from '../../utils/validate_id';
import { UserService } from './user.service';

let mockUsersRepository: MockProxy<Repository<User>>;
let userService: any;

beforeAll(() => {
  mockUsersRepository = mock<Repository<User>>();
  userService = new UserService(mockUsersRepository);
});

afterEach(() => {
  mockReset(mockUsersRepository);
});

describe('getAllUsers method', () => {
  test('get all users', async () => {
    mockUsersRepository.find.mockReturnValueOnce(Promise.resolve([]));

    await userService.getAllUsers();

    expect(mockUsersRepository.find).toHaveBeenCalledTimes(1);
  });
});

describe('getUserById method', () => {
  test('get user with a valid id', async () => {
    const userId = 1;
    const user = {
      id: 1,
      username: 'User1',
      email: 'user1@gmail.com',
      password: 'user1password',
    } as User;

    mockUsersRepository.findOne.mockReturnValueOnce(Promise.resolve(user));

    await userService.getUserById(userId);

    expect(mockUsersRepository.findOne).toHaveBeenCalledTimes(1);
    expect(mockUsersRepository.findOne).toHaveBeenCalledWith({ id: userId });
    expect(mockUsersRepository.findOne).toHaveReturned();
  });

  test('get user with a invalid id', async () => {
    const userId = 'invalidId';
    const user = {
      id: 1,
      username: 'User1',
      email: 'user1@gmail.com',
      password: 'user1password',
    } as User;

    mockUsersRepository.findOne.mockReturnValueOnce(Promise.resolve(user));

    await userService.getUserById(userId).catch((e: any) => {
      expect(e).toEqual(invalidIdMsg(userId));
    });
  });
});

describe('createUser method', () => {
  test('create a new user should work', async () => {
    const providedUser = {
      username: 'User1',
      email: 'user1@gmail.com',
      password: 'user1password',
    } as User;

    const newUser = { ...providedUser, id: 3 } as User;

    mockUsersRepository.save.mockReturnValueOnce(Promise.resolve(newUser));

    await userService.createUser(providedUser);

    expect(mockUsersRepository.save).toHaveBeenCalledWith(providedUser);
    expect(mockUsersRepository.save).toHaveBeenCalledTimes(1);
    expect(mockUsersRepository.save).toHaveReturned();
  });
});

describe('UpdateUser method', () => {
  test('update user should work', async () => {
    const providedUser = {
      username: 'User1',
      email: 'user1@gmail.com',
      password: 'user1password',
    } as User;

    const fetchedUser = {
      username: 'User2',
      email: 'user1@gmail.com',
      password: 'user1password',
    } as User;

    const savedUser = {
      username: 'User1',
      email: 'user1@gmail.com',
      password: 'user1password',
    } as User;

    mockUsersRepository.save.mockReturnValueOnce(Promise.resolve(savedUser));

    mockUsersRepository.findOne.mockReturnValue(Promise.resolve(fetchedUser));

    await userService.updateUser(1, providedUser);

    expect(mockUsersRepository.findOne).toHaveBeenCalledTimes(3);
    expect(mockUsersRepository.findOne).toHaveBeenCalledWith({ id: 1 });
    expect(mockUsersRepository.save).toHaveReturned();
  });
});

describe('deleteUser method', () => {
  test('delete user', async () => {
    const user = {
      id: 1,
      username: 'User1',
      email: 'user1@gmail.com',
      password: 'user1password',
    } as User;

    mockUsersRepository.findOne.mockReturnValueOnce(Promise.resolve(user));

    await userService.deleteUserById(user.id);

    expect(mockUsersRepository.delete).toHaveBeenCalledTimes(1);
    expect(mockUsersRepository.delete).toHaveBeenCalledWith({ id: user.id });
  });
});
