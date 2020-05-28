package se.liu.ida.tdp024.bank.logic.impl.facade;

import se.liu.ida.tdp024.bank.data.impl.db.facade.BankEntityFacadeDB;
import se.liu.ida.tdp024.bank.data.impl.db.entity.BankDB;
import se.liu.ida.tdp024.bank.logic.api.facade.BankLogicFacade;

import java.util.List;

public class BankLogicFacadeImpl implements BankLogicFacade {

    private BankEntityFacadeDB bankEntityFacadeDB;

    public BankLogicFacadeImpl(BankEntityFacadeDB bankEntityFacadeDB) {
        this.bankEntityFacadeDB = bankEntityFacadeDB;
    }

    @Override
    public List<BankDB> list()
    {
      return bankEntityFacadeDB.list();
    }

    @Override
    public BankDB findByName(String name)
    {
      return bankEntityFacadeDB.findByName(name);
    }

    @Override
    public BankDB findByKey(String key)
    {
      return bankEntityFacadeDB.findByKey(key);
    }

    @Override
    public void setupDatabase()
    {
      bankEntityFacadeDB.setupDatabase();
    }
}
