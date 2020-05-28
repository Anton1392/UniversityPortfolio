package se.liu.ida.esdcheck.employee;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface EmployeeMapper {
    EmployeeMapper INSTANCE = Mappers.getMapper(EmployeeMapper.class);

    EmployeeDto toDto(Employee employee);
    List<EmployeeDto> toDtos(List<Employee> employees);

    Employee fromDto(EmployeeDto employeeDto);
    List<Employee> fromDtos(List<EmployeeDto> employeeDtos);
}
