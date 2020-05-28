package se.liu.ida.tdp024.bank.logic.api.facade;

import se.liu.ida.tdp024.bank.data.impl.db.facade.BankEntityFacadeDB;
import se.liu.ida.tdp024.bank.data.impl.db.entity.BankDB;

import java.util.List;

public interface BankLogicFacade {

  List<BankDB> list();

  BankDB findByName(String name);

  BankDB findByKey(String key);

  void setupDatabase();
}
