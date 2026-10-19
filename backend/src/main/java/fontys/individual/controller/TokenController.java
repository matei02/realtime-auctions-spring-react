package fontys.individual.controller;

import fontys.individual.configuration.security.token.AccessToken;
import fontys.individual.configuration.security.token.AccessTokenDecoder;
import fontys.individual.domain.requests.token.CheckRoleOnTokenRequest;
import fontys.individual.domain.responses.token.CheckRoleOnTokenResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/token")
public class TokenController {
    private final AccessTokenDecoder accessTokenDecoder;

    @PostMapping
    public ResponseEntity<CheckRoleOnTokenResponse> getRole(@RequestBody @Valid CheckRoleOnTokenRequest request)
    {
        String accessToken = request.getAccessToken();
        AccessToken token = accessTokenDecoder.decode(accessToken);
        CheckRoleOnTokenResponse response = new CheckRoleOnTokenResponse();
        if (token.getRoles().contains("ADMIN"))
        {
            response.setRole("ADMIN");
            return ResponseEntity.ok(response);
        }
        else if (token.getRoles().contains("CUSTOMER"))
        {
            response.setRole("CUSTOMER");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.noContent().build();
    }
}
