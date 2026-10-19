package fontys.individual.domain.responses.orders;

import fontys.individual.domain.classes.Order;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class GetAllOrdersResponse {
    List<Order> orders;
}
