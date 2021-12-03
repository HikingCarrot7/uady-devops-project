export class FlightTicketNotFoundException extends Error {
  constructor(id?: number, msg = 'El ticket no existe!') {
    if (id) {
      super(`El ticket con el id: ${id} no existe`);
      return;
    }

    super(msg);
  }
}
