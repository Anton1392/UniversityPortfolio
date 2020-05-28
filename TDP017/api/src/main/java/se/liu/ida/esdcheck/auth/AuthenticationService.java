package se.liu.ida.esdcheck.auth;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTCreator;
import com.auth0.jwt.algorithms.Algorithm;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class AuthenticationService {
    public static final String JWT_ISSUER = "esdcheck";

    private SessionFactory sessionFactory;
    private Algorithm jwtAlgorithm;

    public AuthenticationService(SessionFactory sessionFactory, Algorithm jwtAlgorithm) {
        this.sessionFactory = sessionFactory;
        this.jwtAlgorithm = jwtAlgorithm;
    }

    public User createUser(String login, String password) {
        String salt = PasswordHasher.generateSalt();
        String passwordHash = PasswordHasher.hash(password, salt);

        UserDto user = new UserDto();
        user.setLogin(login);
        user.setPasswordHash(passwordHash);
        user.setSalt(salt);

        try (Session session = sessionFactory.openSession()) {
            Transaction trans = session.beginTransaction();
            session.save(user);
            trans.commit();
            return AuthenticationMapper.INSTANCE.userFromDto(user);
        }
    }

    public User getUserByLogin(String login) {
        try (Session session = sessionFactory.openSession()) {
            CriteriaBuilder cb = session.getCriteriaBuilder();
            CriteriaQuery<UserDto> query = cb.createQuery(UserDto.class);
            Root<UserDto> root = query.from(UserDto.class);

            query.select(root);
            query.where(cb.equal(root.get("login"), login));

            List<UserDto> result = session.createQuery(query)
                    .getResultList();

            assert result.size() < 2;
            if(result.isEmpty()) {
                return null;
            } else {
                return AuthenticationMapper.INSTANCE.userFromDto(result.get(0));
            }
        }
    }

    public User authenticateUser(String login, String password) {
        User user = getUserByLogin(login);
        if(user == null) {
            throw new EsdCheckAuthenticationException("User does not exists.");
        }

        if(!PasswordHasher.isCorrectPassword(user, password)) {
            throw new EsdCheckAuthenticationException("Incorrect password.");
        }
        return user;
    }

    public Token generateUserToken(User user) {
        Instant expirationDate = Instant.now().plus(Duration.ofHours(2));
        JWTCreator.Builder builder = JWT.create()
                .withIssuer(JWT_ISSUER)
                .withExpiresAt(Date.from(expirationDate))
                .withClaim("login", user.getLogin());

        List<String> roleNames = new ArrayList<>();
        for(Role role : user.getRoles()) {
            roleNames.add(role.getName());
        }

        // Add to array.
        String[] roleNamesArr = new String[roleNames.size()];
        roleNames.toArray(roleNamesArr);

        builder = builder.withArrayClaim("role", roleNamesArr);
        String jwt = builder.sign(jwtAlgorithm);

        Token token = new Token();
        token.setJwt(jwt);
        return token;
    }

    public Token generateInfiniteAppToken() {
        JWTCreator.Builder builder = JWT.create()
                .withIssuer(JWT_ISSUER)
                .withClaim("login", "app")
                .withArrayClaim("role", new String[] { Role.APP });
        String jwt = builder.sign(jwtAlgorithm);

        Token token = new Token();
        token.setJwt(jwt);
        return token;
    }
}
