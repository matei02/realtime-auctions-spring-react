package fontys.individual.controller;

import fontys.individual.business.interfaces.AdminManager;
import fontys.individual.domain.classes.Admin;
import fontys.individual.domain.requests.admin.CreateAdminRequest;
import fontys.individual.domain.requests.admin.UpdateAdminRequest;
import fontys.individual.domain.responses.admin.CreateAdminResponse;
import fontys.individual.domain.responses.admin.GetAdminResponse;
import fontys.individual.domain.responses.admin.GetAllAdminsResponse;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:5173"})
@RestController
@RequestMapping("/admins")
@AllArgsConstructor
public class AdminController {

    private final AdminManager adminManager;

    @RolesAllowed({"ADMIN"})
    @GetMapping
    public ResponseEntity<GetAllAdminsResponse> getAllAdmins()
    {
        List<Admin> admins = adminManager.getAllAdmins();
        GetAllAdminsResponse response = GetAllAdminsResponse.builder().allAdmins(admins).build();
        return ResponseEntity.ok(response);
    }

    @RolesAllowed({"ADMIN"})
    @GetMapping("{id}")
    public ResponseEntity<GetAdminResponse> getAdminById(@PathVariable ("id") long id)
    {
        Admin admin = adminManager.getAdminById(id);
        if (admin != null)
        {
            GetAdminResponse adminResponse = GetAdminResponse.builder().admin(admin).build();
            return ResponseEntity.ok(adminResponse); // Return the customer if found
        } else {
            return ResponseEntity.notFound().build(); // Return a 404 Not Found response if customer is not found
        }
    }

    @RolesAllowed({"ADMIN"})
    @PostMapping
    public ResponseEntity<CreateAdminResponse> addNewAdmin(@RequestBody @Valid CreateAdminRequest request)
    {
        Admin admin = new Admin(0L, request.getName(), request.getEmail(), request.getPassword(), null);
        Long id = adminManager.createAdmin(admin);
        if (id != null)
        {
            CreateAdminResponse response = CreateAdminResponse.builder().id(id).name(admin.getName()).build();
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }
        else
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @RolesAllowed({"ADMIN"})
    @PutMapping("{id}")
    public ResponseEntity<Void> updateAdmin(@RequestBody @Valid UpdateAdminRequest request, @PathVariable ("id") long id)
    {
        if (adminManager.getAdminById(id) == null)
        {
            return ResponseEntity.notFound().build();
        }
        else
        {
            Admin admin = new Admin(id, request.getName(), null, request.getPassword(), request.getImage());
            adminManager.updateAdmin(id, admin);
            return ResponseEntity.noContent().build();
        }
    }

    @RolesAllowed({"ADMIN"})
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteAdmin(@PathVariable ("id") long id)
    {
        if (adminManager.getAdminById(id) == null)
        {
            return ResponseEntity.notFound().build();
        }
        else
        {
            adminManager.deleteAdmin(id);
            return ResponseEntity.noContent().build();
        }

    }

}
