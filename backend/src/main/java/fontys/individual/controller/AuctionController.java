package fontys.individual.controller;

import fontys.individual.business.exceptions.NotFoundException;
import fontys.individual.business.interfaces.AuctionManager;
import fontys.individual.domain.classes.Auction;
import fontys.individual.domain.requests.auction.CreateAuctionRequest;
import fontys.individual.domain.requests.auction.UpdateBiddingInfoRequest;
import fontys.individual.domain.responses.auction.CreateAuctionResponse;
import fontys.individual.domain.responses.auction.GetAuctionByIdResponse;
import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@RestController
@RequestMapping("/auctions")
@CrossOrigin(origins = {"http://localhost:5173"})
@AllArgsConstructor
public class AuctionController {
    private final AuctionManager auctionManager;

    private static final DateTimeFormatter formatter =
            DateTimeFormatter.ofPattern("MM/dd/yyyy HH:mm", Locale.ENGLISH);


//    @RolesAllowed("ADMIN")
//    @GetMapping("{id}")
//    public ResponseEntity<GetAuctionByIdResponse> getAuctionById(@PathVariable ("id") long id)
//    {
//        Auction auction = auctionManager.getAuctionById(id);
//        GetAuctionByIdResponse response = GetAuctionByIdResponse.builder().auction(auction).build();
//        return ResponseEntity.ok(response);
//    }

    @RolesAllowed("ADMIN")
    @PostMapping()
    public ResponseEntity<CreateAuctionResponse> startAuction(@RequestBody @Valid CreateAuctionRequest request)
    {
        Auction auction = Auction.builder().id(0L).paintingId(request.getPainting_id()).highestBid(0).highestBidderId(0).startTime(request.getStart_time()).endTime(null).build();
        Long id = auctionManager.createAuction(auction);
        CreateAuctionResponse response = CreateAuctionResponse.builder().id(id).build();
        return ResponseEntity.ok(response);
    }

    @RolesAllowed({"ADMIN", "CUSTOMER"})
    @GetMapping("{id}")
    public ResponseEntity<GetAuctionByIdResponse> getAuctionByPaintingId(@PathVariable ("id") long id)
    {
        Auction auction = auctionManager.getAuctionByPaintingID(id);
        GetAuctionByIdResponse response = GetAuctionByIdResponse.builder().auction(auction).build();
        return ResponseEntity.ok(response);
    }

    @RolesAllowed("ADMIN")
    @PutMapping("/end/{id}")
    public ResponseEntity<Void> endAuction(@PathVariable ("id") long id)
    {
        Auction auction = auctionManager.getAuctionById(id);
        String formattedDateTime = LocalDateTime.now().format(formatter);
        LocalDateTime endTime = LocalDateTime.parse(formattedDateTime, formatter);
        auction.setEndTime(endTime);
        auctionManager.endAuction(id, auction);
        return ResponseEntity.ok().build();
    }

    @RolesAllowed("CUSTOMER")
    @PutMapping("{id}")
    public ResponseEntity<HttpStatus> updateBiddingInfo(@PathVariable ("id") long id, @RequestBody UpdateBiddingInfoRequest request)
    {
        auctionManager.updateBiddingInfoByAuctionId(id, request.getMoney(), request.getBidderId());
        return ResponseEntity.noContent().build();
    }

    @RolesAllowed("ADMIN")
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteAuction(@PathVariable ("id") long paintingID)
    {
        Auction auction = auctionManager.getAuctionByPaintingID(paintingID);
        if (auction != null)
        {
            auctionManager.deleteAuctionByPaintingId(paintingID);
        }
        else throw new NotFoundException();
        return ResponseEntity.noContent().build();
    }
}
