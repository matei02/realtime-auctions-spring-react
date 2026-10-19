package fontys.individual.persistence;

import fontys.individual.persistence.entity.AdminEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends JpaRepository<AdminEntity, Long> {

//    boolean existsById(long id);
//
     boolean existsByEmail(String email);


    AdminEntity findByEmail(String email);
}
