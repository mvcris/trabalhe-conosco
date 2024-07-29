import {Pool, PoolClient} from 'pg';

export default class Pg {
  private pool: Pool;
  private client: PoolClient;

  constructor() {
    this.pool = new Pool({
      host: process.env.PG_HOST,
      port: parseInt(process.env.PG_PORT as string) || 5432,
      database: process.env.PG_DATABASE,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
    });
  }

  async connect() {
    this.client = await this.pool.connect();
  }

  async disconnect() {
    this.client?.release();
    await this.pool.end();
  }

  async query(sql: string, params: any[] = []) {
    const result = await this.client.query(sql, params);
    return result;
  }
}
