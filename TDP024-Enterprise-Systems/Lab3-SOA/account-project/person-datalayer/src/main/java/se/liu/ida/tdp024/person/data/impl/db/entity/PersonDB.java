package se.liu.ida.tdp024.person.data.impl.db.entity;

import se.liu.ida.tdp024.person.data.api.entity.Person;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class PersonDB implements Person {
    // Implement getters and setters
    // Mark with @Entity for JPA
    // Define variables to store in database.

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int id;

    private String name;
    private String personKey;

    @Override
    public void setId(int id)
    {
      this.id = id;
    }

    @Override
    public int getId()
    {
      return this.id;
    }

    @Override
    public void setName(String name)
    {
      this.name = name;
    }

    @Override
    public String getName()
    {
      return this.name;
    }

    @Override
    public void setPersonKey(String personKey)
    {
      this.personKey = personKey;
    }

    @Override
    public String getPersonKey()
    {
      return this.personKey;
    }
}
