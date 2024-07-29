import 'dotenv/config';
import Fastify from 'fastify';
import {serializerCompiler, validatorCompiler} from 'fastify-type-provider-zod';
import {farmOwnerRoutes} from './routes/farm-owner';
import Pg from '../../infra/repository/db/pg';
import PgRepositoryFactory from '../../infra/factory/PgRepositoryFactory';
import {plantedCropRoutes} from './routes/planted-crop';
import {dashboardRoute} from './routes/dashboard';

const app = Fastify();
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

const pg = new Pg();
const pgRepositoryFactory = new PgRepositoryFactory(pg);
farmOwnerRoutes(app, pgRepositoryFactory);
plantedCropRoutes(app, pgRepositoryFactory);
dashboardRoute(app, pg);

app.get('/health', async () => {
  return {status: 'ok'};
});

const start = async () => {
  try {
    await app.ready();
    await pg.connect();
    await app.listen({port: 3000});
  } catch (err) {
    console.error(err);
    pg.disconnect();
    app.log.error(err);
    // eslint-disable-next-line n/no-process-exit
    process.exit(1);
  }
};

start();
