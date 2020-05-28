package se.liu.ida.tdp024.account.logic.api.facade;

import se.liu.ida.tdp024.account.data.impl.db.facade.TransactionEntityFacadeDB;
import se.liu.ida.tdp024.account.data.impl.db.entity.TransactionDB;
import se.liu.ida.tdp024.account.data.impl.db.entity.AccountDB;

import java.util.List;

public interface TransactionLogicFacade {

  String create(String type, int amount, String created, String status, AccountDB account);

  List<TransactionDB> findByAccount(int id);

  void setupDatabase();
}
