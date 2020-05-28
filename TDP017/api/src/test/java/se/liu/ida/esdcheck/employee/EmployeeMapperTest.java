package se.liu.ida.esdcheck.employee;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

public class EmployeeMapperTest {
    private int id = 7;
    private String firstName = "Test";
    private String lastName = "Testar";
    private long cardUid = 1337;

    private Employee employee;
    private List<Employee> employees;
    private EmployeeDto dto;
    private List<EmployeeDto> dtos;

    @BeforeEach
    public void setUp() {
        employee = new Employee(id, firstName, lastName, cardUid);
        employees = new ArrayList<>();
        employees.add(employee);

        dto = new EmployeeDto(id, firstName, lastName, cardUid);
        dtos = new ArrayList<>();
        dtos.add(dto);
    }

    @Test
    public void testEmployeeToDto() {
        EmployeeDto dto = EmployeeMapper.INSTANCE.toDto(this.employee);
        Assertions.assertEquals(id, dto.getId());
        Assertions.assertEquals(firstName, dto.getFirstName());
        Assertions.assertEquals(lastName, dto.getLastName());
        Assertions.assertEquals(cardUid, dto.getCardUid());
    }

    @Test
    public void testEmployeesToDtos() {
        List<EmployeeDto> dtos = EmployeeMapper.INSTANCE.toDtos(employees);
        Assertions.assertEquals(1, dtos.size());

        EmployeeDto dto = dtos.get(0);
        Assertions.assertEquals(id, dto.getId());
        Assertions.assertEquals(firstName, dto.getFirstName());
        Assertions.assertEquals(lastName, dto.getLastName());
        Assertions.assertEquals(cardUid, dto.getCardUid());
    }

    @Test
    public void testDtoToEmployee() {
        Employee employee = EmployeeMapper.INSTANCE.fromDto(dto);
        Assertions.assertEquals(id, employee.getId());
        Assertions.assertEquals(firstName, employee.getFirstName());
        Assertions.assertEquals(lastName, employee.getLastName());
        Assertions.assertEquals(cardUid, employee.getCardUid());
    }

    @Test
    public void testDtosToEmployees() {
        List<Employee> employees = EmployeeMapper.INSTANCE.fromDtos(dtos);
        Assertions.assertEquals(1, employees.size());

        Employee employee = employees.get(0);
        Assertions.assertEquals(id, employee.getId());
        Assertions.assertEquals(firstName, employee.getFirstName());
        Assertions.assertEquals(lastName, employee.getLastName());
        Assertions.assertEquals(cardUid, employee.getCardUid());
    }
}
