import type { Request, Response, NextFunction } from 'express';

export const parseFormData = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.min_age) {
    req.body.min_age = Number(req.body.min_age);
  }
  if (req.body.location) {
    req.body.location = Number(req.body.location);
  }
  next();
};