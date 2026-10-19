package fontys.individual.business.managers;

import fontys.individual.business.converters.OrderConverter;
import fontys.individual.business.exceptions.NotFoundException;
import fontys.individual.business.interfaces.OrderManager;
import fontys.individual.domain.classes.Order;
import fontys.individual.domain.responses.customer.TopSpender;
import fontys.individual.persistence.OrderRepository;
import fontys.individual.persistence.entity.OrderEntity;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
@AllArgsConstructor
public class OrderManagerImpl implements OrderManager {
    private final OrderRepository orderRepository;

    @Transactional
    public Long createOrder(Order order) {
        OrderEntity entity = OrderConverter.convertToOrderEntity(order);
        return orderRepository.save(entity).getId();
    }

    @Transactional
    public void deleteOrder(long id) {
        orderRepository.deleteById(id);
    }

    @Transactional
    public Order getOrderById(long id) {
        Optional<OrderEntity> entity = orderRepository.findById(id);
        if (entity.isPresent())
        {
            return OrderConverter.convertToOrder(entity.get());
        }
        else
        {
            throw new NotFoundException();
        }
    }

    @Transactional
    public List<Order> getAllOrders() {
        List<OrderEntity> allOrders = orderRepository.findAll();
        return allOrders.stream().map(OrderConverter::convertToOrder).toList();
    }

    @Transactional
    public void changeOrderStatus(long id, int status) {
        OrderEntity orderEntity;
        Optional<OrderEntity> savedOrder = orderRepository.findById(id);
        if (savedOrder.isPresent())
        {
            orderEntity = savedOrder.get();
            orderEntity.setStatus(status);
            orderRepository.save(orderEntity);
        }
        else throw new NotFoundException();
    }

    @Transactional
    public List<TopSpender> getTopSpenders() {
        List<Object[]> resultList = orderRepository.findTopSpenders();

        // Manually convert the result set to List<TopSpender>
        List<TopSpender> topSpenders = new ArrayList<>();
        for (Object[] result : resultList) {
            TopSpender topSpender = new TopSpender();
            topSpender.setId((Long) result[0]);
            topSpender.setName((String) result[1]);
            topSpender.setEmail((String) result[2]);
            topSpender.setAge((Integer) result[3]);
            topSpender.setAddress((String) result[4]);
            topSpender.setImage((Byte[]) result[5]);
            topSpender.setTotalAmountSpent((Double) result[6]);
            topSpenders.add(topSpender);
        }

        return topSpenders;
    }
}
