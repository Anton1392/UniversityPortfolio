package se.liu.ida.tdp024.account.data.test.facade;

import org.junit.After;
import org.junit.Before;
import org.junit.Assert;
import org.junit.Test;
import se.liu.ida.tdp024.account.data.impl.db.entity.AccountDB;
import se.liu.ida.tdp024.account.data.impl.db.entity.TransactionDB;

public class TransactionEntityTest {

    //---- Unit under test ----//
    private TransactionDB trans = new TransactionDB();

    @Test
    public void testID() {
      trans.setId(9);
      Assert.assertEquals(9, trans.getId());
    }

    @Test
    public void testType() {
      trans.setType("DEBIT");
      Assert.assertEquals("DEBIT", trans.getType());
    }

    @Test
    public void testAmount() {
      trans.setAmount(6969);
      Assert.assertEquals(6969, trans.getAmount());
    }

    @Test
    public void testCreated() {
      trans.setCreated("2019-09-27 14:10");
      Assert.assertEquals("2019-09-27 14:10", trans.getCreated());
    }

    @Test
    public void testStatus() {
      trans.setStatus("OK");
      Assert.assertEquals("OK", trans.getStatus());
    }

    @Test
    public void testAccount() {
      AccountDB acc = new AccountDB();
      acc.setId(1337);
      trans.setAccount(acc);
      Assert.assertEquals(1337, trans.getAccount().getId());
    }
}
