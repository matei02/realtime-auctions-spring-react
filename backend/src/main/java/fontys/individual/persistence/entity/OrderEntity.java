package fontys.individual.persistence.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigInteger;

@Entity
@Table(name = "orders")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "price")
    private double price;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "length")
    private int length;

    @Column(name = "width")
    private int width;

    @Column(name = "image", columnDefinition = "longblob")
    @Lob
    private Byte[] image;

    @Column(name = "buyer_id")
    private BigInteger buyer_id;

    @Column(name = "status")
    private int status;
}
