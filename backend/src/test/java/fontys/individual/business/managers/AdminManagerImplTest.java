package fontys.individual.business.managers;

import fontys.individual.business.converters.AdminConverter;
import fontys.individual.business.exceptions.EmailAlreadyUsedException;
import fontys.individual.business.exceptions.NotFoundException;
import fontys.individual.domain.classes.Admin;
import fontys.individual.persistence.AdminRepository;
import fontys.individual.persistence.entity.AdminEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

//@ExtendWith(MockitoExtension.class)
class AdminManagerImplTest {

    @Mock
    private AdminRepository adminRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AdminManagerImpl adminManager;// = new AdminManagerImpl(adminRepository, passwordEncoder);

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createAdmin_HappyFlow() {
        Admin admin = new Admin(1L, "John Doe", "user1@example.com", "password", null);

        when(adminRepository.existsByEmail(admin.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("encodedPassword");

        when(adminRepository.save(any(AdminEntity.class))).thenReturn(new AdminEntity(1L, "John Doe", "user1@example.com", "password", null)); // Replace 1L with the expected adminId


        Long adminId = adminManager.createAdmin(admin);

        assertNotNull(adminId);
        verify(adminRepository, times(1)).save(any(AdminEntity.class));
    }

    @Test
    void createAdmin_EmailAlreadyUsed_ThrowsException() {
        Admin admin = new Admin(1L, "John Doe", "user1@example.com", "password", null);

        when(adminRepository.existsByEmail(admin.getEmail())).thenReturn(true);

        assertThrows(EmailAlreadyUsedException.class, () -> {
            adminManager.createAdmin(admin);
        });

        verify(adminRepository, never()).save(any(AdminEntity.class));
    }

    @Test
    void deleteAdmin_HappyFlow() {
        long adminId = 1L;

        doNothing().when(adminRepository).deleteById(adminId);

        assertDoesNotThrow(() -> {
            adminManager.deleteAdmin(adminId);
        });

        verify(adminRepository, times(1)).deleteById(adminId);
    }

    @Test
    void getAdminById_AdminExists_ReturnsAdmin() {
        long adminId = 1L;
        AdminEntity adminEntity = new AdminEntity(1L, "John Doe", "user1@example.com", "password", null);
        Admin expectedAdmin = AdminConverter.convertToAdmin(adminEntity);

        when(adminRepository.findById(adminId)).thenReturn(Optional.of(adminEntity));

        Admin actualAdmin = adminManager.getAdminById(adminId);

        assertEquals(expectedAdmin, actualAdmin);
    }

    @Test
    void getAdminById_AdminDoesNotExist_ThrowsException() {
        long adminId = 1L;

        when(adminRepository.findById(adminId)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> {
            adminManager.getAdminById(adminId);
        });
    }

    @Test
    void getAllAdmins_HappyFlow() {
        List<AdminEntity> adminEntities = new ArrayList<>();
        adminEntities.add(new AdminEntity(1L, "Jane Doe", "user2@example.com", "password", null));
        adminEntities.add(new AdminEntity(1L, "John Doe", "user1@example.com", "password", null));

        when(adminRepository.findAll()).thenReturn(adminEntities);

        List<Admin> admins = adminManager.getAllAdmins();

        assertNotNull(admins);
        assertEquals(adminEntities.size(), admins.size());
    }

    @Test
    void updateAdmin_AdminExists_UpdateSuccessfully() {
        long adminId = 1L;
        Admin adminToUpdate = new Admin(1L, "Jane Doe", "user2@example.com", "password", null);
        AdminEntity existingAdminEntity = new AdminEntity(1L, "John Doe", "user1@example.com", "pass", null);

        when(adminRepository.findById(adminId)).thenReturn(Optional.of(existingAdminEntity));
        when(adminRepository.save(any(AdminEntity.class))).thenReturn(new AdminEntity());

        assertDoesNotThrow(() -> {
            adminManager.updateAdmin(adminId, adminToUpdate);
        });

        verify(adminRepository, times(1)).save(any(AdminEntity.class));
    }

    @Test
    void updateAdmin_AdminDoesNotExist_ThrowsException() {
        long adminId = 1L;
        Admin adminToUpdate = new Admin(1L, "John Doe", "user1@example.com", "password", null);

        when(adminRepository.findById(adminId)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> {
            adminManager.updateAdmin(adminId, adminToUpdate);
        });

        verify(adminRepository, never()).save(any(AdminEntity.class));
    }
}
