package se.liu.ida.esdcheck.error;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.exception.ConstraintViolationException;

import javax.persistence.PersistenceException;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

@Provider
public class EsdCheckExceptionMapper implements ExceptionMapper<Throwable> {
    private static final Logger LOGGER = LogManager.getLogger(EsdCheckExceptionMapper.class);

    @Override
    public Response toResponse(Throwable throwable) {
        if(throwable instanceof EsdCheckNotFound) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(new EsdCheckErrorMessage("Entity does not exist."))
                    .build();
        }

        if(throwable instanceof EsdCheckException) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new EsdCheckErrorMessage("Illegal request."))
                    .build();
        }

        if(throwable instanceof PersistenceException && throwable.getCause() instanceof ConstraintViolationException) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new EsdCheckErrorMessage("Entity violates database constraint."))
                    .build();
        }

        LOGGER.warn("Unknown throwable caught by mapper.", throwable);
        return Response.serverError()
                .entity(new EsdCheckErrorMessage("An unknown server error occured."))
                .build();
    }
}
