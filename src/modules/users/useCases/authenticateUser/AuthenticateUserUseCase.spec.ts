import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import {AuthenticateUserUseCase} from "../../useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";


let userRepository : InMemoryUsersRepository;
let createUserUseCase : CreateUserUseCase;
let authenticateUser : AuthenticateUserUseCase;

describe("Authenticate User Use Case", () => {

  beforeEach(() => {
     userRepository = new InMemoryUsersRepository();
     createUserUseCase = new CreateUserUseCase(userRepository);
     authenticateUser = new AuthenticateUserUseCase(userRepository);
  });

  it("Should to be able to authenticate an user", async () => {
    await createUserUseCase.execute({name:"test_name",
                                     email:"testeemail@email.com",
                                     password:"123456"});

    const infoUser = await authenticateUser.execute({
                                                     email:"testeemail@email.com",
                                                     password:"123456"
                                                    });

    expect(infoUser).toBeDefined();
    expect(infoUser).toHaveProperty("token");
    expect(infoUser.token).not.toBeUndefined();

  });

  it("Should not to be able to authenticate an user with the wrong email", async() =>{
    expect(async () => {
      await createUserUseCase.execute({name:"test_name",
                                       email:"testeemail@email.com",
                                       password:"123456"});

       await authenticateUser.execute({
                                       email:"wrongemail@email.com",
                                       password:"123456"
                                      });

    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);

  });

  it("Should not to be able to authenticate an user with the wrong password", async() =>{
    expect( async() => {
      await createUserUseCase.execute({name:"test_name",
                                       email:"testeemail@email.com",
                                       password:"123456"});

      await authenticateUser.execute({
                                      email:"testeemail@email.com",
                                      password:"wrongpassword"
                                    });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);

  });

});
