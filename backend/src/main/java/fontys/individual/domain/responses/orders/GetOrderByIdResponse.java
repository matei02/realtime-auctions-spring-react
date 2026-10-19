package fontys.individual.domain.responses.orders;

import fontys.individual.domain.classes.Order;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GetOrderByIdResponse {
    private Order order;
}
