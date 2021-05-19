package de.simonlammes.user;

import io.quarkus.security.Authenticated;
import io.smallrye.mutiny.Uni;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.Claims;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@RequestScoped
@Path("/users")
@Consumes(MediaType.APPLICATION_JSON)
public class UserResource {

    @Inject
    UserRepository userRepository;

    @Inject
    @Claim(standard = Claims.sub)
    String subjectClaim;

    @PUT
    @Path("/me")
    @Authenticated
    @Produces(MediaType.APPLICATION_JSON)
    public Uni<User> put() {
        return userRepository.findBySubjectClaim(subjectClaim)
                .onItem().ifNull()
                .continueWith(() -> {
                    User user = new User();
                    user.setSubjectClaim(subjectClaim);
                    return user;
                }).call(user -> userRepository.persistAndFlush(user));
    }
}
