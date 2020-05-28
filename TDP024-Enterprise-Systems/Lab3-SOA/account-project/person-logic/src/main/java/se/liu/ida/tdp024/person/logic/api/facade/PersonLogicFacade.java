package se.liu.ida.tdp024.person.logic.api.facade;

import se.liu.ida.tdp024.person.data.impl.db.facade.PersonEntityFacadeDB;
import se.liu.ida.tdp024.person.data.impl.db.entity.PersonDB;

import java.util.List;

public interface PersonLogicFacade {

  List<PersonDB> list();

  List<PersonDB> findByName(String name);

  PersonDB findByKey(String key);

  void setupDatabase();
}
