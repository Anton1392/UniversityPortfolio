package se.liu.ida.esdcheck.check;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface EsdCheckMapper {
    EsdCheckMapper INSTANCE = Mappers.getMapper(EsdCheckMapper.class);

    EsdCheckDto toDto(EsdCheck esdCheck);
    List<EsdCheckDto> toDtos(List<EsdCheck> esdChecks);

    EsdCheck fromDto(EsdCheckDto esdCheckDto);
    List<EsdCheck> fromDtos(List<EsdCheckDto> dtos);
}
