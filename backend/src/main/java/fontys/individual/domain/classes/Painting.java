package fontys.individual.domain.classes;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Painting {
    private Long id;

    private double price;

    private String description;

    private String name;

    private int length;

    private int width;

    private Byte[] image;

    private int auction;

    private int sold;
}
