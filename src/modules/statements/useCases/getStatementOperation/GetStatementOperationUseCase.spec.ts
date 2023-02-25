import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationUseCase } from "../../useCases/getStatementOperation/GetStatementOperationUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";

let userRepository : InMemoryUsersRepository;
let statementRepository : InMemoryStatementsRepository;
let getStatementOperationUseCase : GetStatementOperationUseCase;

describe("Get Statement Operation Use Case", () => {

   beforeEach(() => {
     userRepository = new InMemoryUsersRepository();
     statementRepository = new InMemoryStatementsRepository();
     getStatementOperationUseCase = new GetStatementOperationUseCase(userRepository, statementRepository);
   });


  it("Should to be able to get Statement Operation of the user", async () => {
    const user = await userRepository.create({name:"test_name",
                                              email:"testeEmail@email.com",
                                              password:"123456"
                                            });

    const statement = await statementRepository.create({user_id : user.id as string,
                                                        type  : OperationType.DEPOSIT,
                                                        amount:100,
                                                        description : "statement deposit test"});

    const getStatement = await getStatementOperationUseCase.execute({user_id : user.id as string, statement_id: statement.id as string});


    expect(getStatement).toBeDefined();
    expect(getStatement.user_id).toBe(user.id);
    expect(getStatement.id).toBe(statement.id);
    expect(getStatement.amount).toBe(100);

  });

  it("Should not to be able to get Statement Operation with an invalid user Id", async () => {
    expect(async () => {
      const user = await userRepository.create({name:"test_name",
                                                email:"testeEmail@email.com",
                                                password:"123456"
                                                });

      const statement = await statementRepository.create({user_id : user.id as string,
                                        type  : OperationType.DEPOSIT,
                                        amount:100,
                                        description : "statement deposit test"});

     await getStatementOperationUseCase.execute({user_id : "wrongid", statement_id: statement.id as string});
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });


  it("Should not to be able to get Statement Operation with an invalid statement Id", async () => {
    expect(async () => {
      const user = await userRepository.create({name:"test_name",
                                                email:"testeEmail@email.com",
                                                password:"123456"
                                                });

      const statement = await statementRepository.create({user_id : user.id as string,
                                                          type  : OperationType.DEPOSIT,
                                                          amount:100,
                                                          description : "statement deposit test"});

     await getStatementOperationUseCase.execute({user_id : user.id as string, statement_id: "wrongid"});
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });

});
