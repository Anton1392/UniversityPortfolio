package se.liu.ida.esdcheck.report;

import se.liu.ida.esdcheck.check.EsdCheck;
import se.liu.ida.esdcheck.employee.Employee;

import java.time.Instant;

public class ReportEmployeeEsdCheck {
    private Employee employee;
    private EsdCheck esdCheck;

    public ReportEmployeeEsdCheck() {
    }

    public ReportEmployeeEsdCheck(Employee employee, EsdCheck esdCheck) {
        this.employee = employee;
        this.esdCheck = esdCheck;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public EsdCheck getEsdCheck() {
        return esdCheck;
    }

    public void setEsdCheck(EsdCheck esdCheck) {
        this.esdCheck = esdCheck;
    }
}
