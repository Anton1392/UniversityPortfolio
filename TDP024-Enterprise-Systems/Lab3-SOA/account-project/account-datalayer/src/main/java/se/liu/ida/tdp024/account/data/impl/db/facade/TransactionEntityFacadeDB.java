package se.liu.ida.tdp024.account.data.impl.db.facade;

import se.liu.ida.tdp024.account.data.api.facade.TransactionEntityFacade;
import se.liu.ida.tdp024.account.data.impl.db.entity.TransactionDB;
import se.liu.ida.tdp024.account.data.impl.db.entity.AccountDB;
import se.liu.ida.tdp024.account.data.impl.db.util.StorageFacadeDB;

import se.liu.ida.tdp024.account.data.impl.db.util.EMF;
import javax.persistence.EntityManager;
import javax.persistence.Query;

import java.util.List;
import java.lang.Boolean;

public class TransactionEntityFacadeDB implements TransactionEntityFacade {
    // Database interactions happen here.
    @Override
    public String create(String type, int amount, String created, String status, AccountDB account, EntityManager em)
    {
      boolean doCommit = false;
      if(em == null)
      {
        doCommit = true;
        em = EMF.getEntityManager();
        em.getTransaction().begin();
      }
      try
      {
        TransactionDB trans = new TransactionDB();
        trans.setType(type);
        trans.setAmount(amount);
        trans.setCreated(created);
        trans.setStatus(status);
        trans.setAccount(account);

        em.persist(trans);

        if(doCommit)
        {
          em.getTransaction().commit();
          em.close();
        }

        return "OK";
      }
      catch(Exception e)
      {
        if(doCommit)
        {
          //em.getTransaction().rollback();
          //em.close();
        }
        return "FAILED";
      }
    }

    @Override
    public List<TransactionDB> findByAccount(int id)
    {
      EntityManager em = EMF.getEntityManager();
      AccountDB acc = em.find(AccountDB.class, id);
      Query query = em.createQuery("SELECT t FROM TransactionDB t WHERE t.account = :account", TransactionDB.class);
      query.setParameter("account", acc);
      return query.getResultList();
    }

    @Override
    public void setupDatabase()
    {
      StorageFacadeDB sf = new StorageFacadeDB();
      sf.emptyStorage();
    }
}
