export class FlightNotFoundException extends Error {
  constructor(id?: number, msg = 'El vuelo no existe!') {
    if (id) {
      super(`El vuelo con el id: ${id} no existe`);
      return;
    }

    super(msg);
  }
}

export class InvalidFlightException extends Error {
  constructor(msg = 'Ya existe un vuelo con la misma fecha y hora!') {
    super(msg);
  }
}
