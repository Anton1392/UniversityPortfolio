package se.liu.ida.esdcheck.employee;

import se.liu.ida.esdcheck.auth.Role;
import se.liu.ida.esdcheck.auth.http.EsdcheckAuthorized;
import se.liu.ida.esdcheck.error.EsdCheckNotFound;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("employee")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class EmployeeResource {
    private EmployeeService employeeService;

    public EmployeeResource(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @EsdcheckAuthorized
    @GET
    public Response getAllEmployees() {
        List<Employee> employees = employeeService.all();
        return Response.ok(employees)
                .build();
    }

    @EsdcheckAuthorized
    @DELETE
    @Path("delete/{id}")
    public Response deleteEmployee(@PathParam("id") int id) {
        Employee deleted = employeeService.delete(id);
        if(deleted == null) {
            throw new EsdCheckNotFound();
        }
        return Response.ok(deleted)
            .build();
    }

    @EsdcheckAuthorized
    @GET
    @Path("{id}")
    public Response getEmployee(@PathParam("id") int id) {
        Employee employee = employeeService.get(id);
        if(employee == null) {
            throw new EsdCheckNotFound();
        }

        return Response.ok(employee)
            .build();
    }

    @EsdcheckAuthorized(role = Role.APP)
    @GET
    @Path("by_card/{card_uid}")
    public Response getEmployeeByCardUid(@PathParam("card_uid") long cardUid) {
        Employee employee = employeeService.getByCardUid(cardUid);
        if(employee == null) {
            throw new EsdCheckNotFound();
        }

        return Response.ok(employee)
                .build();
    }

    @EsdcheckAuthorized(role = Role.APP)
    @PUT
    public Response createEmployee(Employee employee) {
        Employee created = employeeService.create(employee);
        return Response.ok(created)
                .build();
    }
}
