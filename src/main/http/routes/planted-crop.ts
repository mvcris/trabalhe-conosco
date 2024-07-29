import {FastifyInstance} from 'fastify';
import {ZodTypeProvider} from 'fastify-type-provider-zod';
import {z} from 'zod';
import PgRepositoryFactory from '../../../infra/factory/PgRepositoryFactory';
import CreatePlantedCropArea from '../../../app/usecase/create-planted-crop-area';
import {DeletePlantedCropArea} from '../../../app/usecase/delete-planted-crop-area';
import GetPlantedCrop from '../../../app/query/get-planted-crop';
import GetAllPlantedCrop from '../../../app/query/get-all-planted-crop';

export const plantedCropRoutes = (
  app: FastifyInstance,
  pgRepositoryFactory: PgRepositoryFactory
) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/planted-crop', async (request, reply) => {
      const useCase = new GetAllPlantedCrop(pgRepositoryFactory.getPg());
      const result = await useCase.execute();
      return reply.status(200).send(result);
    });
  app.withTypeProvider<ZodTypeProvider>().get(
    '/planted-crop/:id',
    {
      schema: {
        params: z.object({
          id: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const useCase = new GetPlantedCrop(pgRepositoryFactory.getPg());
      const result = await useCase.execute(request.params.id);
      return reply.status(200).send(result);
    }
  );
  app.withTypeProvider<ZodTypeProvider>().post(
    '/planted-crop',
    {
      schema: {
        body: z.object({
          farmId: z.string().uuid(),
          cropName: z.string(),
          plantedAreaHectares: z.number(),
        }),
      },
    },
    async (request, reply) => {
      const useCase = new CreatePlantedCropArea(
        pgRepositoryFactory.createPantedCropRepository(),
        pgRepositoryFactory.createFarmOwnerRepository()
      );
      const output = await useCase.execute(request.body);
      return reply.status(201).send(output);
    }
  );
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/planted-crop/:id',
    {
      schema: {
        params: z.object({
          id: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const useCase = new DeletePlantedCropArea(
        pgRepositoryFactory.createPantedCropRepository()
      );
      const output = await useCase.execute(request.params.id);
      return reply.status(204).send(output);
    }
  );
};
