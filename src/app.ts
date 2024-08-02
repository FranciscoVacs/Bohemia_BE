import express, { NextFunction, Request, Response } from "express";
import { Event } from "./event/event.entity.js";
import { EventRespository } from "./event/event.repository.js";

const app = express();
app.use(express.json());

const repository = new EventRespository();

const events = [
  new Event(
    "Wos en el luna park",
    "Es Wos!!! en el luna park!!!!",
    5000,
    "catamarca 1540",
    "2023-05-19",
    18,
    "id-de-prueba-test-lorem_ipsum"
  ),
];

//app.use('/', (req, res) => {
//  res.send("Hola!!!");
//});

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

app.get("/api/events", (req, res) => {
  res.json({ data: repository.findAll() });
});

app.get("/api/events/:id", (req, res) => {
  const id = req.params.id;
  const event = repository.findOne({ id });
  if (!event) {
    return res.status(404).send({ message: "Event not found" });
  }
  res.json({ data: event });
});

app.put("/api/events/:id", sanitizeEventsInput, (req, res) => {
  req.body.sanitizedInput.id = req.params.id;

  const event = repository.update(req.body.sanitizedInput);

  if (!event) {
    return res.status(404).send({ message: "Event not found" });
  }

  return res.status(200).send({
    message: "Event updated successfully",
    data: event,
  });
});

app.patch("/api/events/:id", sanitizeEventsInput, (req, res) => {

  req.body.sanitizedInput.id = req.params.id;
  const event = repository.update(req.body.sanitizedInput);
  if (!event) {
    return res.status(404).send({ message: "Event not found" });
  }
  return res.status(200).send({
    message: "Event updated successfully",
    data: event,
  });
});

app.delete("/api/events/:id", (req, res) => {
  const id=req.params.id
  const event = repository.delete({id})

  if (!event) {
    res.status(404).send({ message: "Event not found" });
  } else {
    res.status(200).send({ message: "Event deleted successfully" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000/");
});

app.post("/api/events", sanitizeEventsInput, (req, res) => {
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
});

app.use((_, res) => {
  return res.status(404).send({ message: "Resource not found" });
});
