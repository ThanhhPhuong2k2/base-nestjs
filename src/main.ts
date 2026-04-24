import Server from './server';

async function bootstrap() {
  const server = new Server();

  try {
    await server.setup();
    await server.start();
  } catch (error) {
    await server.stop();
  }
}
bootstrap();
