import { NextFunction, Request, Response } from 'express';
import { serializeError } from '../utils/serialize_error';
import { invalidIdMsg } from '../utils/validate_id';

export const validateParamId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  if (isNaN(parseInt(id))) {
    return res.status(400).json(serializeError(invalidIdMsg(id)));
  }

  return next();
};
