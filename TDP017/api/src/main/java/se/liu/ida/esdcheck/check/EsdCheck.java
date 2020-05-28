package se.liu.ida.esdcheck.check;

import java.time.Instant;

public class EsdCheck {
    private int id;
    private int employeeId;
    private boolean passed;
    private Instant date;

    public EsdCheck() {
    }

    public EsdCheck(int id, int employeeId, boolean passed, Instant date) {
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
