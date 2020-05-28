package se.liu.ida.esdcheck.auth.http;

import com.google.common.net.HttpHeaders;

import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.Provider;
import java.io.IOException;

@Provider
public class CorsPreflightFilter implements ContainerRequestFilter {
    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        if(isPreflight(requestContext)) {
            requestContext.abortWith(buildCorsResponse(requestContext));
        }
    }

    public boolean isPreflight(ContainerRequestContext requestContext) {
        return requestContext.getMethod().equals("OPTIONS");
    }

    public Response buildCorsResponse(ContainerRequestContext requestContext) {
        Response.ResponseBuilder builder = Response.status(Response.Status.OK);
        String requestMethod = requestContext.getHeaderString(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD);
        String requestHeaders = requestContext.getHeaderString(HttpHeaders.ACCESS_CONTROL_REQUEST_HEADERS);

        if(requestMethod != null) {
            String allowedMethods = "GET, PUT, POST, DELETE, OPTIONS";
            builder.header(HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS, allowedMethods);
        }

        if(requestHeaders != null) {
            builder.header(HttpHeaders.ACCESS_CONTROL_ALLOW_HEADERS, requestHeaders);
        }
        return builder.build();
    }
}
