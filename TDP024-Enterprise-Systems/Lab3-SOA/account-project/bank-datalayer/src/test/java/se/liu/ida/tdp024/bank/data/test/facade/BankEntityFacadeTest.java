package se.liu.ida.tdp024.bank.data.test.facade;

import org.junit.After;
import org.junit.Before;
import org.junit.Assert;
import org.junit.Test;
import se.liu.ida.tdp024.bank.data.impl.db.facade.BankEntityFacadeDB;
import se.liu.ida.tdp024.bank.data.impl.db.util.StorageFacadeDB;

public class BankEntityFacadeTest {

    //---- Unit under test ----//
    private BankEntityFacadeDB data = new BankEntityFacadeDB();
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
    public void testList() {
      Assert.assertFalse(data.list().isEmpty());
    }

    @Test
    public void testFindKey() {
      Assert.assertEquals("SWEDBANK", data.findByKey("1").getName());
    }

    @Test
    public void testFindKeyNull() {
      Assert.assertEquals(null, data.findByKey("5123123"));
    }

    @Test
    public void testFindName() {
      Assert.assertEquals("SWEDBANK", data.findByName("SWEDBANK").getName());
    }

    @Test
    public void testFindNameNull() {
      Assert.assertEquals(null, data.findByName("Qasddas"));
    }

}
