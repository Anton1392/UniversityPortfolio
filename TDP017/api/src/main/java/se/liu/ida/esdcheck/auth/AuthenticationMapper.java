package se.liu.ida.esdcheck.auth;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface AuthenticationMapper {
    AuthenticationMapper INSTANCE = Mappers.getMapper(AuthenticationMapper.class);

    UserDto userToDto(User user);
    User userFromDto(UserDto userDto);

    RoleDto roleToDto(Role role);
    Role roleFromDto(RoleDto roleDto);
}
