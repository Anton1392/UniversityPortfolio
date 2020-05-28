package se.liu.ida.tdp024.bank.data.api.entity;

import java.io.Serializable;

public interface Bank extends Serializable {
    // Define methods (getters and setters for an entity)
    // Like a .h file in c++.
    void setId(int id);
    int getId();

    void setBankKey(String key);
    String getBankKey();

    void setName(String name);
    String getName();
}
