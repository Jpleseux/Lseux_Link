import { FindUserByEmailUsecase } from "@modules/profile/core/usecases/finUserByEmail.usecase";
import { ProfileRepositoryTypeOrm } from "@modules/profile/infra/repository/profileRepository.TypeOrm";
import dataSource from "@modules/shared/infra/database/datasource";
let repo: ProfileRepositoryTypeOrm;

describe("Deve testar o FindUserByEmailUsecase", () => {
  beforeAll(async () => {
    await dataSource.initialize();
    repo = new ProfileRepositoryTypeOrm(dataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
  });
  test("Deve buscar um usuario pelo seu email", async () => {
    const action = new FindUserByEmailUsecase(repo);
    const user = await action.execute("user1@gmail.com");
    expect(user.userName()).toBe("user1");
  });
});
