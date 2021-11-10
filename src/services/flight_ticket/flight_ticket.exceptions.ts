export class InmutableFieldException extends Error {
  constructor(msg = 'No puedes editar este campo') {
    super(msg);
  }
}
