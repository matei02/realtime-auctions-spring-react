package fontys.individual.persistence;

import fontys.individual.persistence.entity.ArtEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArtRepository extends JpaRepository<ArtEntity, Long> {

//    boolean existsById(long id);
//
//    boolean existsByName(String name);
//
//    ArtEntity findById(long id);
//
//    List<ArtEntity> findAll();
//
//    ArtEntity save(ArtEntity entity);
//
//    void deletePaintingById(long id);
//
//    void updatePainting(long id, Painting painting);
//
//    int count();

}
