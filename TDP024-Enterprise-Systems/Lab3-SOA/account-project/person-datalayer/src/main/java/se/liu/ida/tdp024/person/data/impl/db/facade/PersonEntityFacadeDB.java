package se.liu.ida.tdp024.person.data.impl.db.facade;

import se.liu.ida.tdp024.person.data.api.facade.PersonEntityFacade;
import se.liu.ida.tdp024.person.data.impl.db.entity.PersonDB;
import se.liu.ida.tdp024.person.data.impl.db.util.StorageFacadeDB;

import se.liu.ida.tdp024.person.data.impl.db.util.EMF;
import javax.persistence.EntityManager;
import javax.persistence.Query;

import java.util.List;

public class PersonEntityFacadeDB implements PersonEntityFacade {
    // Database interactions happen here.
    @Override
    public List<PersonDB> list()
    {
      EntityManager em = EMF.getEntityManager();
      Query query = em.createQuery("SELECT p FROM PersonDB p", PersonDB.class);
      return query.getResultList();
    }

    @Override
    public List<PersonDB> findByName(String name)
    {
      EntityManager em = EMF.getEntityManager();
      Query query = em.createQuery("SELECT p FROM PersonDB p WHERE p.name = :name", PersonDB.class).setParameter("name", name);
      return query.getResultList();
    }

    @Override
    public PersonDB findByKey(String key)
    {
      EntityManager em = EMF.getEntityManager();
      Query query = em.createQuery("SELECT p FROM PersonDB p WHERE p.personKey = :key", PersonDB.class).setParameter("key", key);
      try
      {
        return (PersonDB)query.getResultList().get(0);
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

      PersonDB p1 = new PersonDB(); p1.setPersonKey("1"); p1.setName("Jakob Pogulis");
      PersonDB p2 = new PersonDB(); p2.setPersonKey("2"); p2.setName("Xena");
      PersonDB p3 = new PersonDB(); p3.setPersonKey("3"); p3.setName("Marcus Bendtsen");
      PersonDB p4 = new PersonDB(); p4.setPersonKey("4"); p4.setName("Zorro");
      PersonDB p5 = new PersonDB(); p5.setPersonKey("5"); p5.setName("Q");

      EntityManager em = EMF.getEntityManager();
      em.getTransaction().begin();
      em.persist(p1);
      em.persist(p2);
      em.persist(p3);
      em.persist(p4);
      em.persist(p5);
      em.getTransaction().commit();
      em.close();
    }
}
