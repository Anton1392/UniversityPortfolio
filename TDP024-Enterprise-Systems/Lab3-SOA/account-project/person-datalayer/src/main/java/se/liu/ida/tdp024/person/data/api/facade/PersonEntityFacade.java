package se.liu.ida.tdp024.person.data.api.facade;

import se.liu.ida.tdp024.person.data.impl.db.entity.PersonDB;
import java.util.List;

public interface PersonEntityFacade {
    // Define methods (like a .h file in c++) to use in the implementation.
    // The implementation file is where the database interactions happen.

    List<PersonDB> list();

    List<PersonDB> findByName(String name);
    PersonDB findByKey(String key);

    // Creates sample people
    void setupDatabase();
}
