import { Constructor } from './validation';

export const isNumericId = (id: number | string): id is number => {
  if (typeof id === 'number') {
    return !isNaN(id);
  }

  return !isNaN(parseInt(id));
};

export const invalidIdMsg = <T>(
  id: string | number,
  entity?: Constructor<T>
) => {
  if (entity) {
    return `El formato para el Id: ${id} para la entidad: ${entity.name} es inválido`;
  }

  return `El formato para el Id ${id} es inválido`;
};
