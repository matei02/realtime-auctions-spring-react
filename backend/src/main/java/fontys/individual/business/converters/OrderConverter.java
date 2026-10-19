package fontys.individual.business.converters;

import fontys.individual.domain.classes.Order;
import fontys.individual.persistence.entity.OrderEntity;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public final class OrderConverter {

    public static Order convertToOrder(OrderEntity entity)
    {
        return Order.builder()
                .id(entity.getId())
                .price(entity.getPrice())
                .name(entity.getName())
                .description(entity.getDescription())
                .length(entity.getLength())
                .width(entity.getWidth())
                .image(entity.getImage())
                .buyer_id(entity.getBuyer_id())
                .status(entity.getStatus())
                .build();
    }

    public static OrderEntity convertToOrderEntity(Order order)
    {
        return OrderEntity.builder()
                .id(order.getId())
                .price(order.getPrice())
                .name(order.getName())
                .description(order.getDescription())
                .length(order.getLength())
                .width(order.getWidth())
                .image(order.getImage())
                .buyer_id(order.getBuyer_id())
                .status(order.getStatus())
                .build();
    }
}
