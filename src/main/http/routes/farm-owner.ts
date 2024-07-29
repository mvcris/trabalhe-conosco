import {FastifyInstance} from 'fastify';
import {ZodTypeProvider} from 'fastify-type-provider-zod';
import {z} from 'zod';
import CreateFarmOwner from '../../../app/usecase/create-farm-owner';
import UpdateFarmOwner from '../../../app/usecase/update-farm-owner';
import {DeleteFarmOwner} from '../../../app/usecase/delete-farm-owner';
import PgRepositoryFactory from '../../../infra/factory/PgRepositoryFactory';
import GetFarmOwner from '../../../app/query/get-farm-owner';
import GetAllFarmOwner from '../../../app/query/get-all-farm-owner';

export const farmOwnerRoutes = (
  app: FastifyInstance,
  pgRepositoryFactory: PgRepositoryFactory
) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/farm-owner', async (request, reply) => {
      const useCase = new GetAllFarmOwner(pgRepositoryFactory.getPg());
      const result = await useCase.execute();
      return reply.status(200).send(result);
    });
  app.withTypeProvider<ZodTypeProvider>().get(
    '/farm-owner/:id',
    {
      schema: {
        params: z.object({
          id: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const useCase = new GetFarmOwner(pgRepositoryFactory.getPg());
      const result = await useCase.execute(request.params.id);
      return reply.status(200).send(result);
    }
  );
  app.withTypeProvider<ZodTypeProvider>().route({
    method: 'POST',
    url: '/farm-owner',
    schema: {
      body: z.object({
        name: z.string(),
        registerNumber: z.string(),
        farm: z.object({
          name: z.string(),
          totalFarmAreaHectares: z.number(),
          arableAreaHectares: z.number(),
          vegetationAreaHectares: z.number(),
        }),
        address: z.object({
          city: z.string(),
          state: z.string(),
        }),
      }),
    },
    async handler(request, reply) {
      const useCase = new CreateFarmOwner(
        pgRepositoryFactory.createFarmOwnerRepository()
      );
      const output = await useCase.execute(request.body);
      return reply.status(201).send(output);
    },
  });

  app.withTypeProvider<ZodTypeProvider>().patch(
    '/farm-owner/:id',
    {
      schema: {
        body: z.object({
          name: z.string().optional(),
          registerNumber: z.string().optional(),
          farm: z
            .object({
              name: z.string().optional(),
              totalFarmAreaHectares: z.number(),
              arableAreaHectares: z.number(),
              vegetationAreaHectares: z.number(),
            })
            .optional(),
          address: z
            .object({
              city: z.string(),
              state: z.string(),
            })
            .optional(),
        }),
        params: z.object({
          id: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const useCase = new UpdateFarmOwner(
        pgRepositoryFactory.createFarmOwnerRepository(),
        pgRepositoryFactory.createPantedCropRepository()
      );
      const output = await useCase.execute({
        id: request.params.id,
        ...request.body,
      });
      return reply.status(204).send(output);
    }
  );
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/farm-owner/:id',
    {
      schema: {
        params: z.object({
          id: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const useCase = new DeleteFarmOwner(
        pgRepositoryFactory.createFarmOwnerRepository()
      );
      const output = await useCase.execute(request.params.id);
      return reply.status(204).send(output);
    }
  );
};
