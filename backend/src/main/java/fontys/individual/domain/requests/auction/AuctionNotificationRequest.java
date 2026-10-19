package fontys.individual.domain.requests.auction;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuctionNotificationRequest {
    private String id;
    private String name;
    private String price;
}
