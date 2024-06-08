import * as bcrypt from "bcryptjs";
import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { UserModel } from "../models/UserModel.model";
export class UserSeeder implements Seeder {
  async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const repo = dataSource.getRepository(UserModel);
    await repo.createQueryBuilder("users").delete().execute();
    const password = await bcrypt.hash("123456", 10);
    const users: UserModel[] = [
      {
        uuid: "d0027811-4f76-4cf2-a24b-bc99ad777950",
        email: "user1@gmail.com",
        password: password,
        userName: "user1",
        phone_number: "89 999312231",
        avatar: "profile/carlo.jpg",
        is_verify: true,
      },
      {
        uuid: "e3034bba-ff39-4e38-ba59-a77dd913f5c2",
        email: "user2@gmail.com",
        password: password,
        userName: "user2",
        phone_number: "99 999312231",
        avatar: "profile/fatima-001b.jpg",
      },
    ];
    await repo.insert(users);
  }
}
