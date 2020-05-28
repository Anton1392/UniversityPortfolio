package se.liu.ida.esdcheck;

import com.google.inject.Inject;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.eclipse.jetty.server.Server;
import org.flywaydb.core.Flyway;
import se.liu.ida.esdcheck.auth.AuthenticationService;
import se.liu.ida.esdcheck.auth.Token;

public class EsdCheckApp {
    private static final Logger logger = LogManager.getLogger(EsdCheckApp.class);

    private Flyway flyway;
    private Server server;
    private AuthenticationService authService;

    @Inject
    public EsdCheckApp(Flyway flyway, Server server, AuthenticationService authService) {
        this.flyway = flyway;
        this.server = server;
        this.authService = authService;
    }

    public void run() {
        logger.info("Starting migration");
        flyway.migrate();

        // Dump app token.
        Token appToken = authService.generateInfiniteAppToken();
        logger.info("App JWT token = " + appToken.getJwt());

        try {
            logger.info("Starting server");
            server.start();
            server.join();
        } catch (Exception ex) {
            logger.error("Unhandled exception on main thread.", ex);
        } finally {
            server.destroy();
        }
    }
}
