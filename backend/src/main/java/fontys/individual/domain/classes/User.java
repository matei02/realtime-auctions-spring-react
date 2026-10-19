package fontys.individual.domain.classes;

import lombok.*;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public abstract class User {
    private long id;
    private String name;
    private String email;
    private String password;
    private Byte[] image;
}
