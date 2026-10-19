package fontys.individual.domain.requests.supportchat;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SupportMessage {
    private String role;
    private String name;
    private String message;
}
