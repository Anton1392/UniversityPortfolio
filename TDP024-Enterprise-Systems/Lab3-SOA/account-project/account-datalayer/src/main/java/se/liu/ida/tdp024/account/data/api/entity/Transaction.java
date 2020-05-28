package se.liu.ida.tdp024.account.data.api.entity;

import java.io.Serializable;
import se.liu.ida.tdp024.account.data.impl.db.entity.AccountDB;

public interface Transaction extends Serializable {
    // Define methods (getters and setters for an entity)
    // Like a .h file in c++.
    void setId(int id);
    int getId();

    void setType(String type);
    String getType();

    void setAmount(int amount);
    int getAmount();

    void setCreated(String created);
    String getCreated();

    void setStatus(String status);
    String getStatus();

    void setAccount(AccountDB account);
    AccountDB getAccount();
}
