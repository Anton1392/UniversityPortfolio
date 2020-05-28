package se.liu.ida.tdp024.account.data.test.facade;

import org.junit.After;
import org.junit.Before;
import org.junit.Assert;
import org.junit.Test;
import se.liu.ida.tdp024.account.data.impl.db.entity.AccountDB;

public class AccountEntityTest {

    //---- Unit under test ----//
    private AccountDB account = new AccountDB();

    @Test
    public void testID() {
      account.setId(9);
      Assert.assertEquals(9, account.getId());
    }

    @Test
    public void testPersonKey() {
      account.setPersonKey("MY_PKEY");
      Assert.assertEquals("MY_PKEY", account.getPersonKey());
    }

    @Test
    public void testAccountType() {
      account.setAccountType("SAVINGS");
      Assert.assertEquals("SAVINGS", account.getAccountType());
    }

    @Test
    public void testBankKey() {
      account.setBankKey("MY_BKEY");
      Assert.assertEquals("MY_BKEY", account.getBankKey());
    }

    @Test
    public void testHoldings() {
      account.setHoldings(1337);
      Assert.assertEquals(1337, account.getHoldings());
    }

}
