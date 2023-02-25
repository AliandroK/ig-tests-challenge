import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import {CreateStatementUseCase} from "../../useCases/createStatement/CreateStatementUseCase";
import {OperationType} from "../../entities/Statement";
import { CreateStatementError } from "../../useCases/createStatement/CreateStatementError"


let userRepository : InMemoryUsersRepository;
let statementRepository : InMemoryStatementsRepository;
let createStatementUseCase : CreateStatementUseCase;

describe("Create Statement Use Case", () => {

  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();
    statementRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(userRepository, statementRepository);

  });

  it("Should to be able to create a new Deposit Statement", async () => {
    const user = await userRepository.create({name:"test_name",
                                              email:"testeEmail@email.com",
                                              password:"123456"
                                            });


    const statement =  await createStatementUseCase.execute({user_id : user.id as string,
                                                             type  : OperationType.DEPOSIT,
                                                             amount:100,
                                                             description : "statement deposit test"
                                                            });

    expect(statement).toBeDefined();
    expect(statement).toHaveProperty("id");
    expect(statement.type).toBe(OperationType.DEPOSIT);
  });

  it("Should to be able to create a new Withdraw Statement", async () => {
    const user = await userRepository.create({name:"test_name",
                                              email:"testeEmail@email.com",
                                              password:"123456"
                                            });

    await createStatementUseCase.execute({user_id : user.id as string,
                                          type  : OperationType.DEPOSIT,
                                          amount:100,
                                          description : "statement deposit test"
                                        });


    const statement =  await createStatementUseCase.execute({user_id : user.id as string,
                                                             type  : OperationType.WITHDRAW,
                                                             amount:50,
                                                             description : "statement withdraw test"
                                                            });

    expect(statement).toBeDefined();
    expect(statement).toHaveProperty("id");
    expect(statement.type).toBe(OperationType.WITHDRAW);
  });

  it("Should not to be able to create a new Statement with an invalid user Id", async () => {

    expect(async () => {
        await userRepository.create({name:"test_name",
                                     email:"testeEmail@email.com",
                                     password:"123456"
                                    });

        await createStatementUseCase.execute({user_id : "wrongID",
                                              type  : OperationType.DEPOSIT,
                                              amount:100,
                                              description : "statement deposit test"
                                              });
                                            }
         ).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
   });

   it("Should not to be able to create a new Withdraw Statement with Insufficient Funds", async () => {

    expect(async () => {
        const user = await userRepository.create({name:"test_name",
                                                  email:"testeEmail@email.com",
                                                  password:"123456"
                                                 });

        await createStatementUseCase.execute({user_id : user.id as string,
                                              type  : OperationType.WITHDRAW,
                                              amount:50,
                                              description : "statement withdraw test"
                                            });

     }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
   });


});
