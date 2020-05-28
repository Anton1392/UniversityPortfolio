package se.liu.ida.tdp024.bank.data.impl.db.entity;

import se.liu.ida.tdp024.bank.data.api.entity.Bank;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class BankDB implements Bank {
    // Implement getters and setters
    // Mark with @Entity for JPA
    // Define variables to store in database.

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int id;

    private String name;
    private String bankKey;

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
    public void setBankKey(String key)
    {
      this.bankKey = key;
    }

    @Override
    public String getBankKey()
    {
      return this.bankKey;
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
}
