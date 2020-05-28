package se.liu.ida.tdp024.account.data.api.facade;

import se.liu.ida.tdp024.account.data.impl.db.entity.AccountDB;
import java.util.List;

public interface AccountEntityFacade {
    // Define methods (like a .h file in c++) to use in the implementation.
    // The implementation file is where the database interactions happen.

    String create(String type, String personKey, String bankKey);

    List<AccountDB> findByPersonKey(String key);
    List<AccountDB> findById(int id);

    String debit(int id, int amount);
    String credit(int id, int amount);

    // Creates sample accounts
    void setupDatabase();
}
