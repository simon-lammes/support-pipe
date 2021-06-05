package de.simonlammes.crosscutting;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.smallrye.mutiny.CompositeException;
import io.vertx.core.json.JsonObject;

public class JsonDeserializer<T> {
    public T deserialize(JsonObject json, Class<T> classType) {
        try {
            return new ObjectMapper().readValue(json.toString(), classType);
        } catch (JsonProcessingException e) {
            throw new CompositeException(e);
        }
    }
}
