package se.liu.ida.tdp024.account.data.api.entity;

import java.io.Serializable;

public interface Person extends Serializable {
    // Define methods (getters and setters for an entity)
    // Like a .h file in c++.
    void setId(int id);
    int getId();

    void setName(String name);
    String getName();

    void setPersonKey(String personKey);
    String getPersonKey();
}
