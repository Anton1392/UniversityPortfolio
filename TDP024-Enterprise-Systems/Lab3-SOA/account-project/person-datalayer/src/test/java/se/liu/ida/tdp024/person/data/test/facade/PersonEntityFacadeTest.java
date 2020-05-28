package se.liu.ida.tdp024.person.data.test.facade;

import org.junit.After;
import org.junit.Before;
import org.junit.Assert;
import org.junit.Test;
import se.liu.ida.tdp024.person.data.impl.db.facade.PersonEntityFacadeDB;
import se.liu.ida.tdp024.person.data.impl.db.util.StorageFacadeDB;

public class PersonEntityFacadeTest {

    //---- Unit under test ----//
    private PersonEntityFacadeDB data = new PersonEntityFacadeDB();
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
      Assert.assertEquals("Q", data.findByKey("5").getName());
    }

    @Test
    public void testFindKeyNull() {
      Assert.assertEquals(null, data.findByKey("5123123"));
    }

    @Test
    public void testFindName() {
      Assert.assertEquals("Q", data.findByName("Q").get(0).getName());
    }

    @Test
    public void testFindNameEmpty() {
      Assert.assertTrue(data.findByName("Qasddas").isEmpty());
    }
}
