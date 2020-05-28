package se.liu.ida.tdp024.account.data.impl.db.facade;

import se.liu.ida.tdp024.account.data.api.facade.AccountEntityFacade;
import se.liu.ida.tdp024.account.data.impl.db.facade.TransactionEntityFacadeDB;
import se.liu.ida.tdp024.account.data.impl.db.entity.AccountDB;
import se.liu.ida.tdp024.account.data.impl.db.util.StorageFacadeDB;

import se.liu.ida.tdp024.account.data.impl.db.util.EMF;
import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.persistence.LockModeType;

import java.util.List;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Calendar;

public class AccountEntityFacadeDB implements AccountEntityFacade {

    private TransactionEntityFacadeDB transactionEntityFacadeDB;

    public AccountEntityFacadeDB()
    {
      this.transactionEntityFacadeDB = new TransactionEntityFacadeDB();
    }

    // Database interactions happen here.
    @Override
    public String create(String type, String personKey, String bankKey)
    {
      AccountDB acc = new AccountDB();
      acc.setAccountType(type);
      acc.setPersonKey(personKey);
      acc.setBankKey(bankKey);
      acc.setHoldings(0);
      try
      {
        EntityManager em = EMF.getEntityManager();
        em.getTransaction().begin();
        em.persist(acc);
        em.getTransaction().commit();
        em.close();
        return "OK";
      }
      catch (Exception e)
      {
        return "FAILED";
      }
    }

    @Override
    public List<AccountDB> findByPersonKey(String key)
    {
      EntityManager em = EMF.getEntityManager();
      Query query = em.createQuery("SELECT a FROM AccountDB a WHERE a.personKey = :key", AccountDB.class).setParameter("key", key);
      return query.getResultList();
    }

    @Override
    public List<AccountDB> findById(int id)
    {
      EntityManager em = EMF.getEntityManager();
      Query query = em.createQuery("SELECT a FROM AccountDB a WHERE a.id = :id", AccountDB.class).setParameter("id", id);
      return query.getResultList();
    }

    @Override
    public String debit(int id, int amount)
    {
      EntityManager em = EMF.getEntityManager();
      try
      {
        em.getTransaction().begin();
        AccountDB acc = em.find(AccountDB.class, id, LockModeType.PESSIMISTIC_WRITE);
        Date date = Calendar.getInstance().getTime();
        DateFormat dateFormat = new SimpleDateFormat("yyyy-mm-dd hh:mm:ss");
        String created = dateFormat.format(date);
        if(acc.getHoldings() < amount)
        {
          em.getTransaction().rollback();
          transactionEntityFacadeDB.create("DEBIT", amount, created, "FAILED", acc, null);
          return "FAILED";
        }
        acc.setHoldings(acc.getHoldings() - amount);
        String status = transactionEntityFacadeDB.create("DEBIT", amount, created, "OK", acc, em);
        if(status.equals("FAILED"))
        {
          // Failed to create log
          em.getTransaction().rollback();
          return "FAILED";
        }
        em.merge(acc);
        em.getTransaction().commit();
        return "OK";
      }
      catch(Exception e)
      {
        em.getTransaction().rollback();
        return "FAILED";
      }
    }

    @Override
    public String credit(int id, int amount)
    {
      EntityManager em = EMF.getEntityManager();
      try
      {
        em.getTransaction().begin();
        AccountDB acc = em.find(AccountDB.class, id, LockModeType.PESSIMISTIC_WRITE);
        acc.setHoldings(acc.getHoldings() + amount);

        Date date = Calendar.getInstance().getTime();
        DateFormat dateFormat = new SimpleDateFormat("yyyy-mm-dd hh:mm:ss");
        String created = dateFormat.format(date);
        String status = transactionEntityFacadeDB.create("CREDIT", amount, created, "OK", acc, em);
        if(status.equals("FAILED"))
        {
          // Failed to create log
          em.getTransaction().rollback();
          return "FAILED";
        }

        em.merge(acc);
        em.getTransaction().commit();
        return "OK";
      }
      catch(Exception e)
      {
        em.getTransaction().rollback();
        return "FAILED";
      }
    }

    @Override
    public void setupDatabase()
    {
      StorageFacadeDB sf = new StorageFacadeDB();
      sf.emptyStorage();
      AccountDB acc1 = new AccountDB();
      acc1.setAccountType("SAVINGS");
      acc1.setPersonKey("PKEY");
      acc1.setBankKey("BKEY");
      acc1.setHoldings(0);

      AccountDB acc2 = new AccountDB();
      acc2.setAccountType("CHECK");
      acc2.setPersonKey("PKEY2");
      acc2.setBankKey("BKEY2");
      acc2.setHoldings(0);

      EntityManager em = EMF.getEntityManager();
      em.getTransaction().begin();
      em.persist(acc1);
      em.persist(acc2);
      em.getTransaction().commit();
      em.close();
    }
}
