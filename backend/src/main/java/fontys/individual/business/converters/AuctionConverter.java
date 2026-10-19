package fontys.individual.business.converters;

import fontys.individual.domain.classes.Auction;
import fontys.individual.persistence.entity.AuctionEntity;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public final class AuctionConverter {

    public static Auction convertToAuction(AuctionEntity entity)
    {
        return Auction.builder()
                .id(entity.getId())
                .paintingId(entity.getPaintingId())
                .highestBid(entity.getHighestBid())
                .highestBidderId(entity.getHighestBidderId())
                .startTime(entity.getStartTime())
                .endTime(entity.getEndTime())
                .build();
    }

    public static AuctionEntity convertToAuctionEntity(Auction auction)
    {
        return AuctionEntity.builder()
                .id(auction.getId())
                .paintingId(auction.getPaintingId())
                .highestBid(auction.getHighestBid())
                .highestBidderId(auction.getHighestBidderId())
                .startTime(auction.getStartTime())
                .endTime(auction.getEndTime())
                .build();
    }
}
