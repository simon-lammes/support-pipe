package de.simonlammes.crosscutting;

import io.quarkus.runtime.util.ExceptionUtil;
import io.smallrye.mutiny.CompositeException;
import io.vertx.pgclient.PgException;
import org.jboss.resteasy.reactive.server.ServerExceptionMapper;

import javax.ws.rs.core.Response;

public class PersistenceExceptionMappers {
    private static String ERR_CODE_UNIQUE_VIOLATION = "23505";

    @ServerExceptionMapper
    public Response mapException(CompositeException topException) {
        Throwable rootException = ExceptionUtil.getRootCause(topException);
        if (rootException.getClass() == PgException.class) {
            PgException pgException = (PgException) rootException;
            if (pgException.getCode().equals(ERR_CODE_UNIQUE_VIOLATION)) {
                return Response.status(Response.Status.CONFLICT)
                        .entity(pgException.getMessage())
                        .build();
            }
        }
        return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity("Unhandled Exception: " + rootException.getMessage())
                .build();
    }
}
