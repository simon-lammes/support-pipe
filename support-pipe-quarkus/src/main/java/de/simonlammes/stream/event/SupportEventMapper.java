package de.simonlammes.stream.event;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.smallrye.mutiny.CompositeException;
import io.vertx.core.json.JsonObject;


public class SupportEventMapper {
    public SupportEvent getSupportEvent(JsonObject json) {
        try {
            return new ObjectMapper().readValue(json.toString(), SupportEvent.class);
        } catch (JsonProcessingException e) {
            throw new CompositeException(e);
        }
    }
}
