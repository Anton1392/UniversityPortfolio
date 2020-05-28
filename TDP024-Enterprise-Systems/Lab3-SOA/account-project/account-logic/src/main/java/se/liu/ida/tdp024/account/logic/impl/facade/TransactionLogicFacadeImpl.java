package se.liu.ida.tdp024.account.logic.impl.facade;

import se.liu.ida.tdp024.account.data.impl.db.facade.TransactionEntityFacadeDB;
import se.liu.ida.tdp024.account.data.impl.db.entity.TransactionDB;
import se.liu.ida.tdp024.account.data.impl.db.entity.AccountDB;
import se.liu.ida.tdp024.account.logic.api.facade.TransactionLogicFacade;
import se.liu.ida.tdp024.account.util.http.HTTPHelperImpl;

import java.util.List;

public class TransactionLogicFacadeImpl implements TransactionLogicFacade {

    private TransactionEntityFacadeDB transactionEntityFacadeDB;

    public TransactionLogicFacadeImpl(TransactionEntityFacadeDB transactionEntityFacadeDB) {
        this.transactionEntityFacadeDB = transactionEntityFacadeDB;
    }

    @Override
    public String create(String type, int amount, String created, String status, AccountDB account)
    {
      // type = CREDIT or DEBIT
      if(!type.equals("CREDIT") && !type.equals("DEBIT"))
      {
        return "FAILED";
      }
      // status FAILED or OK
      if(!status.equals("FAILED") && !status.equals("OK"))
      {
        return "FAILED";
      }

      return transactionEntityFacadeDB.create(type, amount, created, status, account, null);
    }

    @Override
    public List<TransactionDB> findByAccount(int id)
    {
      return transactionEntityFacadeDB.findByAccount(id);
    }

    @Override
    public void setupDatabase()
    {
      transactionEntityFacadeDB.setupDatabase();
    }
}
