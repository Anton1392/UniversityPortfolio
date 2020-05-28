package se.liu.ida.esdcheck.auth.http;

import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.inject.Inject;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.container.ResourceInfo;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.Provider;
import java.io.IOException;
import java.lang.reflect.Method;
import java.util.List;

@Provider
public class SecurityFilter implements ContainerRequestFilter {
    private static final Logger logger = LogManager.getLogger(SecurityFilter.class);

    @Inject
    private JWTVerifier jwtVerifier;

    @Context
    private ResourceInfo resource;

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        // Check if authorization should be verified.
        Method method = resource.getResourceMethod();
        if(!method.isAnnotationPresent(EsdcheckAuthorized.class)) {
            return;
        }

        String authorization = requestContext.getHeaderString(HttpHeaders.AUTHORIZATION);
        if(authorization == null) {
            requestContext.abortWith(buildUnauthorizedResponse());
            return;
        }

        if(!authorization.contains("Bearer ")) {
            requestContext.abortWith(buildUnauthorizedResponse());
            return;
        }

        // Retrieve JWT token and decode it.
        String token = authorization.split("Bearer ")[1];
        String login;
        List<String> roles;
        try {
            DecodedJWT jwtToken = jwtVerifier.verify(token);
            login = jwtToken.getClaim("login").asString();
            roles = jwtToken.getClaim("role").asList(String.class);
        } catch (JWTVerificationException ex) {
            requestContext.abortWith(buildUnauthorizedResponse());
            return;
        }

        EsdcheckAuthorized annotation = method.getAnnotation(EsdcheckAuthorized.class);
        String requiredRole = annotation.role();
        if(requiredRole.equals("")) {
            return;
        }

        // Verify that user has proper role.
        if(roles == null || !roles.contains(requiredRole)) {
            requestContext.abortWith(buildUnauthorizedResponse());
        }
    }

    private Response buildUnauthorizedResponse() {
        return Response.status(Response.Status.UNAUTHORIZED)
                .build();
    }
}
