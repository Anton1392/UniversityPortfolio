package se.liu.ida.esdcheck;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.google.inject.AbstractModule;
import com.google.inject.Provides;
import com.google.inject.Singleton;
import com.typesafe.config.Config;
import com.typesafe.config.ConfigFactory;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.flywaydb.core.Flyway;
import org.glassfish.hk2.utilities.binding.AbstractBinder;
import org.glassfish.jersey.jackson.JacksonFeature;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.servlet.ServletContainer;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import se.liu.ida.esdcheck.auth.AuthenticationResource;
import se.liu.ida.esdcheck.auth.AuthenticationService;
import se.liu.ida.esdcheck.auth.RoleDto;
import se.liu.ida.esdcheck.auth.UserDto;
import se.liu.ida.esdcheck.auth.http.CorsOriginFilter;
import se.liu.ida.esdcheck.auth.http.CorsPreflightFilter;
import se.liu.ida.esdcheck.auth.http.SecurityFilter;
import se.liu.ida.esdcheck.check.EsdCheckDto;
import se.liu.ida.esdcheck.check.EsdCheckResource;
import se.liu.ida.esdcheck.check.EsdCheckService;
import se.liu.ida.esdcheck.employee.EmployeeDto;
import se.liu.ida.esdcheck.employee.EmployeeResource;
import se.liu.ida.esdcheck.employee.EmployeeService;
import se.liu.ida.esdcheck.error.EsdCheckExceptionMapper;
import se.liu.ida.esdcheck.json.EsdCheckJacksonObjectMapperProvider;

import java.io.UnsupportedEncodingException;

import static se.liu.ida.esdcheck.auth.AuthenticationService.JWT_ISSUER;

public class EsdCheckModule extends AbstractModule {
    @Provides
    @Singleton
    private Server buildJettyServer(ResourceConfig resourceConfig) {
        int port = 8099;
        Server server = new Server(port);

        ServletContextHandler contextHandler = new ServletContextHandler(ServletContextHandler.NO_SESSIONS);
        contextHandler.setContextPath("/");
        contextHandler.addServlet(new ServletHolder(new ServletContainer(resourceConfig)), "/*");
        server.setHandler(contextHandler);
        return server;
    }

    @Provides
    @Singleton
    private ResourceConfig buildResourceConfig(
            JWTVerifier verifier,
            EmployeeResource employeeResource,
            EsdCheckResource esdCheckResource,
            AuthenticationResource authenticationResource) {
        ResourceConfig resourceConfig = new ResourceConfig();

        // Configure JSON. Custom ObjectMapper provider since we use java8 time classes.
        resourceConfig.register(EsdCheckJacksonObjectMapperProvider.class);
        resourceConfig.register(EsdCheckExceptionMapper.class);
        resourceConfig.register(JacksonFeature.class);

        // Register api endpoints.
        resourceConfig.register(EmployeeResource.class);
        resourceConfig.register(EsdCheckResource.class);
        resourceConfig.register(AuthenticationResource.class);

        // Register filters
        resourceConfig.register(CorsPreflightFilter.class);
        resourceConfig.register(CorsOriginFilter.class);
        resourceConfig.register(SecurityFilter.class);

        // Register premade resource instances. This is done to be able to use guice dependency injection.
        resourceConfig.register(new AbstractBinder() {
            @Override
            protected void configure() {
                bind(employeeResource).to(EmployeeResource.class);
                bind(esdCheckResource).to(EsdCheckResource.class);
                bind(authenticationResource).to(AuthenticationResource.class);
                bind(verifier).to(JWTVerifier.class);
            }
        });

        return resourceConfig;
    }

    @Provides
    private JWTVerifier buildJwtVerifier(Algorithm algorithm) {
        return JWT.require(algorithm)
                .withIssuer(AuthenticationService.JWT_ISSUER)
                .build();
    }

    @Provides
    @Singleton
    private EmployeeResource buildEmployeeResource(EmployeeService employeeService) {
        return new EmployeeResource(employeeService);
    }

    @Provides
    @Singleton
    private EsdCheckResource buildEsdCheckResource(EsdCheckService esdCheckService) {
        return new EsdCheckResource(esdCheckService);
    }

    @Provides
    @Singleton
    private AuthenticationResource buildAuthenticationResource(AuthenticationService authenticationService) {
        return new AuthenticationResource(authenticationService);
    }

    @Provides
    @Singleton
    private EmployeeService buildEmployeeService(SessionFactory sessionFactory) {
        return new EmployeeService(sessionFactory);
    }

    @Provides
    @Singleton
    private EsdCheckService buildEsdCheckService(SessionFactory sessionFactory) {
        return new EsdCheckService(sessionFactory);
    }

    @Provides
    @Singleton
    private AuthenticationService buildAuthencationService(SessionFactory sessionFactory, Algorithm jwtAlgorithm) {
        return new AuthenticationService(sessionFactory, jwtAlgorithm);
    }

    @Provides
    @Singleton
    private Algorithm buildJwtAlgorithm(Config config) throws UnsupportedEncodingException {
        String secret = config.getString("auth.secret");
        return Algorithm.HMAC256(secret);
    }

    @Provides
    @Singleton
    private SessionFactory buildSessionFactory(Config config) {
        String host = config.getString("database.host");
        int port = config.getInt("database.port");
        String dbName = config.getString("database.dbName");
        String username = config.getString("database.username");
        String password = config.getString("database.password");
        String url = String.format("jdbc:postgresql://%s:%d/%s", host, port, dbName);

        Configuration hibernateCfg = new Configuration();
        return hibernateCfg.addAnnotatedClass(EmployeeDto.class)
                .addAnnotatedClass(EsdCheckDto.class)
                .addAnnotatedClass(UserDto.class)
                .addAnnotatedClass(RoleDto.class)
                .setProperty("hibernate.connection.driver_class", "org.postgresql.Driver")
                .setProperty("hibernate.connection.url", url)
                .setProperty("hibernate.connection.username", username)
                .setProperty("hibernate.connection.password", password)
                .buildSessionFactory();
    }

    @Provides
    @Singleton
    private Flyway buildFlyway(Config config) {
        String host = config.getString("database.host");
        int port = config.getInt("database.port");
        String dbName = config.getString("database.dbName");
        String username = config.getString("database.username");
        String password = config.getString("database.password");
        String url = String.format("jdbc:postgresql://%s:%d/%s", host, port, dbName);
        return Flyway.configure()
                .dataSource(url, username, password)
                .load();
    }

    @Provides
    @Singleton
    private Config buildConfig() {
        // Automatically loads "application.json" in resource folder.
        return ConfigFactory.load();
    }
}
