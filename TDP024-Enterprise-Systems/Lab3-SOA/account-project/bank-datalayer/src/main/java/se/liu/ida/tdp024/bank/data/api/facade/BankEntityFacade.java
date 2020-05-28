package se.liu.ida.tdp024.bank.data.api.facade;

import se.liu.ida.tdp024.bank.data.impl.db.entity.BankDB;
import java.util.List;

public interface BankEntityFacade {
    // Define methods (like a .h file in c++) to use in the implementation.
    // The implementation file is where the database interactions happen.

    List<BankDB> list();

    BankDB findByName(String name);
    BankDB findByKey(String key);

    // Creates sample people
    void setupDatabase();
}
