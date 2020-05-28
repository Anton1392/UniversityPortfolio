package se.liu.ida.tdp024.account.data.api.entity;

import java.io.Serializable;

public interface Account extends Serializable {
    // Define methods (getters and setters for an entity)
    // Like a .h file in c++.
    void setId(int id);
    int getId();

    void setPersonKey(String key);
    String getPersonKey();

    void setAccountType(String type);
    String getAccountType();

    void setBankKey(String key);
    String getBankKey();

    void setHoldings(int amount);
    int getHoldings();
}
