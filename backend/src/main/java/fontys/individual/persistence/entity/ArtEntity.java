package fontys.individual.persistence.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "painting")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArtEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "price")
    private double price;

    @Column(name = "description")
    private String description;

    @Column(name = "name")
    private String name;

    @Column(name = "length")
    private int length;

    @Column(name = "width")
    private int width;

    @Column(name = "image", columnDefinition = "longblob")
    @Lob
    private Byte[] image;

    @Column(name = "auction")
    private int auction;

    @Column(name = "sold")
    private int sold;
}
