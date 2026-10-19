package fontys.individual.business.managers;


import fontys.individual.business.converters.AuctionConverter;
import fontys.individual.business.exceptions.NotFoundException;
import fontys.individual.business.interfaces.AuctionManager;
import fontys.individual.domain.classes.Auction;
import fontys.individual.persistence.AuctionRepository;
import fontys.individual.persistence.entity.AuctionEntity;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
//import org.mockito.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AuctionManagerImplTest {

    @Mock
    private AuctionRepository auctionRepository;

    @InjectMocks
    private AuctionManagerImpl auctionManager;

    @Test
    public void createAuction_Success() {
        // Arrange
        Auction auction = new Auction(1L, 1, 400, 1, null, null);
        AuctionEntity auctionEntity = new AuctionEntity();
        when(auctionRepository.save(any(AuctionEntity.class))).thenReturn(auctionEntity);

        // Act
        Long auctionId = auctionManager.createAuction(auction);

        // Assert
        assertNull(auctionId);
        assertTrue(auctionId > 0);
    }

    @Test
    public void getAuctionById_ExistingId_Success() {
        // Arrange
        long auctionId = 1;
        AuctionEntity auctionEntity = new AuctionEntity();
        auctionEntity.setId(auctionId);
        when(auctionRepository.findById(auctionId)).thenReturn(Optional.of(auctionEntity));

        // Act
        Auction result = auctionManager.getAuctionById(auctionId);

        // Assert
        assertNotNull(result);
        assertEquals(auctionId, result.getId());
    }

    @Test
    public void getAuctionById_NonExistingId_ThrowsNotFoundException() {
        // Arrange
        long nonExistingId = 999;
        when(auctionRepository.findById(nonExistingId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(NotFoundException.class, () -> auctionManager.getAuctionById(nonExistingId));
    }

    @Test
    public void getAuctionByPaintingID_ExistingId_Success() {
        // Arrange
        long paintingId = 1;
        AuctionEntity auctionEntity = new AuctionEntity();
        when(auctionRepository.findBypaintingId(paintingId)).thenReturn(auctionEntity);

        // Act
        Auction result = auctionManager.getAuctionByPaintingID(paintingId);

        // Assert
        assertNotNull(result);
    }

    @Test
    public void getAuctionByPaintingID_NonExistingId_ReturnsNull() {
        // Arrange
        long nonExistingPaintingId = 999;
        when(auctionRepository.findBypaintingId(nonExistingPaintingId)).thenReturn(null);

        // Act
        Auction result = auctionManager.getAuctionByPaintingID(nonExistingPaintingId);

        // Assert
        assertNull(result);
    }

    @Test
    public void updateBiddingInfoByAuctionId_ExistingId_Success() {
        // Arrange
        long auctionId = 1;
        int bid = 100;
        int bidderId = 123;
        AuctionEntity auctionEntity = new AuctionEntity();
        auctionEntity.setId(auctionId);
        when(auctionRepository.findById(auctionId)).thenReturn(Optional.of(auctionEntity));

        // Act
        auctionManager.updateBiddingInfoByAuctionId(auctionId, bid, bidderId);

        // Assert
        assertEquals(bid, auctionEntity.getHighestBid());
        assertEquals(bidderId, auctionEntity.getHighestBidderId());
    }

    @Test
    public void updateBiddingInfoByAuctionId_NonExistingId_ThrowsNotFoundException() {
        // Arrange
        long nonExistingId = 999;
        int bid = 100;
        int bidderId = 123;
        when(auctionRepository.findById(nonExistingId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(NotFoundException.class, () -> auctionManager.updateBiddingInfoByAuctionId(nonExistingId, bid, bidderId));
    }

    @Test
    public void endAuction_ExistingId_Success() {
        // Arrange
        long auctionId = 1;
        Auction auction = new Auction();
        AuctionEntity auctionEntity = new AuctionEntity();
        auctionEntity.setId(auctionId);
        when(auctionRepository.findById(auctionId)).thenReturn(Optional.of(auctionEntity));

        // Act
        auctionManager.endAuction(auctionId, auction);

        // Assert
        Mockito.verify(auctionRepository, Mockito.times(1)).save(any(AuctionEntity.class));
    }

    @Test
    public void endAuction_NonExistingId_ThrowsNotFoundException() {
        // Arrange
        long nonExistingId = 999;
        Auction auction = new Auction();
        when(auctionRepository.findById(nonExistingId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(NotFoundException.class, () -> auctionManager.endAuction(nonExistingId, auction));
    }

    // Additional tests can be added as needed

}
