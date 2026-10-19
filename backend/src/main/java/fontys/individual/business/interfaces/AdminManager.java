package fontys.individual.business.interfaces;

import fontys.individual.domain.classes.Admin;
import java.util.List;

public interface AdminManager {
    Long createAdmin(Admin admin);

    void deleteAdmin(long id);

    Admin getAdminById(long id);

    List<Admin> getAllAdmins();

    void updateAdmin(long id, Admin admin);
}
