package fontys.individual.domain.classes;

import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
public class Admin extends User{

    @Builder
    public Admin(final Long id, final String name, final String email, final String password, final Byte[] image)
    {
        super(id, name, email, password, image);
    }
}
