import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import {GetBalanceUseCase} from "../../useCases/getBalance/GetBalanceUseCase";
import { GetBalanceError } from "./GetBalanceError";

let userRepository : InMemoryUsersRepository;
let statementRepository : InMemoryStatementsRepository;
let getBalanceUseCase : GetBalanceUseCase;

describe("Get balance Use Case", () =>{

  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    statementRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(statementRepository, userRepository);
  });

  it("should to be able to get balance of the user account", async () => {
      const user = await userRepository.create({name:"test_name",
                                                email:"testeEmail@email.com",
                                                password:"123456"
                                              });

      await statementRepository.create({user_id : user.id as string,
                                        type  : OperationType.DEPOSIT,
                                        amount:100,
                                        description : "statement deposit test"});


      const balance = await getBalanceUseCase.execute({user_id : user.id as string});

      expect(balance).toBeDefined();
      expect(balance.statement.length).toBe(1);
      expect(balance.balance).toBe(100);

   });

   it("Should not to be able to get balence with user id invalid", async() =>{

     expect(async() =>{

      await userRepository.create({name:"test_name",
                                   email:"testeEmail@email.com",
                                   password:"123456"
                                  });

      await getBalanceUseCase.execute({user_id : "wrongid"});

     }).rejects.toBeInstanceOf(GetBalanceError);

   });

});
