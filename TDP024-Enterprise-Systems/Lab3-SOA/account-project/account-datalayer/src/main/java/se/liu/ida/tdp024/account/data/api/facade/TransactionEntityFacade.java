package se.liu.ida.tdp024.account.data.api.facade;

import se.liu.ida.tdp024.account.data.impl.db.entity.TransactionDB;
import se.liu.ida.tdp024.account.data.impl.db.entity.AccountDB;
import javax.persistence.EntityManager;
import java.util.List;

public interface TransactionEntityFacade {
    // Define methods (like a .h file in c++) to use in the implementation.
    // The implementation file is where the database interactions happen.
    String create(String type, int amount, String created, String status, AccountDB account, EntityManager em);

    List<TransactionDB> findByAccount(int id);

    // Creates sample accounts
    void setupDatabase();
}
