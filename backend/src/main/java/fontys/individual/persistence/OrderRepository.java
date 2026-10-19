package fontys.individual.persistence;

import fontys.individual.persistence.entity.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderRepository extends JpaRepository<OrderEntity, Long> {

    @Query("SELECT c.id, c.name, c.email, c.age, c.address, c.image, " +
            "SUM(o.price) AS total_amount_spent " +
            "FROM CustomerEntity c " +
            "JOIN OrderEntity o ON c.id = o.buyer_id " +
            "GROUP BY c.id, c.name, c.email, c.age, c.address, c.image " +
            "ORDER BY total_amount_spent DESC")
    List<Object[]> findTopSpenders();

}
