import { App } from './app';

async function bootstrap() {
  const app = new App();
  await app.init();
  process.on('SIGINT', () => {
    app.shutdown();
  });
  process.on('SIGTERM', () => {
    app.shutdown();
  });
}

bootstrap();
