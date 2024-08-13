import { Request, Response, NextFunction } from "express";

async function sanitizeEventsInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    name: req.body.name,
    description: req.body.description,
    total_capacity: req.body.total_capacity,
    direction: req.body.direction,
    date_time: req.body.date_time,
    min_age: req.body.min_age,
  };
  //more checks here
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });
  next();
}

async function findAll(req: Request, res: Response) {
  res.status(500).json({message: 'Not implemented'})
}

async function findOne(req: Request, res: Response) {
  res.status(500).json({message: 'Not implemented'})
}

async function add(req: Request, res: Response) {
  res.status(500).json({message: 'Not implemented'})

}

async function update(req: Request, res: Response) {
  res.status(500).json({message: 'Not implemented'})
}

async function remove(req: Request, res: Response) {
  res.status(500).json({message: 'Not implemented'})
}

export { sanitizeEventsInput, findAll, findOne, add, update, remove };
