import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { App } from '../../app';
import { Container } from '../../shared/container';
import { orm } from '../../shared/db/orm';
import { generateToken } from '../../middlewares/auth';

describe('Integración API: Compras (Purchases)', () => {
  let appInstance: App;
  let validToken: string;

  // beforeAll se ejecuta UNA vez antes de todos los tests de este archivo
  beforeAll(async () => {
    // 1. Instanciamos tu contenedor y tu App igual que lo hace server.ts
    const container = new Container();
    appInstance = new App(container);

    // 2. Inicializamos la base de datos (pero NO llamamos a start() porque no queremos el .listen())
    await appInstance.initializeDatabase();

    // Generamos un token válido de prueba para pasarlo en el header
    validToken = generateToken(1, false);
  });


  it('Debería retornar Error si mandamos un body incorrecto', async () => {
    // Arrange
    const invalidPayload = { cantidad: 2 };

    // Act
    // LE PASAMOS appInstance.expressApp a supertest y le adjuntamos el header Authorization
    const response = await request(appInstance.expressApp)
      .post('/api/purchase')
      .set('Authorization', `Bearer ${validToken}`)
      .send(invalidPayload);

    // Assert
    expect(response.status).toBe(400); // Esto dependerá de cómo Zod o tú validen
  });

});

