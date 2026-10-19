package fontys.individual.persistence;

import fontys.individual.persistence.entity.AuctionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuctionRepository extends JpaRepository<AuctionEntity, Long> {
    AuctionEntity findBypaintingId(long id);

    void deleteBypaintingId(long id);
}
