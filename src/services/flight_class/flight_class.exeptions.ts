export class FlightClassNotFoundException extends Error {
  constructor(id?: number, msg = 'Esa clase para vuelo no existe!') {
    if (id) {
      super(`La clase de vuelo con el id: ${id} no existe`);
      return;
    }

    super(msg);
  }
}
