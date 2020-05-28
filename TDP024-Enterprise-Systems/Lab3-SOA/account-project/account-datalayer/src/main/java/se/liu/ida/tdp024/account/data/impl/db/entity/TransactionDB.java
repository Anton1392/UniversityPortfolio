package se.liu.ida.tdp024.account.data.impl.db.entity;

import se.liu.ida.tdp024.account.data.api.entity.Transaction;
import se.liu.ida.tdp024.account.data.impl.db.entity.AccountDB;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.ManyToOne;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class TransactionDB implements Transaction {
    // Implement getters and setters
    // Mark with @Entity for JPA
    // Define variables to store in database.

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int id;
    private String type;
    private int amount;
    private String created;
    private String status;

    @ManyToOne
    private AccountDB account;

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
    public void setType(String type)
    {
      this.type = type;
    }
    @Override
    public String getType()
    {
      return this.type;
    }
    @Override
    public void setAmount(int amount)
    {
      this.amount = amount;
    }
    @Override
    public int getAmount()
    {
      return this.amount;
    }
    @Override
    public void setCreated(String created)
    {
      this.created = created;
    }
    @Override
    public String getCreated()
    {
      return this.created;
    }
    @Override
    public void setStatus(String status)
    {
      this.status = status;
    }
    @Override
    public String getStatus()
    {
      return this.status;
    }
    @Override
    public void setAccount(AccountDB account)
    {
      this.account = account;
    }
    @Override
    public AccountDB getAccount()
    {
      return this.account;
    }
}
