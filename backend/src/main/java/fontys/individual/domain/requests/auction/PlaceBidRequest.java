package fontys.individual.domain.requests.auction;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PlaceBidRequest {
    private Long id;
    private int bidderId;
    private String name;
    private int money;
}
