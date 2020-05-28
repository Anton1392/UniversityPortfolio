package se.liu.ida.esdcheck.check;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;

import javax.persistence.PersistenceException;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import java.time.Instant;
import java.util.List;

public class EsdCheckService {
    private SessionFactory sessionFactory;

    public EsdCheckService(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    public EsdCheck create(EsdCheck esdcheck) {
        esdcheck.setDate(Instant.now());
        EsdCheckDto dto = EsdCheckMapper.INSTANCE.toDto(esdcheck);

        Transaction transaction = null;
        try(Session session = sessionFactory.openSession()) {
            transaction = session.beginTransaction();
            session.save(dto);
            transaction.commit();
            return EsdCheckMapper.INSTANCE.fromDto(dto);
        } catch(PersistenceException ex) {
            if(transaction != null) {
                transaction.rollback();
            }
            throw ex;
        }
    }

    public EsdCheck delete(int id) {
        EsdCheckDto dto = null;
        Transaction transaction = null;
        try(Session session = sessionFactory.openSession()) {
            dto = session.find(EsdCheckDto.class, id);
            if(dto == null)
                throw new IllegalStateException("Can't find EsdCheck");
            // Remove EsdCheck from Database
            transaction = session.beginTransaction();
            session.remove(dto);
            transaction.commit();
            // Return EsdCheck
            return EsdCheckMapper.INSTANCE.fromDto(dto);
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

    public List<EsdCheck> all() {
        try (Session session = sessionFactory.openSession()) {
            CriteriaBuilder criteriaBuilder = session.getCriteriaBuilder();
            CriteriaQuery<EsdCheckDto> query = criteriaBuilder.createQuery(EsdCheckDto.class);
            Root<EsdCheckDto> root = query.from(EsdCheckDto.class);
            query.select(root);

            return EsdCheckMapper.INSTANCE.fromDtos(session.createQuery(query)
                    .getResultList());
        }
    }

    public EsdCheck get(int id) {
        try(Session session = sessionFactory.openSession()) {
            EsdCheckDto dto = session.find(EsdCheckDto.class, id);
            return EsdCheckMapper.INSTANCE.fromDto(dto);
        }
    }

    public List<EsdCheck> getByEmployeeId(int employeeId) {
        try (Session session = sessionFactory.openSession()) {
            CriteriaBuilder criteriaBuilder = session.getCriteriaBuilder();
            CriteriaQuery<EsdCheckDto> query = criteriaBuilder.createQuery(EsdCheckDto.class);
            Root<EsdCheckDto> root = query.from(EsdCheckDto.class);

            query.select(root);
            query.where(criteriaBuilder.equal(root.get("employeeId"), employeeId));
            query.orderBy(criteriaBuilder.desc(root.get("date")));

            return EsdCheckMapper.INSTANCE.fromDtos(session.createQuery(query)
                    .getResultList());
        }
    }
}
