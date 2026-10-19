package fontys.individual.domain.requests.auction;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CreateAuctionRequest {
    private int painting_id;

    private LocalDateTime start_time;

    private LocalDateTime end_time;
}
