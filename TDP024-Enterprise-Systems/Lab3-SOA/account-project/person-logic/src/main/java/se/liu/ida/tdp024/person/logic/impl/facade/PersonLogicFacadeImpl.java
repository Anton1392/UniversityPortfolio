package se.liu.ida.tdp024.person.logic.impl.facade;

import se.liu.ida.tdp024.person.data.impl.db.facade.PersonEntityFacadeDB;
import se.liu.ida.tdp024.person.data.impl.db.entity.PersonDB;
import se.liu.ida.tdp024.person.logic.api.facade.PersonLogicFacade;

import java.util.List;

public class PersonLogicFacadeImpl implements PersonLogicFacade {

    private PersonEntityFacadeDB personEntityFacadeDB;

    public PersonLogicFacadeImpl(PersonEntityFacadeDB personEntityFacadeDB) {
        this.personEntityFacadeDB = personEntityFacadeDB;
    }

    @Override
    public List<PersonDB> list()
    {
      return personEntityFacadeDB.list();
    }

    @Override
    public List<PersonDB> findByName(String name)
    {
      return personEntityFacadeDB.findByName(name);
    }

    @Override
    public PersonDB findByKey(String key)
    {
      return personEntityFacadeDB.findByKey(key);
    }

    @Override
    public void setupDatabase()
    {
      personEntityFacadeDB.setupDatabase();
    }
}
