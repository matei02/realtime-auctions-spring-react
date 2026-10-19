package fontys.individual.domain.responses.auction;

import fontys.individual.domain.classes.Auction;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class GetAuctionByIdResponse {
    private Auction auction;
}
