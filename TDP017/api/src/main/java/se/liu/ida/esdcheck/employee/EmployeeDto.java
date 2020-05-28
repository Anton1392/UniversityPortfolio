package se.liu.ida.esdcheck.employee;

import javax.persistence.*;

@Entity
@Table(name = "employee")
public class EmployeeDto{
    
    @Id
    @Column(name = "id", unique = true, nullable = false)
    @GeneratedValue(generator = "employee_id_seq")
    private int id;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "card_uid", unique = true, nullable = false)
    private long cardUid;

    public EmployeeDto() {
    }

    public EmployeeDto(int id, String firstName, String lastName, long cardUid) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.cardUid = cardUid;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public long getCardUid() {
        return cardUid;
    }

    public void setCardUid(long cardUid) {
        this.cardUid = cardUid;
    }
}
