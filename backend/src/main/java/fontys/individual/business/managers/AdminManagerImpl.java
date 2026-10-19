package fontys.individual.business.managers;

import fontys.individual.business.converters.AdminConverter;
import fontys.individual.business.exceptions.EmailAlreadyUsedException;
import fontys.individual.business.exceptions.NotFoundException;
import fontys.individual.business.interfaces.AdminManager;
import fontys.individual.domain.classes.Admin;
import fontys.individual.persistence.AdminRepository;
import fontys.individual.persistence.entity.AdminEntity;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@AllArgsConstructor
public class AdminManagerImpl implements AdminManager {

    private final AdminRepository adminRepository;
    private PasswordEncoder passwordEncoder;

    @Transactional
    public Long createAdmin(Admin admin)
    {
        if (adminRepository.existsByEmail(admin.getEmail()))
        {
            throw new EmailAlreadyUsedException();
        }
        AdminEntity entity = AdminConverter.convertToAdminEntity(admin);
        String pass = passwordEncoder.encode(entity.getPassword());
        entity.setPassword(pass);
        return adminRepository.save(entity).getId();
    }

    @Transactional
    public void deleteAdmin(long id)
    {
        adminRepository.deleteById(id);
    }

    @Transactional
    public Admin getAdminById(long id)
    {
        Optional<AdminEntity> admin = adminRepository.findById(id);
        if (admin.isPresent())
        {
            return AdminConverter.convertToAdmin(admin.get());
        }
        else
        {
            throw new NotFoundException();
        }
    }

    @Transactional
    public List<Admin> getAllAdmins()
    {
        List<AdminEntity> adminEntities = adminRepository.findAll();
        return adminEntities.stream()
                .map(AdminConverter::convertToAdmin)
                .toList();
    }

    @Transactional
    public void updateAdmin(long id, Admin admin)
    {
        Optional<AdminEntity> savedAdmin = adminRepository.findById(id);
        if (savedAdmin.isPresent())
        {
            AdminEntity entity = savedAdmin.get();
            entity.setName(admin.getName());
            if (!admin.getPassword().isEmpty())
            {
                entity.setPassword(passwordEncoder.encode(admin.getPassword()));
            }
//            if (admin.getImage().length != 0)
//            {
                entity.setImage(admin.getImage());
            //}
            adminRepository.save(entity);
        }
        else
        {
            throw new NotFoundException();
        }
    }

}
