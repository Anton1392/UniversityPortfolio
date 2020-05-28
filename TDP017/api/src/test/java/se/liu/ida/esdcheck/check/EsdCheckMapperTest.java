package se.liu.ida.esdcheck.check;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
//import se.liu.ida.esdcheck.check.EsdCheckMapperImpl;
//import se.liu.ida.esdcheck.check.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class EsdCheckMapperTest {
    private int id = 7;
    private int employeeId = 3;
    private boolean passed = true;
    private Instant date = Instant.ofEpochMilli(1337);

    private EsdCheck esdCheck;
    private List<EsdCheck> esdChecks;

    private EsdCheckDto dto;
    private List<EsdCheckDto> dtos;

    @BeforeEach
    public void setUp() {
        esdCheck = new EsdCheck(id, employeeId, passed, date);
        esdChecks = new ArrayList<>();
        esdChecks.add(esdCheck);

        dto = new EsdCheckDto(id, employeeId, passed, date);
        dtos = new ArrayList<>();
        dtos.add(dto);
    }

    @Test
    public void testEsdCheckToDto() {
        EsdCheckDto dto = EsdCheckMapper.INSTANCE.toDto(esdCheck);
        Assertions.assertEquals(id, dto.getId());
        Assertions.assertEquals(employeeId, dto.getEmployeeId());
        Assertions.assertEquals(passed, dto.isPassed());
        Assertions.assertEquals(date, dto.getDate());
    }

    @Test
    public void testEsdChecksToDtos() {
        List<EsdCheckDto> dtos = EsdCheckMapper.INSTANCE.toDtos(esdChecks);
        Assertions.assertEquals(1, dtos.size());

        dto = dtos.get(0);
        Assertions.assertEquals(id, dto.getId());
        Assertions.assertEquals(employeeId, dto.getEmployeeId());
        Assertions.assertEquals(passed, dto.isPassed());
        Assertions.assertEquals(date, dto.getDate());
    }

    @Test
    public void testDtoToEsdCheck() {
        EsdCheck esdCheck = EsdCheckMapper.INSTANCE.fromDto(dto);
        Assertions.assertEquals(id, esdCheck.getId());
        Assertions.assertEquals(employeeId, esdCheck.getEmployeeId());
        Assertions.assertEquals(passed, esdCheck.isPassed());
        Assertions.assertEquals(date, esdCheck.getDate());
    }

    @Test
    public void testDtosToEsdChecks() {
        List<EsdCheck> esdChecks = EsdCheckMapper.INSTANCE.fromDtos(dtos);
        Assertions.assertEquals(1, esdChecks.size());

        EsdCheck esdCheck = esdChecks.get(0);
        Assertions.assertEquals(id, esdCheck.getId());
        Assertions.assertEquals(employeeId, esdCheck.getEmployeeId());
        Assertions.assertEquals(passed, esdCheck.isPassed());
        Assertions.assertEquals(date, esdCheck.getDate());
    }
}
