package se.liu.ida.esdcheck.check;

import javax.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "esdcheck")
public class EsdCheckDto {
    @Id
    @Column(name = "id", unique = true, nullable = false)
    @GeneratedValue(generator = "esdcheck_id_seq")
    private int id;

    @Column(name = "employee_id", nullable = false)
    private int employeeId;

    @Column(name = "passed", nullable = false)
    private boolean passed;

    @Column(name = "date", nullable = false)
    private Instant date;

    public EsdCheckDto() {
    }

    public EsdCheckDto(int id, int employeeId, boolean passed, Instant date) {
        this.id = id;
        this.employeeId = employeeId;
        this.passed = passed;
        this.date = date;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(int employeeId) {
        this.employeeId = employeeId;
    }

    public boolean isPassed() {
        return passed;
    }

    public void setPassed(boolean passed) {
        this.passed = passed;
    }

    public Instant getDate() {
        return date;
    }

    public void setDate(Instant date) {
        this.date = date;
    }
}
