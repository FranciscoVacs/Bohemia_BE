import { App } from './app.js';
import { Container } from './shared/container.js';

/**
 * Punto de entrada de la aplicación
 * Responsabilidad: Solo bootstrapping - crear dependencias e iniciar la app
 */
async function bootstrap(): Promise<void> {
  try {
    // Crear el container de dependencias
    const container = new Container();
    
    // Crear e iniciar la aplicación
    const app = new App(container);
    await app.start();

  } catch (error) {
    console.error('💥 Failed to start application:', error);
    process.exit(1);
  }
}

// Iniciar la aplicación
bootstrap();
