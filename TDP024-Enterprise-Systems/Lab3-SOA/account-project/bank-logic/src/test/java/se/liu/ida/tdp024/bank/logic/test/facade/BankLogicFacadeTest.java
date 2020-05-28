package se.liu.ida.tdp024.bank.logic.test.facade;

import org.junit.After;
import org.junit.Before;
import org.junit.Assert;
import org.junit.Test;
import se.liu.ida.tdp024.bank.data.api.util.StorageFacade;
import se.liu.ida.tdp024.bank.logic.impl.facade.BankLogicFacadeImpl;
import se.liu.ida.tdp024.bank.data.impl.db.facade.BankEntityFacadeDB;

public class BankLogicFacadeTest {
    //--- Unit under test ---//
    public BankLogicFacadeImpl logic = new BankLogicFacadeImpl(new BankEntityFacadeDB());
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
    public void testFind() {
      Assert.assertFalse(logic.list().isEmpty());
    }

    @Test
    public void testFindKey() {
      Assert.assertEquals("SWEDBANK", logic.findByKey("1").getName());
    }

    @Test
    public void testFindKeyNull() {
      Assert.assertEquals(null, logic.findByKey("5123123"));
    }

    @Test
    public void testFindName() {
      Assert.assertEquals("SWEDBANK", logic.findByName("SWEDBANK").getName());
    }

    @Test
    public void testFindNameNull() {
      Assert.assertEquals(null, logic.findByName("Qasddas"));
    }
}
