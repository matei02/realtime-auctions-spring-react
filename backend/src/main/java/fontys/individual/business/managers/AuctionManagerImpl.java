package fontys.individual.business.managers;

import fontys.individual.business.converters.AuctionConverter;
import fontys.individual.business.exceptions.NotFoundException;
import fontys.individual.business.interfaces.AuctionManager;
import fontys.individual.domain.classes.Auction;
import fontys.individual.persistence.AuctionRepository;
import fontys.individual.persistence.entity.AuctionEntity;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@AllArgsConstructor
public class AuctionManagerImpl implements AuctionManager {
    private final AuctionRepository auctionRepository;

    @Transactional
    public Long createAuction(Auction auction) {
        AuctionEntity entity = AuctionConverter.convertToAuctionEntity(auction);
        return auctionRepository.save(entity).getId();
    }

    @Transactional
    public Auction getAuctionById(long id) {
        Optional<AuctionEntity> possibleEntity = auctionRepository.findById(id);
        if (possibleEntity.isEmpty())
        {
            throw new NotFoundException();
        }
        else {
            return AuctionConverter.convertToAuction(possibleEntity.get());
        }
    }

    @Transactional
    public Auction getAuctionByPaintingID(long id){
        AuctionEntity entity = auctionRepository.findBypaintingId(id);
        if (entity != null)
        {
            return AuctionConverter.convertToAuction(entity);
        }
        else return null;
    }

    @Transactional
    public void updateBiddingInfoByAuctionId(long id, int bid, int bidderID)
    {
        Optional<AuctionEntity> possibleEntity = auctionRepository.findById(id);
        if (possibleEntity.isEmpty())
        {
            throw new NotFoundException();
        }
        else {
            AuctionEntity entity = possibleEntity.get();
            entity.setHighestBid(bid);
            entity.setHighestBidderId(bidderID);
            auctionRepository.save(entity);
        }
    }

    @Transactional
    public void endAuction(long id, Auction auction)
    {
        Optional<AuctionEntity> possibleEntity = auctionRepository.findById(id);
        if (possibleEntity.isEmpty())
        {
            throw new NotFoundException();
        }
        else {
            auctionRepository.save(AuctionConverter.convertToAuctionEntity(auction));
        }
    }

    @Transactional
    public void deleteAuctionByPaintingId(long id){
        auctionRepository.deleteBypaintingId(id);
    }
}
