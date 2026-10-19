package fontys.individual.domain.requests.auction;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class EndAuctionRequest {
    private Long id;
}
