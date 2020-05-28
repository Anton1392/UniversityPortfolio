package se.liu.ida.tdp024.account.data.impl.db.entity;

import se.liu.ida.tdp024.account.data.api.entity.Account;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class AccountDB implements Account {
    // Implement getters and setters
    // Mark with @Entity for JPA
    // Define variables to store in database.

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int id;

    private String personKey;
    private String accountType;
    private String bankKey;
    private int holdings;

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
    public void setPersonKey(String key)
    {
      this.personKey = key;
    }

    @Override
    public String getPersonKey()
    {
      return this.personKey;
    }

    @Override
    public void setAccountType(String type)
    {
      this.accountType = type;
    }

    @Override
    public String getAccountType()
    {
      return this.accountType;
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
    public void setHoldings(int amount)
    {
      this.holdings = amount;
    }

    @Override
    public int getHoldings()
    {
      return this.holdings;
    }
}
