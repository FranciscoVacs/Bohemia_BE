import { Request, Response, NextFunction } from "express";
import { EventRepository } from "./event.repository.js";
import { Event } from "./event.entity.js";

const repository = new EventRepository();

function sanitizeEventsInput(req: Request, res: Response, next: NextFunction) {
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

function findAll(req: Request, res: Response) {
  res.json({ data: repository.findAll() });
}

function findOne(req: Request, res: Response) {
  const id = req.params.id;
  const event = repository.findOne({ id });
  if (!event) {
    return res.status(404).send({ message: "Event not found" });
  }
  res.json({ data: event });
}

function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput;

  const eventInput = new Event(
    input.name,
    input.description,
    input.total_capacity,
    input.direction,
    input.date_time,
    input.min_age
  );

  const event = repository.add(eventInput);
  return res.status(201).send({ message: "Event created", data: event });
}

function update(req: Request, res: Response) {
  req.body.sanitizedInput.id = req.params.id;
  const event = repository.update(req.body.sanitizedInput);
  if (!event) {
    return res.status(404).send({ message: "Event not found" });
  }
  return res.status(200).send({
    message: "Event updated successfully",
    data: event,
  });
}

function remove(req: Request, res: Response) {
  const id = req.params.id;
  const event = repository.delete({ id });

  if (!event) {
    res.status(404).send({ message: "Event not found" });
  } else {
    res.status(200).send({ message: "Event deleted successfully" });
  }
}

export { sanitizeEventsInput, findAll, findOne, add, update, remove };
