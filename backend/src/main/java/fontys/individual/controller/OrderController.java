package fontys.individual.controller;

import fontys.individual.business.interfaces.OrderManager;
import fontys.individual.business.interfaces.PaintingManager;
import fontys.individual.domain.classes.Order;
import fontys.individual.domain.classes.Painting;
import fontys.individual.domain.requests.orders.ChangeStatusOfOrderRequest;
import fontys.individual.domain.requests.orders.CreateOrderRequest;
import fontys.individual.domain.responses.customer.TopSpender;
import fontys.individual.domain.responses.orders.CreateOrderResponse;
import fontys.individual.domain.responses.orders.GetAllOrdersResponse;
import fontys.individual.domain.responses.orders.GetOrderByIdResponse;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:5173"})
@RestController
@RequestMapping("/orders")
@AllArgsConstructor
public class OrderController {
    private final OrderManager orderManager;
    private final PaintingManager paintingManager;

    @RolesAllowed("ADMIN")
    @GetMapping()
    public ResponseEntity<GetAllOrdersResponse> getAllOrders(){
        GetAllOrdersResponse response = GetAllOrdersResponse.builder().orders(orderManager.getAllOrders()).build();
        return ResponseEntity.ok(response);
    }

    @RolesAllowed("CUSTOMER")
    @PostMapping()
    public ResponseEntity<CreateOrderResponse> createOrder(@RequestBody @Valid CreateOrderRequest request)
    {
        Order order = new Order(0L, request.getPrice(), request.getName(), request.getDescription(), request.getLength(), request.getWidth(), request.getImage(), request.getBuyer_id(), request.getBuyer_email(), request.getBuyer_address(), request.getStatus());
        Long id = orderManager.createOrder(order);
        Painting painting = paintingManager.getPaintingById(request.getPaintingID());
        painting.setSold(1);
        painting.setAuction(0);
        paintingManager.updatePainting(request.getPaintingID(), painting);
        CreateOrderResponse response = CreateOrderResponse.builder().id(id).build();
        return ResponseEntity.ok(response);
    }

    @RolesAllowed("ADMIN")
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable("id") long id )
    {
        if (orderManager.getOrderById(id) == null)
        {
            return ResponseEntity.notFound().build();
        }
        else {
            orderManager.deleteOrder(id);
            return ResponseEntity.noContent().build();
        }
    }

    @RolesAllowed({"ADMIN", "CUSTOMER"})
    @GetMapping("{id}")
    public ResponseEntity<GetOrderByIdResponse> getOrderById(@PathVariable("id") long id)
    {
        Order order = orderManager.getOrderById(id);
        GetOrderByIdResponse response = GetOrderByIdResponse.builder().order(order).build();
        return ResponseEntity.ok(response);
    }

    @RolesAllowed("ADMIN")
    @PutMapping("{id}")
    public ResponseEntity<Void> changeStatusOfOrder(@PathVariable("id") long id, @RequestBody @Valid ChangeStatusOfOrderRequest request)
    {
        orderManager.changeOrderStatus(id, request.getStatus());
        return ResponseEntity.noContent().build();
    }

    @RolesAllowed("ADMIN")
    @GetMapping("/gettopspenders")
    public ResponseEntity<List<TopSpender>> getTopSpenders() {
        List<TopSpender> topSpenders = orderManager.getTopSpenders();
        return ResponseEntity.ok(topSpenders);
    }

}
