package se.liu.ida.tdp024.person.data.test.facade;

import org.junit.After;
import org.junit.Before;
import org.junit.Assert;
import org.junit.Test;
import se.liu.ida.tdp024.person.data.impl.db.entity.PersonDB;

public class PersonEntityTest {

    //---- Unit under test ----//
    private PersonDB person = new PersonDB();

    @Test
    public void testID() {
      person.setId(9);
      Assert.assertEquals(9, person.getId());
    }

    @Test
    public void testName() {
      person.setName("Banton");
      Assert.assertEquals("Banton", person.getName());
    }

    @Test
    public void testPersonKey() {
      person.setPersonKey("HOT_DAMN_69");
      Assert.assertEquals("HOT_DAMN_69", person.getPersonKey());
    }
}
