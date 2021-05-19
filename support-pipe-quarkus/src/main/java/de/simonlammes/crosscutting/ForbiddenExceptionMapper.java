package de.simonlammes.crosscutting;

import io.quarkus.runtime.util.ExceptionUtil;
import io.smallrye.mutiny.CompositeException;
import io.vertx.pgclient.PgException;
import org.jboss.resteasy.reactive.server.ServerExceptionMapper;

import javax.ws.rs.ForbiddenException;
import javax.ws.rs.core.Response;

public class ForbiddenExceptionMapper {

    @ServerExceptionMapper
    public Response mapException(ForbiddenException forbiddenException) {
        return Response.status(Response.Status.FORBIDDEN)
                .entity(forbiddenException.getMessage())
                .build();
    }
}
