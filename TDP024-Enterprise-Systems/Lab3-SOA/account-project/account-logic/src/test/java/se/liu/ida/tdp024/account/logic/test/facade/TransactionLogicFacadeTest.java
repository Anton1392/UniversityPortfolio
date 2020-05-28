package se.liu.ida.tdp024.account.logic.test.facade;

import org.junit.After;
import org.junit.Before;
import org.junit.Assert;
import org.junit.Test;
import se.liu.ida.tdp024.account.data.api.util.StorageFacade;

import se.liu.ida.tdp024.account.logic.impl.facade.TransactionLogicFacadeImpl;
import se.liu.ida.tdp024.account.data.impl.db.facade.TransactionEntityFacadeDB;

import se.liu.ida.tdp024.account.logic.impl.facade.AccountLogicFacadeImpl;
import se.liu.ida.tdp024.account.data.impl.db.facade.AccountEntityFacadeDB;

import se.liu.ida.tdp024.account.data.impl.db.entity.AccountDB;


public class TransactionLogicFacadeTest {
    //--- Unit under test ---//
    public TransactionLogicFacadeImpl logic = new TransactionLogicFacadeImpl(new TransactionEntityFacadeDB());

    // Help objects
    public AccountLogicFacadeImpl accounts = new AccountLogicFacadeImpl(new AccountEntityFacadeDB());

    public StorageFacade storageFacade;

    @After
    public void tearDown() {
      if (storageFacade != null)
        storageFacade.emptyStorage();
    }

    @Before
    public void setup()
    {
      logic.setupDatabase();
    }

    @Test
    public void testCreate()
    {
      accounts.create("SAVINGS", "1", "NORDEA");
      AccountDB acc = accounts.findByPersonKey("1").get(0);
      Assert.assertEquals("OK", logic.create("CREDIT", 123, "today", "OK", acc));
    }

    @Test
    public void testCreateBadType()
    {
      accounts.create("SAVINGS", "1", "NORDEA");
      AccountDB acc = accounts.findByPersonKey("1").get(0);
      Assert.assertEquals("FAILED", logic.create("BADTYPE", 123, "today", "OK", acc));
    }

    @Test
    public void testCreateBadStatus()
    {
      accounts.create("SAVINGS", "1", "NORDEA");
      AccountDB acc = accounts.findByPersonKey("1").get(0);
      Assert.assertEquals("FAILED", logic.create("CREDIT", 123, "today", "BADSTATUS", acc));
    }

    @Test
    public void testCreateBadAccount()
    {
      accounts.create("SAVINGS", "1", "NORDEA");
      AccountDB acc = accounts.findByPersonKey("1").get(0);
      acc.setId(6969);
      Assert.assertEquals("FAILED", logic.create("CREDIT", 123, "today", "OK", acc));
    }

    @Test
    public void testFindByAccount()
    {
      accounts.create("SAVINGS", "1", "NORDEA");
      AccountDB acc = accounts.findByPersonKey("1").get(0);
      logic.create("CREDIT", 123, "today", "OK", acc);
      Assert.assertFalse(logic.findByAccount(acc.getId()).isEmpty());
    }

    @Test
    public void testFindByAccountBadID()
    {
      Assert.assertTrue(logic.findByAccount(6969).isEmpty());
    }
}
