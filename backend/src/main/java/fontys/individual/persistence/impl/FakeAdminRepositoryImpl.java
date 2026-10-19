//package fontys.individual.persistence.impl;
//
//import fontys.individual.domain.classes.Admin;
//import fontys.individual.persistence.AdminRepository;
//import fontys.individual.persistence.entity.AdminEntity;
//import org.springframework.stereotype.Repository;
//
//import java.util.ArrayList;
//import java.util.Collections;
//import java.util.List;
//
//@Repository
//public class FakeAdminRepositoryImpl implements AdminRepository {
//    private static long NEXT_ID = 1;
//
//    private final List<AdminEntity> savedAdmins;
//
//    public FakeAdminRepositoryImpl(){this.savedAdmins = new ArrayList<>();}
//
//    @Override
//    public boolean existsById(long id) {
//        return this.savedAdmins
//                .stream()
//                .anyMatch(AdminEntity -> AdminEntity.getId() == id);
//    }
//
//    @Override
//    public boolean existsByEmail(String email)
//    {
//        for (AdminEntity c:
//                savedAdmins) {
//            if (c.getEmail()!=null)
//            {
//                if (email.equals(c.getEmail()))
//                    return true;
//            }
//        }
//        return false;
//    }
//
//    @Override
//    public AdminEntity save(AdminEntity admin) {
//        if (admin.getId() == null)
//        {
//            admin.setId(NEXT_ID);
//            NEXT_ID++;
//        }
//        this.savedAdmins.add(admin);
//        return admin;
//    }
//
//    @Override
//    public List<AdminEntity> findAll() {
//        return Collections.unmodifiableList(savedAdmins);
//    }
//
//    @Override
//    public AdminEntity findById(long id) {
//        return this.savedAdmins
//                .stream()
//                .filter(AdminEntity -> AdminEntity.getId() == id)
//                .findFirst()
//                .orElse(null);
//    }
//
//    @Override
//    public int count() {
//        return savedAdmins.size();
//    }
//
//    @Override
//    public void deleteAdminById(long id) {
//        savedAdmins.remove(findById(id));
//    }
//
//    @Override
//    public void updateAdmin(long id, Admin admin) {
//        if (findById(id) != null)
//        {
//            AdminEntity adminEntity = findById(id);
//            adminEntity.setName(admin.getName());
//            adminEntity.setPassword(admin.getPassword());
//            //savedAdmins.set((int)id, customerEntity);
//        }
//    }
//}
