import express from 'express';
import { Evento } from './evento.js';

const app = express();
app.use(express.json());

const eventos = [
  new Evento(
    'Wos en el luna park',
    'Es Wos!!! en el luna park!!!!',
    5000,
    'catamarca 1540',
    '2023-05-19',
    18,
    'id-de-prueba-test-lorem_ipsum'
  ),
];

//app.use('/', (req, res) => {
//  res.send("Hola!!!");
//});

app.get('/api/eventos', (req, res) => {
  res.json({ data: eventos });
});

app.get('/api/eventos/:id', (req, res) => {
  const evento = eventos.find((evento) => evento.id === req.params.id);
  if (!evento) {
    res.status(404).send({ message: 'Evento no encontrado' });
  }
  res.json({ data: evento });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000/');
});

app.post('/api/eventos', (req, res) => {
  const {
    nombre,
    descripcion,
    capacidad_total,
    direccion,
    fecha_hora,
    edad_minima,
  } = req.body;

  const evento = new Evento(
    nombre,
    descripcion,
    capacidad_total,
    direccion,
    fecha_hora,
    edad_minima
  );

  eventos.push(evento);
  res.status(201).send({ message: 'Evento creado', data: evento });
});
