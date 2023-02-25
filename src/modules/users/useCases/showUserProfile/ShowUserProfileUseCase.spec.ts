import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let userRepository : InMemoryUsersRepository;
let createUserUseCase : CreateUserUseCase;
let showUserProfileUseCase : ShowUserProfileUseCase;

describe("Show User Profile Use Case", () => {

  beforeEach(() =>{
                  userRepository = new InMemoryUsersRepository();
                  createUserUseCase = new CreateUserUseCase(userRepository);
                  showUserProfileUseCase = new ShowUserProfileUseCase(userRepository);
                 });


   it("Should to be able to show user profile", async () => {
     const user = await createUserUseCase.execute({name:"test_name",
                                                   email:"testeEmail@email.com",
                                                   password:"123456"});

     const userProfile = await showUserProfileUseCase.execute(user.id as string);

     expect(userProfile).toBeDefined();
     expect(userProfile.email).toBe("testeEmail@email.com");
   });

   it("Should not to be able to show user profile with the wrong user id", async () => {

    expect( async () => {
       const user = await createUserUseCase.execute({name:"test_name",
                                                    email:"testeEmail@email.com",
                                                    password:"123456"});

       await showUserProfileUseCase.execute("wrongid");

     }).rejects.toBeInstanceOf(ShowUserProfileError);

   });


});
