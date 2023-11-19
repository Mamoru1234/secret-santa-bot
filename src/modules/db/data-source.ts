import { DataSource } from 'typeorm';
import { join } from 'path';
import { entities } from './entities';
import { cleanEnv, str } from 'envalid';

const env = cleanEnv(process.env, {
  APP_DB_PASSWORD: str(),
  APP_DB_USERNAME: str(),
  APP_DB_HOST: str({
    devDefault: 'localhost',
  }),
});

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.APP_DB_HOST,
  port: 5432,
  username: env.APP_DB_USERNAME,
  password: env.APP_DB_PASSWORD,
  entities,
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
  migrationsTableName: 'migrations',
});
