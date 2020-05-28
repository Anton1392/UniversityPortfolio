package se.liu.ida.esdcheck.employee;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;

import javax.persistence.PersistenceException;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import java.util.List;

public class EmployeeService {
    private SessionFactory sessionFactory;

    public EmployeeService(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    public Employee create(Employee employee) {
        EmployeeDto dto = EmployeeMapper.INSTANCE.toDto(employee);
        Transaction transaction = null;
        try(Session session = sessionFactory.openSession()) {
            transaction = session.beginTransaction();
            session.save(dto);
            transaction.commit();
            return EmployeeMapper.INSTANCE.fromDto(dto);
        } catch(PersistenceException ex) {
            if(transaction != null) {
                transaction.rollback();
            }
            throw ex;
        }
    }

    public Employee delete(int id) {
        EmployeeDto dto = null;
        Transaction transaction = null;
        try(Session session = sessionFactory.openSession()) {
            dto = session.find(EmployeeDto.class, id);
            if(dto == null)
                throw new IllegalStateException("Can't find employee");
            // Remove Employee from Database
            transaction = session.beginTransaction();
            session.remove(dto);
            transaction.commit();
            // Return employee
            return EmployeeMapper.INSTANCE.fromDto(dto);
        }
        catch(PersistenceException | IllegalStateException e) {
            throw e;
        }
        finally {
            if(transaction != null) {
                if(transaction.isActive()) {
                    transaction.rollback();
                }
            }
        }
    }

    public List<Employee> all() {
        try (Session session = sessionFactory.openSession()) {
            CriteriaBuilder criteriaBuilder = session.getCriteriaBuilder();
            CriteriaQuery<EmployeeDto> query = criteriaBuilder.createQuery(EmployeeDto.class);
            Root<EmployeeDto> root = query.from(EmployeeDto.class);
            query.select(root);

            return EmployeeMapper.INSTANCE.fromDtos(session.createQuery(query)
                    .getResultList());
        }
    }

    public Employee get(int id) {
        try(Session session = sessionFactory.openSession()) {
            EmployeeDto dto = session.find(EmployeeDto.class, id);
            return EmployeeMapper.INSTANCE.fromDto(dto);
        }
    }

    public Employee getByCardUid(long cardUid) {
        try (Session session = sessionFactory.openSession()) {
            CriteriaBuilder criteriaBuilder = session.getCriteriaBuilder();
            CriteriaQuery<EmployeeDto> query = criteriaBuilder.createQuery(EmployeeDto.class);
            Root<EmployeeDto> root = query.from(EmployeeDto.class);

            query.select(root);
            query.where(criteriaBuilder.equal(root.get("cardUid"), cardUid));

            List<EmployeeDto> employees = session.createQuery(query)
                    .getResultList();

            if(employees.size() > 1) {
                throw new IllegalStateException("Non unique card uid");
            }

            if(employees.size() == 1) {
                return EmployeeMapper.INSTANCE.fromDto(employees.get(0));
            } else {
                return null;
            }
        }
    }
}
