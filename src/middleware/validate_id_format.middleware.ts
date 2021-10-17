import { NextFunction, Request, Response } from 'express';
import { serializeError } from '../utils/serializeError';
import { invalidIdMsg } from '../utils/validateId';

export const validateParamsId = (
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
