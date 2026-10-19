package fontys.individual.domain.classes;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Customer extends User{
    private final int age;
    private final String address;

    @Builder
    public Customer(final Long id, final String name, final String email, final String password, final int age, final String address, final Byte[] image)
    {
        super(id, name, email, password, image);
        this.age = age;
        this.address = address;
    }

}
