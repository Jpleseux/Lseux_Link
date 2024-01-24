require("dotenv").config();
import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import { SeederOptions } from "typeorm-extension";
import { join } from "path";
import { MainSeeder } from "./main.seeder";
const options: DataSourceOptions & SeederOptions = {
  type: process.env.DB_DEFAULT_DRIVER as any,
  host: process.env.DB_DEFAULT_HOST,
  port: process.env.DB_DEFAULT_PORT as any,
  database: process.env.DB_DEFAULT_NAME,
  username: process.env.DB_DEFAULT_USENAME,
  schema: process.env.DB_DEFAULT_SCHEMA ?? "public",
  password: process.env.DB_DEFAULT_PASSWORD,
  synchronize: false,
  entities: [join(process.cwd(), "/src/**/*.model.{ts,js}")],
  logging: false,
  seeds: [MainSeeder],
  migrations: [join(process.cwd(), "/src/**/*.migration.{ts,js}")],
};

const dataSource = new DataSource(options);

export default dataSource;
