package se.liu.ida.tdp024.account.logic.impl.facade;

import se.liu.ida.tdp024.account.data.impl.db.facade.AccountEntityFacadeDB;
import se.liu.ida.tdp024.account.data.impl.db.entity.AccountDB;
import se.liu.ida.tdp024.account.data.impl.db.entity.PersonDB;
import se.liu.ida.tdp024.account.data.impl.db.entity.BankDB;
import se.liu.ida.tdp024.account.logic.api.facade.AccountLogicFacade;
import se.liu.ida.tdp024.account.logic.impl.facade.TransactionLogicFacadeImpl;
import se.liu.ida.tdp024.account.util.http.HTTPHelperImpl;
import se.liu.ida.tdp024.account.util.json.AccountJsonSerializerImpl;

import java.util.List;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Calendar;

public class AccountLogicFacadeImpl implements AccountLogicFacade {

    private AccountEntityFacadeDB accountEntityFacadeDB;

    public AccountLogicFacadeImpl(AccountEntityFacadeDB accountEntityFacadeDB) {
        this.accountEntityFacadeDB = accountEntityFacadeDB;
    }

    @Override
    public String create(String type, String personKey, String bankName)
    {
      if(!type.equals("SAVINGS") && !type.equals("CHECK"))
      {
        return "FAILED";
      }
      // Check if person exists
      HTTPHelperImpl http = new HTTPHelperImpl();
      String data = http.get("http://localhost:8060/person/find.key", "key", personKey);
      if(data == null || data.isEmpty())
      {
        return "FAILED";
      }
      // Check if bank exists
      data = http.get("http://localhost:8070/bank/find.name", "name", bankName);
      if(data == null || data.isEmpty())
      {
        return "FAILED";
      }
      AccountJsonSerializerImpl serializer = new AccountJsonSerializerImpl();
      BankDB bank = serializer.fromJson(data, BankDB.class);
      // Create
      return accountEntityFacadeDB.create(type, personKey, bank.getBankKey());
    }

    @Override
    public List<AccountDB> findByPersonKey(String key)
    {
      return accountEntityFacadeDB.findByPersonKey(key);
    }

    @Override
    public List<AccountDB> findById(int id)
    {
      return accountEntityFacadeDB.findById(id);
    }

    @Override
    public String debit(int id, int amount)
    {
      return accountEntityFacadeDB.debit(id, amount);
    }

    @Override
    public String credit(int id, int amount)
    {
      return accountEntityFacadeDB.credit(id, amount);
    }

    @Override
    public void setupDatabase()
    {
      accountEntityFacadeDB.setupDatabase();
    }
}
