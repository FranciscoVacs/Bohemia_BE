import express, { NextFunction, Request, Response } from "express";
import { Evento } from "./evento.js";

const app = express();
app.use(express.json());

const eventos = [
  new Evento(
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

function sanitizeEventosInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    capacidad_total: req.body.capacidad_total,
    direccion: req.body.direccion,
    fecha_hora: req.body.fecha_hora,
    edad_minima: req.body.edad_minima,
  };
  //more checks here

  next();
}

app.get("/api/eventos", (req, res) => {
  res.json({ data: eventos });
});

app.get("/api/eventos/:id", (req, res) => {
  const evento = eventos.find((evento) => evento.id === req.params.id);
  if (!evento) {
    res.status(404).send({ message: "Evento no encontrado" });
  }
  res.json({ data: evento });
});

app.put("/api/eventos/:id", sanitizeEventosInput, (req, res) => {
  const eventoIdx = eventos.findIndex((evento) => evento.id == req.params.id);

  if (eventoIdx === -1) {
    res.status(404).send({ message: "Evento no encontrado" });
  }

  eventos[eventoIdx] = { ...eventos[eventoIdx], ...req.body.sanitizedInput };

  res.status(200).send({
    message: "Character updated successfully",
    data: eventos[eventoIdx],
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000/");
});

app.post("/api/eventos", sanitizeEventosInput, (req, res) => {
  const input = req.body.sanitizedInput;
  
  const evento = new Evento(
    input.nombre,
    input.descripcion,
    input.capacidad_total,
    input.direccion,
    input.fecha_hora,
    input.edad_minima
  );

  eventos.push(evento);
  res.status(201).send({ message: "Evento creado", data: evento });
});
