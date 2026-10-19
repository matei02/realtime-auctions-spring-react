package fontys.individual.business.interfaces;

import fontys.individual.domain.classes.Auction;

public interface AuctionManager {
    Long createAuction(Auction auction);

    Auction getAuctionById(long id);

    Auction getAuctionByPaintingID(long id);

    void updateBiddingInfoByAuctionId(long id, int bid, int bidderID);

    void endAuction(long id, Auction auction);

    void deleteAuctionByPaintingId(long id);

}
