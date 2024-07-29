import request from 'supertest';
import Fastify from 'fastify';
import {dashboardRoute} from '../../../src/main/http/routes/dashboard';
import Pg from '../../../src/infra/repository/db/pg';

describe('Dashboard API', () => {
  let app;
  let pg;

  beforeAll(async () => {
    app = Fastify();
    pg = new Pg();
    await pg.connect();
    await dashboardRoute(app, pg);
    await app.ready();
  });

  afterAll(async () => {
    await pg.disconnect();
    await app.close();
  });

  it('should return dashboard data', async () => {
    const response = await request(app.server).get('/dashboard');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('totalFarms');
    expect(response.body).toHaveProperty('totalAreaHectares');
    // Adicione mais expectativas conforme necessário
  });
});
