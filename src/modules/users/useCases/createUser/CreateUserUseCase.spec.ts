import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";


let userRepository : InMemoryUsersRepository;
let createUserUseCase : CreateUserUseCase;

describe("Create User Use Case", () => {

  beforeEach(() =>{
     userRepository = new InMemoryUsersRepository();
     createUserUseCase = new CreateUserUseCase(userRepository);
  });

  it("Should to be able to create a new User", async () => {

    const user = await createUserUseCase.execute({name:"test_name",
                                                  email:"testeEmail@email.com",
                                                  password:"123456"
                                                });

    expect(user).toBeDefined();
    expect(user).toHaveProperty("id");
  });

  it("Should not to be able to create users with the same email", async () => {
    expect(async () => {
      await createUserUseCase.execute({name:"test_name",
                                       email:"testeEmail@email.com",
                                       password:"123456"
                                     });

      await createUserUseCase.execute({name:"test_name2",
                                       email:"testeEmail@email.com",
                                       password:"654321"
                                     });


    }).rejects.toBeInstanceOf(CreateUserError);

  });


});
