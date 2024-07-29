import {FastifyInstance} from 'fastify';
import Pg from '../../../infra/repository/db/pg';
import {GetDashboardData} from '../../../app/query/get-dashboard-data';

export const dashboardRoute = async (app: FastifyInstance, pg: Pg) => {
  app.get('/dashboard', async (request, reply) => {
    const getDashboardData = new GetDashboardData(pg);
    return await getDashboardData.execute();
  });
};
