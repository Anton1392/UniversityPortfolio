package se.liu.ida.esdcheck.auth;

import se.liu.ida.esdcheck.auth.http.EsdcheckAuthorized;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

@Path("auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthenticationResource {
    private AuthenticationService authenticationService;

    public AuthenticationResource(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @EsdcheckAuthorized
    @PUT
    @Path("user")
    public Response createUser(UserParams requestParams) {
        User createdUser = authenticationService.createUser(requestParams.getLogin(), requestParams.getPassword());
        return Response.ok()
                .build();
    }

    @POST
    public Response authenticateUser(UserParams requestParams) {
        try {
            User user = authenticationService.authenticateUser(requestParams.getLogin(), requestParams.getPassword());
            Token token = authenticationService.generateUserToken(user);
            return Response.ok(token)
                    .build();
        } catch (EsdCheckAuthenticationException ex) {
            return Response.status(401)
                    .build();
        }
    }

    private static class UserParams {
        private String login;
        private String password;

        public String getLogin() {
            return login;
        }

        public String getPassword() {
            return password;
        }
    }
}
