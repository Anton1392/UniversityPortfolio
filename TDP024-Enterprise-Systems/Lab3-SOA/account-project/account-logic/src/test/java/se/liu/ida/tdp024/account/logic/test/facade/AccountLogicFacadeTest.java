package se.liu.ida.tdp024.account.logic.test.facade;

import org.junit.After;
import org.junit.Before;
import org.junit.Assert;
import org.junit.Test;
import se.liu.ida.tdp024.account.data.api.util.StorageFacade;
import se.liu.ida.tdp024.account.logic.impl.facade.AccountLogicFacadeImpl;

import se.liu.ida.tdp024.account.logic.impl.facade.TransactionLogicFacadeImpl;
import se.liu.ida.tdp024.account.data.impl.db.facade.TransactionEntityFacadeDB;
import se.liu.ida.tdp024.account.data.impl.db.facade.AccountEntityFacadeDB;


public class AccountLogicFacadeTest {
    //--- Unit under test ---//
    public AccountLogicFacadeImpl logic = new AccountLogicFacadeImpl(new AccountEntityFacadeDB());

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
      Assert.assertEquals("OK", logic.create("SAVINGS", "1", "NORDEA"));
    }

    @Test
    public void testCreateBadType()
    {
      Assert.assertEquals("FAILED", logic.create("INVALID TYPE", "1", "NORDEA"));
    }

    @Test
    public void testCreateBadPerson()
    {
      Assert.assertEquals("FAILED", logic.create("SAVINGS", "123", "NORDEA"));
    }

    @Test
    public void testCreateBadBank()
    {
      Assert.assertEquals("FAILED", logic.create("SAVINGS", "1", "123"));
    }

    @Test
    public void testFindByPersonKey()
    {
      logic.create("SAVINGS", "2", "NORDEA");
      Assert.assertFalse(logic.findByPersonKey("2").isEmpty());
    }

    @Test
    public void testFindByPersonKeyBadKey()
    {
      Assert.assertTrue(logic.findByPersonKey("ROBERT").isEmpty());
    }

    @Test
    public void testFindById()
    {
      logic.create("SAVINGS", "2", "NORDEA");
      int id = logic.findByPersonKey("2").get(0).getId();
      Assert.assertFalse(logic.findById(id).isEmpty());
    }

    @Test
    public void testFindByBadId()
    {
      Assert.assertTrue(logic.findById(1337).isEmpty());
    }

    @Test
    public void testDebit()
    {
      logic.create("SAVINGS", "3", "NORDEA");
      int id = logic.findByPersonKey("3").get(0).getId();
      logic.credit(id, 15);
      Assert.assertEquals("OK", logic.debit(id, 10));
    }

    @Test
    public void testDebitTooMuch()
    {
      logic.create("SAVINGS", "3", "NORDEA");
      int id = logic.findByPersonKey("3").get(0).getId();
      Assert.assertEquals("FAILED", logic.debit(id, 10));
    }

    @Test
    public void testDebitBadId()
    {
      Assert.assertEquals("FAILED", logic.debit(1337, 10));
    }

    @Test
    public void testCredit()
    {
      logic.create("SAVINGS", "4", "NORDEA");
      int id = logic.findByPersonKey("4").get(0).getId();
      Assert.assertEquals("OK", logic.credit(id, 10));
    }

    @Test
    public void testCreditBadId()
    {
      Assert.assertEquals("FAILED", logic.credit(1337, 10));
    }
}
