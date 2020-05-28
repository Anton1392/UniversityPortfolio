package se.liu.ida.esdcheck.check;

import se.liu.ida.esdcheck.auth.http.EsdcheckAuthorized;
import se.liu.ida.esdcheck.error.EsdCheckNotFound;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("esdcheck")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class EsdCheckResource {
    private EsdCheckService esdCheckService;
    public EsdCheckResource(EsdCheckService esdCheckService) {
        this.esdCheckService = esdCheckService;
    }

    @EsdcheckAuthorized
    @GET
    public Response getAllEsdChecks() {
        List<EsdCheck> esdChecks = esdCheckService.all();
        return Response.ok(esdChecks)
                .build();
    }

    @EsdcheckAuthorized
    @DELETE
    @Path("delete/{id}")
    public Response deleteEsdCheck(@PathParam("id") int id) {
        EsdCheck deleted = esdCheckService.delete(id);
        if(deleted == null) {
            throw new EsdCheckNotFound();
        }
        return Response.ok(deleted)
            .build();
    }

    @EsdcheckAuthorized
    @GET
    @Path("{id}")
    public Response getEsdCheck(@PathParam("id") int id) {
        EsdCheck esdCheck = esdCheckService.get(id);
        if(esdCheck == null) {
            throw new EsdCheckNotFound();
        }
        return Response.ok(esdCheck)
                .build();
    }

    @EsdcheckAuthorized
    @GET
    @Path("by_employee/{employee_id}")
    public Response getEsdChecksByEmployeeId(
            @PathParam("employee_id") int employeeId,
            @QueryParam("from") Long from,
            @QueryParam("to") Long to) {
        List<EsdCheck> esdChecks = esdCheckService.getByEmployeeId(employeeId);
        return Response.ok(esdChecks)
                .build();
    }

    @EsdcheckAuthorized
    @PUT
    public Response createEsdCheck(EsdCheck esdCheck) {
        EsdCheck created = esdCheckService.create(esdCheck);
        return Response.ok(created)
                .build();
    }
}
