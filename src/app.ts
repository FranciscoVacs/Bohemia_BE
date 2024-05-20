import express from 'express';
import { Evento } from './evento.js';

const app = express();

const eventos = [
  new Evento(
    'id-de-prueba-test-lorem_ipsum',
    'Wos en el luna park',
    'Es Wos!!! en el luna park!!!!',
    5000,
    'catamarca 1540',
    '2023-05-20T15:30:00',
    18
  ),
];

//app.use('/', (req, res) => {
//  res.send("Hola!!!");
//});

app.get('/api/eventos', (req, res) => {
  res.json(eventos);
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000/');
});
