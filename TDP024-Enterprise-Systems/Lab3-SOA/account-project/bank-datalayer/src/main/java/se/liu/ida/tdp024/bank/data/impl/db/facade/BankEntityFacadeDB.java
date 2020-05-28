package se.liu.ida.tdp024.bank.data.impl.db.facade;

import se.liu.ida.tdp024.bank.data.api.facade.BankEntityFacade;
import se.liu.ida.tdp024.bank.data.impl.db.entity.BankDB;
import se.liu.ida.tdp024.bank.data.impl.db.util.StorageFacadeDB;

import se.liu.ida.tdp024.bank.data.impl.db.util.EMF;
import javax.persistence.EntityManager;
import javax.persistence.Query;

import java.util.List;

public class BankEntityFacadeDB implements BankEntityFacade {
    // Database interactions happen here.

    @Override
    public List<BankDB> list()
    {
      EntityManager em = EMF.getEntityManager();
      Query query = em.createQuery("SELECT b FROM BankDB b", BankDB.class);
      return query.getResultList();
    }

    @Override
    public BankDB findByName(String name)
    {
      EntityManager em = EMF.getEntityManager();
      Query query = em.createQuery("SELECT b FROM BankDB b WHERE b.name = :name", BankDB.class).setParameter("name", name);
      try
      {
        return (BankDB)query.getResultList().get(0);
      }
      catch (Exception e)
      {
        return null;
      }
    }

    @Override
    public BankDB findByKey(String key)
    {
      EntityManager em = EMF.getEntityManager();
      Query query = em.createQuery("SELECT b FROM BankDB b WHERE b.bankKey = :key", BankDB.class).setParameter("key", key);
      try
      {
        return (BankDB)query.getResultList().get(0);
      }
      catch (Exception e)
      {
        return null;
      }
    }

    @Override
    public void setupDatabase()
    {
      StorageFacadeDB sf = new StorageFacadeDB();
      sf.emptyStorage();

      BankDB b1 = new BankDB(); b1.setBankKey("1"); b1.setName("SWEDBANK");
      BankDB b2 = new BankDB(); b2.setBankKey("2"); b2.setName("IKANOBANKEN");
      BankDB b3 = new BankDB(); b3.setBankKey("3"); b3.setName("JPMORGAN");
      BankDB b4 = new BankDB(); b4.setBankKey("4"); b4.setName("NORDEA");
      BankDB b5 = new BankDB(); b5.setBankKey("5"); b5.setName("CITIBANK");
      BankDB b6 = new BankDB(); b6.setBankKey("6"); b6.setName("HANDELSBANKEN");
      BankDB b7 = new BankDB(); b7.setBankKey("7"); b7.setName("SBAB");
      BankDB b8 = new BankDB(); b8.setBankKey("8"); b8.setName("HSBC");
      BankDB b9 = new BankDB(); b9.setBankKey("9"); b9.setName("NORDNET");

      EntityManager em = EMF.getEntityManager();
      em.getTransaction().begin();
      em.persist(b1);
      em.persist(b2);
      em.persist(b3);
      em.persist(b4);
      em.persist(b5);
      em.persist(b6);
      em.persist(b7);
      em.persist(b8);
      em.persist(b9);
      em.getTransaction().commit();
      em.close();
    }
}
