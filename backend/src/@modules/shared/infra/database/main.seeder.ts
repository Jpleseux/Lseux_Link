import { UserSeeder } from "../../../auth/infra/database/seeder/userSeeder.seeder";
import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager, runSeeder } from "typeorm-extension";
export class MainSeeder implements Seeder {
  async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
    await runSeeder(dataSource, UserSeeder);
  }
}
