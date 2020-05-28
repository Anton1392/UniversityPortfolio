package se.liu.ida.tdp024.bank.data.test.facade;

import org.junit.After;
import org.junit.Before;
import org.junit.Assert;
import org.junit.Test;
import se.liu.ida.tdp024.bank.data.impl.db.entity.BankDB;

public class BankEntityTest {

    //---- Unit under test ----//
    private BankDB bank = new BankDB();

    @Test
    public void testID() {
      bank.setId(9);
      Assert.assertEquals(9, bank.getId());
    }

    @Test
    public void testBankKey() {
      bank.setBankKey("MY_KEY");
      Assert.assertEquals("MY_KEY", bank.getBankKey());
    }

    @Test
    public void testName() {
      bank.setName("MY_NAME");
      Assert.assertEquals("MY_NAME", bank.getName());
    }
}
