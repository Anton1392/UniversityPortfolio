package se.liu.ida.tdp024.account.data.test.facade;

import org.junit.After;
import org.junit.Before;
import org.junit.Assert;
import org.junit.Test;
import se.liu.ida.tdp024.account.data.impl.db.facade.TransactionEntityFacadeDB;
import se.liu.ida.tdp024.account.data.impl.db.facade.AccountEntityFacadeDB;
import se.liu.ida.tdp024.account.data.impl.db.entity.TransactionDB;
import se.liu.ida.tdp024.account.data.impl.db.entity.AccountDB;
import se.liu.ida.tdp024.account.data.impl.db.util.StorageFacadeDB;

public class TransactionEntityFacadeTest {

    //---- Unit under test ----//
    private TransactionEntityFacadeDB data = new TransactionEntityFacadeDB();
    private AccountEntityFacadeDB accData = new AccountEntityFacadeDB();
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
    public void testCreateAndFind()
    {
      accData.create("SAVINGS", "MY_PKEY", "MY_BKEY");
      AccountDB acc = accData.findByPersonKey("MY_PKEY").get(0);
      data.create("DEBIT", 200, "2019-09-27 14:17", "OK", acc, null);
      Assert.assertEquals("2019-09-27 14:17", data.findByAccount(acc.getId()).get(0).getCreated());
    }
}
