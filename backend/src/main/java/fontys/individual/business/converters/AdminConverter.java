package fontys.individual.business.converters;

import fontys.individual.domain.classes.Admin;
import fontys.individual.persistence.entity.AdminEntity;

public class AdminConverter {
    private AdminConverter() {
    }

    public static Admin convertToAdmin(AdminEntity admin) {
        return Admin.builder()
                .id(admin.getId())
                .name(admin.getName())
                .email(admin.getEmail())
                .password(admin.getPassword())
                .image(admin.getImage())
                .build();
    }

    public static AdminEntity convertToAdminEntity(Admin admin) {
        return AdminEntity.builder()
                .id(admin.getId())
                .name(admin.getName())
                .email(admin.getEmail())
                .password(admin.getPassword())
                .image(admin.getImage())
                .build();
    }
}
