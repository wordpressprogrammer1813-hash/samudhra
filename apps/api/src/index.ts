import { createApp } from './app.js';
import { env } from './env.js';
import { logger } from './logger.js';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`samudra-api listening on http://localhost:${env.PORT}/api (${env.NODE_ENV})`);
});

function shutdown(signal: string): void {
  logger.info(`${signal} received, closing server`);
  server.close((err) => {
    if (err) {
      logger.error({ err }, 'error while closing server');
      process.exit(1);
    }
    process.exit(0);
  });
  // Do not hang forever on a stuck connection.
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('unhandledRejection', (reason) => {
  logger.error({ reason }, 'unhandled promise rejection');
});
process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'uncaught exception, exiting');
  process.exit(1);
});
