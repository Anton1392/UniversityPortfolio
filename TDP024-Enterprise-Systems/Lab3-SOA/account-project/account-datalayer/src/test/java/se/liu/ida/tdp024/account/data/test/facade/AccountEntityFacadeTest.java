package se.liu.ida.tdp024.account.data.test.facade;

import org.junit.After;
import org.junit.Before;
import org.junit.Assert;
import org.junit.Test;
import se.liu.ida.tdp024.account.data.impl.db.facade.AccountEntityFacadeDB;
import se.liu.ida.tdp024.account.data.impl.db.util.StorageFacadeDB;

public class AccountEntityFacadeTest {

    //---- Unit under test ----//
    private AccountEntityFacadeDB data = new AccountEntityFacadeDB();
    private StorageFacadeDB storageFacade = new StorageFacadeDB();

    @After
    public void tearDown() {
       storageFacade.emptyStorage();
    }

    @Before
    public void setup()
    {
        data.setupDatabase();
    }

    @Test
    public void testCreate()
    {
      data.create("SAVINGS", "MY_PKEY", "MY_BKEY");
      Assert.assertEquals("MY_BKEY", data.findByPersonKey("MY_PKEY").get(0).getBankKey());
    }

    @Test
    public void testFindById()
    {
      data.create("SAVINGS", "MY_PKEY", "MY_BKEY");
      int id = data.findByPersonKey("MY_PKEY").get(0).getId();
      Assert.assertEquals("MY_BKEY", data.findById(id).get(0).getBankKey());
    }

    @Test
    public void testDebit()
    {
      data.create("SAVINGS", "testDebit", "testDebit");
      int id = data.findByPersonKey("testDebit").get(0).getId();
      data.credit(id, 15);
      data.debit(id, 5);
      data.debit(id, 5);
      int newHoldings = data.findByPersonKey("testDebit").get(0).getHoldings();
      Assert.assertEquals(5, newHoldings);
    }

    @Test
    public void testDebitToomuch()
    {
      data.create("SAVINGS", "testDebit", "testDebit");
      int id = data.findByPersonKey("testDebit").get(0).getId();
      data.debit(id, 5);
      data.debit(id, 5);
      int newHoldings = data.findByPersonKey("testDebit").get(0).getHoldings();
      Assert.assertEquals(0, newHoldings);
    }

    @Test
    public void testCredit()
    {
      data.create("SAVINGS", "testCredit", "testCredit");
      int id = data.findByPersonKey("testCredit").get(0).getId();
      data.credit(id, 5);
      data.credit(id, 5);
      int newHoldings = data.findByPersonKey("testCredit").get(0).getHoldings();
      Assert.assertEquals(10, newHoldings);
    }
}
