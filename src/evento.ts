import crypto from 'node:crypto';

export class Evento {
  constructor(
    public id = crypto.randomUUID(),
    public nombre: string,
    public descripcion: string,
    public capacidad_total: number,
    public direccion: string,
    public fecha_hora: string,
    public edad_minima: number
  ) {}
}
