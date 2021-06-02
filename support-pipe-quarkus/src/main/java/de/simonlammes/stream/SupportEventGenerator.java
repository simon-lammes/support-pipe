package de.simonlammes.stream;

import io.smallrye.mutiny.Multi;
import org.eclipse.microprofile.reactive.messaging.Outgoing;

import javax.enterprise.context.ApplicationScoped;
import java.time.Duration;
import java.util.Random;

/**
 * A bean producing random prices every 5 seconds.
 * The prices are written to a AMQP queue (prices). The AMQP configuration is specified in the application configuration.
 */
@ApplicationScoped
public class SupportEventGenerator {

    private Random random = new Random();

    @Outgoing("support-events-outgoing")
    public Multi<SupportEvent> generate() {
        return Multi.createFrom().ticks().every(Duration.ofSeconds(5))
                .onOverflow().drop()
                .map(tick -> new SupportEvent(random.nextInt(100)));
    }

}
