package fontys.individual.controller;

import fontys.individual.business.exceptions.ForbiddenException;
import fontys.individual.business.interfaces.CustomerManager;
import fontys.individual.domain.classes.Customer;
import fontys.individual.domain.requests.customer.CreateCustomerRequest;
import fontys.individual.domain.requests.customer.UpdateCustomerRequest;
import fontys.individual.domain.responses.customer.CreateCustomerResponse;
import fontys.individual.domain.responses.customer.GetAllCustomersResponse;
import fontys.individual.domain.responses.customer.GetCustomerResponse;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.security.core.Authentication;


@CrossOrigin(origins = {"http://localhost:5173"})
@RestController
@RequestMapping("/customers")
@AllArgsConstructor
public class CustomerController {

    private final CustomerManager customerManager;

//    @RequestMapping(value = "/{id}", method = RequestMethod.OPTIONS)
//    public ResponseEntity<?> handleOptions() {
//        return ResponseEntity.ok().allow(HttpMethod.PUT, HttpMethod.OPTIONS).build();
//    }

    @RolesAllowed({"ADMIN"})
    @GetMapping
    public ResponseEntity<GetAllCustomersResponse> getAllCustomers()
    {
        List<Customer> customers = customerManager.getAllCustomers();
        GetAllCustomersResponse response = GetAllCustomersResponse.builder().customers(customers).build();
        return ResponseEntity.ok(response);
    }

    @RolesAllowed({"ADMIN", "CUSTOMER"})
    @GetMapping("{id}")
    public ResponseEntity<GetCustomerResponse> getCustomerById(@PathVariable("id") long id)
    {
        Customer response = customerManager.getCustomerById(id);
        if (response != null) {
            GetCustomerResponse customerReponse = GetCustomerResponse.builder().customer(response).build();
            return ResponseEntity.ok(customerReponse); // Return the customer if found
        } else {
            return ResponseEntity.notFound().build(); // Return a 404 Not Found response if customer is not found
        }
    }

    @RolesAllowed({"ADMIN", "CUSTOMER"})
    @PostMapping
    public ResponseEntity<CreateCustomerResponse> createCustomer(@RequestBody @Valid CreateCustomerRequest request)
    {
        Customer customer1 = new Customer(0L, request.getName(), request.getEmail(), request.getPassword(), request.getAge(), request.getAddress(), null);
        Long id = customerManager.createCustomer(customer1);
        CreateCustomerResponse response = CreateCustomerResponse.builder().id(id).name(customer1.getName()).email(customer1.getEmail()).age(customer1.getAge()).address(customer1.getAddress()).build();
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @RolesAllowed({"ADMIN", "CUSTOMER"})
    @PutMapping("{id}")
    public ResponseEntity<Void> updateCustomer(@PathVariable("id") long id,
                                               @RequestBody @Valid UpdateCustomerRequest request,
                                               Authentication authentication) {
        if (authentication.getAuthorities().stream().anyMatch(role -> role.getAuthority().equals("ROLE_ADMIN")) || request.getId() == id)
        {
            if (customerManager.getCustomerById(id) == null)
            {
                return ResponseEntity.notFound().build();
            }
            else
            {
                Customer customer = new Customer(id, request.getName(), null, request.getPassword(), request.getAge(), request.getAddress(), request.getImage());
                customerManager.updateCustomer(id, customer);
                return ResponseEntity.noContent().build();
            }
        }
        else throw new ForbiddenException();
    }

    @RolesAllowed({"ADMIN", "CUSTOMER"})
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable("id") long id)
    {
        if (customerManager.getCustomerById(id) == null)
        {
            return ResponseEntity.notFound().build();
        }
        else
        {
            customerManager.deleteCustomer(id);
            return ResponseEntity.noContent().build();
        }
    }

    //5 WORKING RESTFUL SERVICES
}
