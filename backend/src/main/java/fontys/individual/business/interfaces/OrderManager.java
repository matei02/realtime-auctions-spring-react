package fontys.individual.business.interfaces;

import fontys.individual.domain.classes.Order;
import fontys.individual.domain.responses.customer.TopSpender;

import java.util.List;

public interface OrderManager {
    Long createOrder(Order order);

    void deleteOrder(long id);

    Order getOrderById(long id);

    List<Order> getAllOrders();

    void changeOrderStatus(long id, int status);

    List<TopSpender> getTopSpenders();

}
