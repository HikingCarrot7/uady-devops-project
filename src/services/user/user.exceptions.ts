export class UserAlreadyExistsException extends Error {
  constructor(msg: string = 'El email ya está registrado!') {
    super(msg);
  }
}

export class UserNotRegisteredException extends Error {
  constructor(msg: string = 'El usuario no está registrado!') {
    super(msg);
  }
}

export class InvalidPasswordException extends Error {
  constructor(msg: string = 'La contraseña es incorrecta') {
    super(msg);
  }
}
