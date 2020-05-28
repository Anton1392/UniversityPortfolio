package se.liu.ida.tdp024.person.logic.test.facade;

import org.junit.After;
import org.junit.Before;
import org.junit.Assert;
import org.junit.Test;
import se.liu.ida.tdp024.person.data.api.util.StorageFacade;
import se.liu.ida.tdp024.person.logic.impl.facade.PersonLogicFacadeImpl;
import se.liu.ida.tdp024.person.data.impl.db.facade.PersonEntityFacadeDB;

public class PersonLogicFacadeTest {
    //--- Unit under test ---//
    public PersonLogicFacadeImpl logic = new PersonLogicFacadeImpl(new PersonEntityFacadeDB());
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
    public void testList() {
      Assert.assertFalse(logic.list().isEmpty());
    }

    @Test
    public void testFindKey() {
      Assert.assertEquals("Q", logic.findByKey("5").getName());
    }

    @Test
    public void testFindKeyNull() {
      Assert.assertEquals(null, logic.findByKey("5123123"));
    }

    @Test
    public void testFindName() {
      Assert.assertEquals("Q", logic.findByName("Q").get(0).getName());
    }

    @Test
    public void testFindNameEmpty() {
      Assert.assertTrue(logic.findByName("Qasddas").isEmpty());
    }
}
