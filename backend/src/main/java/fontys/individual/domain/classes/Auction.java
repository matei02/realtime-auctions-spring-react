package fontys.individual.domain.classes;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Auction {

    private Long id;

    private int paintingId;

    private int highestBid;

    private int highestBidderId;

    private LocalDateTime startTime;

    private LocalDateTime endTime;
}
