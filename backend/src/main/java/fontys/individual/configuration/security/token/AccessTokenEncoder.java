package fontys.individual.configuration.security.token;

public interface AccessTokenEncoder {
    String encode(AccessToken accessToken);
}

