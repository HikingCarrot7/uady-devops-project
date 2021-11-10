export class SiteNotFoundException extends Error {
  constructor(id?: number, msg = 'El sitio no existe!') {
    if (id) {
      super(`El sitio con el id: ${id} no existe!`);
      return;
    }

    super(msg);
  }
}

export class InvalidSiteException extends Error {
  constructor(msg = 'Ya existe un sitio con ese estado la ciudad!') {
    super(msg);
  }
}

export class SiteAlreadyExistsException extends Error {
  constructor(msg = 'Ya existe un sitio con esos datos!') {
    super(msg);
  }
}

export class CountryNotFoundException extends Error {
  constructor(id?: number, msg = 'El país con ese id no existe!') {
    if (id) {
      super(`El país con el id: ${id} no existe!`);
      return;
    }

    super(msg);
  }
}
