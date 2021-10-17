export class EmailAlreadyTakenException extends Error {
  constructor(email?: string, msg = 'El email ya está registrado!') {
    if (email) {
      super(`El email: ${email} ya está registrado!`);
      return;
    }

    super(msg);
  }
}

export class UserNotRegisteredException extends Error {
  constructor(msg = 'El usuario no está registrado!') {
    super(msg);
  }
}

export class UserNotFoundException extends Error {
  constructor(id?: number, msg = 'El usuario no existe!') {
    if (id) {
      super(`El usuario con el id: ${id} no existe`);
      return;
    }

    super(msg);
  }
}

export class InvalidPasswordException extends Error {
  constructor(msg = 'La contraseña es incorrecta') {
    super(msg);
  }
}
