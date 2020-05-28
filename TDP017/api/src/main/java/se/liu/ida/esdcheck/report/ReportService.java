package se.liu.ida.esdcheck.report;

import org.hibernate.SessionFactory;
import se.liu.ida.esdcheck.check.EsdCheck;
import se.liu.ida.esdcheck.employee.Employee;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Root;
import java.util.List;

public class ReportService {
    private SessionFactory sessionFactory;

    public List<ReportEmployeeEsdCheck> getReportEmployeeEsdCheckOrderedByDate() {
        return null;
    }
}
